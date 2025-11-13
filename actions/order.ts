"use server";
import { createOrderService, deleteOrderService } from "@/services/order";
import { verifySession } from "@/lib/dal";
import { orderFormSchema } from "@/validations/order";
import { revalidatePath } from "next/cache";
import { updateCollectionDateService } from "@/services/order";

export async function createOrderAction(formData: FormData) {
  try {
    const jsonData = JSON.parse(formData.get("orderData") as string);
    const validated = orderFormSchema.safeParse(jsonData);

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { productId, totalAmount, collectionDate, items } = validated.data;

    const session = await verifySession();
    if (!session) return { message: "Unauthorized", errors: {} };

    const userId = session.userId as string;
    const companyId = session.companyId as string;

    const result = await createOrderService({
      userId,
      companyId,
      productId,
      totalAmount,
      collectionDate,
      items,
    });

    if (!result.success) {
      return {
        message: "Failed to create order",
        errors: { global: [result.message || "Unknown error"] },
      };
    }

    return { message: "Order created successfully", orderId: result.orderId };
  } catch (error: any) {
    console.error("❌ createOrderAction error:", error);
    return {
      message: "Unexpected error occurred",
      errors: { global: [error.message] },
    };
  }
}

export async function updateCollectionDateAction(
  orderId: string,
  collectionDate: string
) {
  try {
    const result = await updateCollectionDateService(orderId, collectionDate);

    if (result.success) {
      // Revalidate the orders page or specific order page
      revalidatePath(`/orders/${orderId}`);
    }

    return result;
  } catch (error) {
    console.error("updateCollectionDateAction error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    const result = await deleteOrderService(orderId);
    return result;
  } catch (error: any) {
    console.error("❌ deleteOrderAction error:", error);
    return { success: false, message: error.message };
  }
}
