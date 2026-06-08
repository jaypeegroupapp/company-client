"use server";

import { connectDB } from "@/lib/db";
import Order from "@/models/order";
import OrderItem from "@/models/order-item";
import { Types } from "mongoose";
import { CreateOrderInput } from "@/definitions/order";
import Tanker from "@/models/tanker";

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

export async function getAvailableStockForProductService(productId: string) {
  await connectDB();

  // Get total tanker stock for this product
  const tankerStockResult = await Tanker.aggregate([
    {
      $match: {
        productId: new Types.ObjectId(productId),
        isPublished: true,
      },
    },
    {
      $group: {
        _id: null,
        totalStock: { $sum: "$stockLevel" },
      },
    },
  ]);

  const totalTankerStock = tankerStockResult[0]?.totalStock || 0;

  // Get total accepted order quantity for this product
  const acceptedOrdersResult = await Order.aggregate([
    {
      $match: {
        productId: new Types.ObjectId(productId),
        status: "accepted",
      },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "orderId",
        as: "items",
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        totalAccepted: { $sum: "$items.quantity" },
      },
    },
  ]);

  const totalAccepted = acceptedOrdersResult[0]?.totalAccepted || 0;

  // Available stock = physical stock - reserved (accepted orders)
  const availableStock = totalTankerStock - totalAccepted;

  return {
    totalTankerStock,
    totalAccepted,
    availableStock: Math.max(0, availableStock),
  };
}

/**
 * Main order creation function - handles all payment methods with backward compatibility
 */
export async function createOrderService(data: CreateOrderInput) {
  await connectDB();

  const session = await Order.startSession();
  session.startTransaction();

  try {
    const totalOrderQuantity = data.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    // Determine order status based on payment method
    let orderStatus: string = "pending";
    let paymentMethod = data.paymentMethod || "debit";

    // Backward compatibility: check isPaymentGateway flag
    if (data.isPaymentGateway) {
      paymentMethod = "payment_gateway";
    }

    // Handle debit payment (immediate deduction from balance)
    else if (paymentMethod === "credit" || paymentMethod === "debit") {
      const stockInfo = await getAvailableStockForProductService(
        data.productId,
      );
      orderStatus =
        stockInfo.availableStock >= totalOrderQuantity ? "accepted" : "pending";
    }
    // Handle mixed payment (debit + gateway)
    else if (paymentMethod === "payment_gateway" || paymentMethod === "mixed") {
      orderStatus = "payment_pending";
    }

    // Create main order
    const [order] = await Order.create(
      [
        {
          userId: new Types.ObjectId(data.userId),
          mineId: new Types.ObjectId(data.mineId),
          companyId: new Types.ObjectId(data.companyId),
          productId: new Types.ObjectId(data.productId),
          totalAmount: data.totalAmount,
          debit: data.debit || 0,
          credit: data.credit || 0,
          collectionDate: new Date(data.collectionDate),
          status: orderStatus,
          paymentMethod: paymentMethod,
          sellingPrice: data.sellingPrice,
          purchasePrice: data.purchasePrice,
        },
      ],
      { session },
    );

    // Create order items
    if (data.items && data.items.length > 0) {
      let itemStatus = "pending";
      if (orderStatus === "accepted") {
        itemStatus = "accepted";
      }

      const orderItems = data.items.map((item) => ({
        orderId: order._id,
        truckId: new Types.ObjectId(item.truckId),
        productId: new Types.ObjectId(data.productId),
        quantity: item.quantity,
        status: itemStatus,
      }));

      await OrderItem.insertMany(orderItems, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      orderId: order._id.toString(),
      status: orderStatus,
      paymentMethod: paymentMethod,
    };
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

    return { success: true, message: "Order deleted successfully" };
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

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentData: {
    status: string;
    paymentComplete: boolean;
    pfPaymentId?: string;
    amountPaid?: number;
    paymentDate?: Date;
    paymentMethod?: string;
    paymentReference?: string;
  },
) {
  await connectDB();

  const updateData: any = {
    status: paymentData.status,
    paymentComplete: paymentData.paymentComplete,
    updatedAt: new Date(),
  };

  if (paymentData.pfPaymentId) {
    updateData.pfPaymentId = paymentData.pfPaymentId;
  }
  if (paymentData.amountPaid) {
    updateData.amountPaid = paymentData.amountPaid;
  }
  if (paymentData.paymentDate) {
    updateData.paymentDate = paymentData.paymentDate;
  }
  if (paymentData.paymentMethod) {
    updateData.paymentMethod = paymentData.paymentMethod;
  }
  if (paymentData.paymentReference) {
    updateData.paymentReference = paymentData.paymentReference;
  }

  const order = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
  }).lean();

  return order;
}

export async function updateOrder(orderId: string, status: string) {
  await connectDB();
  return await Order.findByIdAndUpdate(
    orderId,
    { status, updatedAt: new Date() },
    { new: true },
  ).lean();
}

export async function deleteMostRecentPendingOrderService(userId: string) {
  await connectDB();

  try {
    // Find the most recent pending or payment_pending order for this user
    const order = await Order.findOne({
      userId: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (!order) {
      return { success: false, message: "No pending order found to delete" };
    }

    // Delete all order items first
    await OrderItem.deleteMany({ orderId: order._id });

    // Delete the order
    await Order.findByIdAndDelete(order._id);

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error: any) {
    console.error("❌ deleteMostRecentPendingOrderService error:", error);
    return { success: false, message: error.message };
  }
}

export async function confirmPaymentAndUpdateOrder(orderId: string) {
  await connectDB();

  const session = await Order.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "payment_pending") {
      throw new Error(
        `Order cannot be confirmed. Current status: ${order.status}`,
      );
    }

    // Calculate total order quantity from items
    const orderItems = await OrderItem.find({ orderId: order._id }).session(
      session,
    );
    const totalOrderQuantity = orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    // Get available stock for this product
    const stockInfo = await getAvailableStockForProductService(
      order.productId.toString(),
    );

    // Determine order status based on available stock
    let orderStatus = "pending";
    if (stockInfo.availableStock >= totalOrderQuantity) {
      orderStatus = "accepted";
    }

    // Update order status
    order.status = orderStatus;
    await order.save({ session });

    // Update order items status
    await OrderItem.updateMany(
      { orderId: order._id },
      { status: orderStatus === "accepted" ? "accepted" : "pending" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, status: orderStatus };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ confirmPaymentAndUpdateOrder error:", error);
    return { success: false, message: error.message };
  }
}

export async function cancelOrderService(orderId: string, reason: string) {
  await connectDB();

  const session = await Order.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "payment_pending") {
      throw new Error(
        `Order cannot be cancelled. Current status: ${order.status}`,
      );
    }

    // Delete order items and order
    await OrderItem.deleteMany({ orderId: order._id }, { session });
    await Order.findByIdAndDelete(orderId, { session });

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ cancelOrderService error:", error);
    return { success: false, message: error.message };
  }
}
