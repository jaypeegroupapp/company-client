"use server";
import { verifySession } from "@/lib/dal";
import {
  getAllOrderItemsService,
  getOrderItemsByOrderIdService,
  getTotalQuantityForProductService,
} from "@/services/order-item";

export async function getAllOrderItems() {
  const session = await verifySession();
  if (!session) return null;

  const companyId = session?.companyId as string;

  try {
    const items = await getAllOrderItemsService(companyId);

    return items.map((i: any) => ({
      id: i._id,
      orderId: i.orderId,
      productId: i.productId || null,
      companyId: i.companyId || null,
      quantity: i.quantity,
      status: i.status || "pending",
      signature: i.signature || undefined,
      /** TRUCK DETAILS */
      truckId: i.truckId,
      plateNumber: i.plateNumber,
      make: i.make,
      model: i.model,
      year: i.year,
      /** COMPANY */
      companyName: i.companyName || null,
      /** PRODUCT */
      productName: i.productName || null,
    }));
  } catch (err) {
    console.error("❌ getAllOrderItems error:", err);
    return [];
  }
}

export async function getOrderItemsByOrderId(orderId: string) {
  try {
    const items = await getOrderItemsByOrderIdService(orderId);
    return items.map((i: any) => ({
      id: i._id.toString(),
      truckId: i.truckId?._id || "",
      truckPlate: i.truckId?.plateNumber || "",
      quantity: i.quantity,
    }));
  } catch (err) {
    console.error("❌ getOrderItemsByOrderId error:", err);
    return [];
  }
}

export async function getTotalQuantityForProduct(productId: string) {
  try {
    return await getTotalQuantityForProductService(productId);
  } catch (err) {
    console.error("❌ getOrderItemsByOrderId error:", err);
    return 0;
  }
}
