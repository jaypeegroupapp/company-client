// src/actions/order-item.ts
"use server";

import { revalidatePath } from "next/cache";
import { deleteOrderItemService } from "@/services/order-item";
import { verifySession } from "@/lib/dal";

export async function deleteOrderItemAction(orderId: string, itemId: string, reason?: string) {
    try {
        const session = await verifySession();
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const userId = session.userId as string;

        const result = await deleteOrderItemService(orderId, itemId, userId, reason);

        if (result.success) {
            revalidatePath(`/orders/${orderId}`);
            revalidatePath("/admin/returns");
        }

        return result;
    } catch (error: any) {
        console.error("❌ deleteOrderItemAction error:", error);
        return { success: false, message: error.message };
    }
}