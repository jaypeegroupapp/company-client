import { connectDB } from "@/lib/db";
import Order from "@/models/order";
import OrderItem from "@/models/order-item";
import mongoose, { Types } from "mongoose";
import { revalidatePath } from "next/cache";

export async function getOrderItemsByOrderIdService(orderId: string) {
  await connectDB();

  const items = await OrderItem.find({
    orderId: new Types.ObjectId(orderId),
  })
    .populate("truckId", "plateNumber")
    .lean();

  return JSON.parse(JSON.stringify(items));
}

export async function getTotalQuantityForProductService(productId: string) {
  const quantityObj = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    // Filter by productId AND pending status
    {
      $match: {
        "order.productId": new mongoose.Types.ObjectId(productId),
        "order.status": "pending",
      },
    },

    // Sum quantity of all items for this product
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: "$quantity" },
      },
    },
  ]);
  return quantityObj[0]?.totalQuantity || 0;
}

export async function getAllOrderItemsService(companyId: string) {
  await connectDB();

  const agg = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    { $match: { "order.companyId": new Types.ObjectId(companyId) } },
    {
      $lookup: {
        from: "trucks",
        localField: "truckId",
        foreignField: "_id",
        as: "truck",
      },
    },
    { $unwind: "$truck" },

    {
      $lookup: {
        from: "companies",
        localField: "order.companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "products",
        localField: "order.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 1,
        orderId: "$order._id",
        productId: "$product._id",
        companyId: "$order.companyId",

        quantity: 1,
        status: 1,
        signature: 1,

        truckId: "$truck._id",
        plateNumber: "$truck.plateNumber",
        make: "$truck.make",
        model: "$truck.model",
        year: "$truck.year",

        companyName: "$company.name",
        productName: "$product.name",
      },
    },
  ]);

  return JSON.parse(JSON.stringify(agg));
}

export async function completeOrderItem(itemId: string, signature?: string) {
  await connectDB();

  try {
    const item = await OrderItem.findById(itemId);

    if (!item) {
      return { success: false, message: "Order item not found." };
    }

    // Don't allow re-completion
    if (item.status === "completed") {
      return { success: false, message: "Order item already completed." };
    }

    item.status = "completed";

    if (signature) {
      item.signature = signature; // base64 PNG
    }

    await item.save();

    // Return the fully populated order item

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ completeOrderItem service error:", error);
    return { success: false, message: "Failed to complete order item." };
  }
}

export async function deleteOrderItemService(
  orderId: string,
  itemId: string,
  userId: string,
  reason?: string
) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get the order to check status
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "Order not found" };
    }

    // Find the order item
    const orderItem = await OrderItem.findById(itemId).session(session);
    if (!orderItem) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "Order item not found" };
    }

    let updatedItem = null;
    let message = "";
    let orderDeleted = false;

    // Handle based on order item status
    switch (orderItem.status) {
      case "pending":
        // PENDING: Delete directly
        await OrderItem.findByIdAndDelete(itemId).session(session);
        message = "Sub-order deleted successfully";

        // Check if any items remain
        const remainingItemsAfterDelete = await OrderItem.find({ orderId }).session(session);
        if (remainingItemsAfterDelete.length === 0) {
          // No items left, delete the order
          await Order.findByIdAndDelete(orderId).session(session);
          orderDeleted = true;
          message = "Order deleted as no items remain";
        } else {
          // Update order total
          const newTotal = remainingItemsAfterDelete.reduce(
            (sum, item) => sum + item.quantity * (order.sellingPrice || 0),
            0
          );
          order.totalAmount = newTotal;
          await order.save({ session });
        }
        break;

      case "accepted":
        // ACCEPTED: Change to returned
        updatedItem = await OrderItem.findByIdAndUpdate(
          itemId,
          {
            $set: {
              status: "returned",
              isReturned: true,
              returnedAt: new Date(),
              returnedReason: reason || "Customer requested return",
              returnedBy: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            session,
            new: true,
            runValidators: false,
          }
        );

        if (!updatedItem) {
          await session.abortTransaction();
          session.endSession();
          return { success: false, message: "Failed to update order item" };
        }

        message = "Sub-order returned successfully";

        // Get remaining non-returned items
        const remainingItems = await OrderItem.find({
          orderId,
          isReturned: { $ne: true },
        }).session(session);

        // Update order total amount (only for non-returned items)
        const newTotalAmount = remainingItems.reduce(
          (sum, item) => sum + item.quantity * (order.sellingPrice || 0),
          0
        );

        order.totalAmount = newTotalAmount;
        await order.save({ session });

        // If no items left (all returned), update order status
        const allItems = await OrderItem.find({ orderId }).session(session);
        const allReturned = allItems.every(item => item.isReturned === true);

        if (allReturned && allItems.length > 0) {
          order.status = "cancelled";
          order.reason = "All items returned";
          await order.save({ session });
        }
        break;

      default:
        // COMPLETED, CANCELLED, or any other status - cannot be modified
        await session.abortTransaction();
        session.endSession();
        return {
          success: false,
          message: `Cannot modify order item with status "${orderItem.status}". Only pending or accepted items can be removed.`,
        };
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message,
      orderDeleted,
      data: {
        itemId: orderItem._id.toString(),
        previousStatus: orderItem.status,
        newStatus: updatedItem?.status || "deleted",
        returnedAt: updatedItem?.returnedAt,
        orderStatus: order.status,
        orderDeleted,
      },
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ deleteOrderItemService error:", error);
    return { success: false, message: error.message };
  }
}