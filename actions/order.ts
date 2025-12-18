"use server";
import { createOrderService, deleteOrderService } from "@/services/order";
import { verifySession } from "@/lib/dal";
import { orderFormSchema } from "@/validations/order";
import { revalidatePath } from "next/cache";
import { updateCollectionDateService } from "@/services/order";
import { updateCompanyCreditService } from "@/services/company-credit";

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

    const {
      productId,
      totalAmount,
      collectionDate,
      items,
      sellingPrice,
      purchasePrice,
      mineId,
      debit,
      credit,
    } = validated.data;

    const session = await verifySession();
    if (!session) return { message: "Unauthorized", errors: {} };

    const userId = session.userId as string;
    const companyId = session.companyId as string;

    // 1️⃣ Check company balance
    const companyCredit = await updateCompanyCreditService(companyId, {
      amount: totalAmount, // Deduct order total
      reason: `Order payment for product ${productId}`,
      type: "order-debit",
    });

    if (companyCredit.newBalance < 0) {
      return {
        message: "❌ Order total exceeds company account balance.",
        errors: {},
      };
    }

    // 2️⃣ Create the order
    const result = await createOrderService({
      userId,
      mineId,
      companyId,
      productId,
      totalAmount,
      collectionDate,
      items,
      sellingPrice,
      purchasePrice,
      debit,
      credit,
    });

    if (!result.success) {
      // Rollback balance if order creation failed
      await updateCompanyCreditService(companyId, {
        amount: totalAmount, // Refund the amount
        reason: `Rollback failed order ${result.orderId}`,
        type: "credit-updated",
      });

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
