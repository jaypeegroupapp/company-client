"use server";

import { connectDB } from "@/lib/db";
import Order from "@/models/order";
import OrderItem from "@/models/order-item";
import { verifySession } from "@/lib/dal";
import { Types } from "mongoose";
import { CreateOrderInput } from "@/definitions/order";

/**
 * ✅ Get all Orders for the logged-in user
 */
export async function getOrdersService(userId: string) {
  await connectDB();

  try {
    const orders = await Order.find({ userId })
      .populate("userId", "fullName email")
      .populate("companyId", "name")
      .populate("productId", "name price")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(orders));
  } catch (error: any) {
    console.error("❌ getOrdersService error:", error);
    return [];
  }
}

/**
 * ✅ Get a single Order by ID
 */
export async function getOrderByIdService(id: string) {
  await connectDB();
  const order = (await Order.findById(id)
    .populate("productId")
    .populate("mineId")
    .populate("companyId")
    .populate("userId")
    .lean()) as any;

  if (!order) return null;

  // fetch order items
  const items = (await OrderItem.find({ orderId: id })
    .populate("truckId", "registrationNumber plateNumber")
    .lean()) as any[];

  return {
    ...order,
    id: order._id.toString(),
    items,
  };
}
/**
 * ✅ Create a new Order and associated OrderItems
 */
export async function createOrderService(data: CreateOrderInput) {
  await connectDB();

  const session = await Order.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Create main order
    const [order] = await Order.create(
      [
        {
          userId: new Types.ObjectId(data.userId),
          mineId: new Types.ObjectId(data.mineId),
          companyId: new Types.ObjectId(data.companyId),
          productId: new Types.ObjectId(data.productId),
          totalAmount: data.totalAmount,
          debit: data.debit,
          credit: data.credit,
          collectionDate: new Date(data.collectionDate),
          status: data.status || "pending",
          sellingPrice: data.sellingPrice,
          purchasePrice: data.purchasePrice,
        },
      ],
      { session },
    );

    // 2️⃣ Create related order items
    if (data.items && data.items.length > 0) {
      const orderItems = data.items.map((item) => ({
        orderId: order._id,
        truckId: new Types.ObjectId(item.truckId),
        quantity: item.quantity,
      }));

      await OrderItem.insertMany(orderItems, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true, orderId: order._id.toString() };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ createOrderService error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * 🗑️ Delete an order if it's still pending
 */
export async function deleteOrderService(orderId: string) {
  await connectDB();

  try {
    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: "Order not found" };

    if (order.status !== "pending") {
      return {
        success: false,
        message: "Only pending orders can be deleted",
      };
    }

    // Delete related order items first
    await OrderItem.deleteMany({ orderId });
    await Order.findByIdAndDelete(orderId);

    return { success: true };
  } catch (error: any) {
    console.error("❌ deleteOrderService error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Updates the collection date for a given order
 */
export async function updateCollectionDateService(
  orderId: string,
  collectionDate: string,
) {
  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) {
    return { success: false, message: "Order not found" };
  }

  if (order.status !== "pending") {
    return {
      success: false,
      message: "Only pending orders can be rescheduled",
    };
  }

  order.collectionDate = new Date(collectionDate);
  await order.save();

  return { success: true, message: "Collection date updated successfully" };
}

export async function getInvoiceOrdersService(invoiceId: string) {
  await connectDB();

  // Fetch orders linked to this invoice
  const orders = (await Order.find({ invoiceId })
    .populate("productId")
    .lean()) as any[];

  if (!orders.length) return [];

  // Fetch order items for each order
  const finalOrders = await Promise.all(
    orders.map(async (order: any) => {
      const items = (await OrderItem.find({ orderId: order._id })
        .populate("truckId", "plateNumber registrationNumber")
        .lean()) as any[];

      return {
        ...order,
        id: order._id.toString(),
        items,
      };
    }),
  );

  return finalOrders;
}

export async function getMineInvoiceOrdersService(invoiceId: string) {
  await connectDB();

  const results = await OrderItem.aggregate([
    // 1️⃣ Join Orders
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    // 2️⃣ Filter by invoiceId
    {
      $match: {
        "order.invoiceId": new Types.ObjectId(invoiceId),
      },
    },

    // 3️⃣ Join Trucks
    {
      $lookup: {
        from: "trucks",
        localField: "truckId",
        foreignField: "_id",
        as: "truck",
      },
    },
    { $unwind: "$truck" },

    // 4️⃣ Final Shape
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        orderId: { $toString: "$orderId" },
        updateDate: "$updatedAt",
        quantity: "$quantity",
        sellingPrice: "$order.sellingPrice",
        truckId: {
          name: {
            $cond: [
              {
                $and: [
                  { $ifNull: ["$truck.make", false] },
                  { $ifNull: ["$truck.model", false] },
                ],
              },
              { $concat: ["$truck.make", " ", "$truck.model"] },
              "$truck.plateNumber",
            ],
          },
          plateNumber: "$truck.plateNumber",
          registrationNumber: "$truck.registrationNumber",
        },
      },
    },

    // 5️⃣ Sort newest first
    {
      $sort: { updateDate: -1 },
    },
  ]);

  return results;
}
