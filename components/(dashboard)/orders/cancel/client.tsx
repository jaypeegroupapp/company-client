"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { deleteMostRecentPendingOrderAction } from "@/actions/order";

export default function CancelClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("m_payment_id");
  const [message, setMessage] = useState("Cancelling your order...");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function cancelOrder() {
      try {
        let result: any;

        if (urlOrderId) {
          // If we have an orderId from URL, delete by ID
          const { deleteOrderAction } = await import("@/actions/order");
          result = await deleteOrderAction(urlOrderId);
        } else {
          // Otherwise, delete the most recent pending order
          result = await deleteMostRecentPendingOrderAction();
        }

        if (result && result.success) {
          setMessage(
            result.message ||
              "Your order has been cancelled. You will be redirected shortly.",
          );
          setIsComplete(true);
          setTimeout(() => {
            router.push("/orders");
          }, 2000);
        } else {
          setMessage(
            result.message || "Failed to cancel order. Please contact support.",
          );
          setIsComplete(true);
          setTimeout(() => {
            router.push("/orders");
          }, 2000);
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        setMessage("An error occurred. Please contact support.");
        setIsComplete(true);
        setTimeout(() => {
          router.push("/orders");
        }, 2000);
      }
    }

    cancelOrder();
  }, [urlOrderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {!isComplete && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        )}
      </div>
    </div>
  );
}
