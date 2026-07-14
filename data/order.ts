"use server";
import { verifySession } from "@/lib/dal";
import {
  getOrdersService,
  getOrderByIdService,
  getInvoiceOrdersService,
  getMineInvoiceOrdersService,
} from "@/services/order";
import { redirect } from "next/navigation";
import { mapOrder } from "./mapper";

/**
 * 🧾 Fetch all orders and map to UI-friendly format
 */
export async function getOrders() {
  try {
    const session = await verifySession();
    if (!session) return [];

    const userId = session.userId as string;
    if (!userId) redirect("/login");

    const orders = await getOrdersService(userId);

    return orders.map(mapOrder);
  } catch (err) {
    console.error("❌ getOrders error:", err);
    return [];
  }
}

/**
 * 🧩 Fetch a single order by ID and map to UI-friendly format
 */
/**
 * 🧠 Wrapper for server-safe access (used in actions or routes)
 */
export async function getOrderById(id: string) {
  try {
    const order = (await getOrderByIdService(id)) as any;
    if (!order) return null;

    const items = order.items.map((item: any) => ({
      id: item._id?.toString() || item.id,
      plateNumber:
        item.truck?.plateNumber || item.truckId?.plateNumber || "Unknown",
      make: item.truck?.make || item.truckId?.make,
      model: item.truck?.model || item.truckId?.model,
      year: item.truck?.year || item.truckId?.year,
      companyName: item.truck?.companyName || item.truckId?.companyName,
      productName: item.product?.name || item.productId?.name,
      quantity: Number(item.quantity),
      price: Number(item.price),
      status: item.status,
      signature: item.signature,
      dispenserName: item.dispenser?.name || item.dispenserId?.name,
      attendantName:
        item.attendance?.attendantId?.userId?.name ||
        item.attendance?.attendantId?.name,
      completedAt: item.status === "completed" ? item.updatedAt : null,
    }));

    return {
      id: order.id,
      orderNumber:
        order.orderNumber || order._id?.toString().slice(-8).toUpperCase(),
      companyName: order.company?.name || order.companyId?.name,
      productId: order.productId?.toString(),
      productName: order.product?.name || order.productId?.name,
      totalAmount: order.totalAmount,
      sellingPrice: order.sellingPrice,
      status: order.status,
      createdAt: order.createdAt,
      collectionDate: order.collectionDate,
      items: items,
    };
  } catch (err) {
    console.error("❌ getOrderById error:", err);
    return null;
  }
}

export async function getInvoiceOrders(invoiceId: string) {
  try {
    const orders = await getInvoiceOrdersService(invoiceId);
    if (!orders.length) return [];

    return orders.map((order: any) => {
      const mappedItems = order.items.map((item: any) => ({
        id: item._id.toString(),
        truckName: item.truckId?.plateNumber || "Unknown Truck",
        quantity: Number(item.quantity || 0),
      }));

      return {
        id: order._id.toString(),
        productName: order.productId?.name || "Unknown Product",
        totalAmount: Number(order.totalAmount || 0),
        items: mappedItems,
      };
    });
  } catch (err) {
    console.error("❌ getInvoiceOrders error:", err);
    return [];
  }
}

export async function getMineInvoiceOrders(invoiceId: string) {
  try {
    const orders = await getInvoiceOrdersService(invoiceId);
    const mineOrders = await getMineInvoiceOrdersService(invoiceId);

    if (!orders.length) return [];

    return mineOrders;
  } catch (err) {
    console.error("❌ getInvoiceOrders error:", err);
    return [];
  }
}
