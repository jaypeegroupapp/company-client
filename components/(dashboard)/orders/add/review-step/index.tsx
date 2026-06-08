"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrderAction, createPaymentUrlAction } from "@/actions/order";
import { ITruck } from "@/definitions/truck";
import { IProduct } from "@/definitions/product";
import { ICompanyCredit } from "@/definitions/company-credit";
import { OrderSummary } from "./order-summary";
import { PaymentBreakdown } from "./payment-breakdown";
import { PaymentGatewayInfo } from "./payment-gateway-info";
import { ActionButtons } from "./action-buttons";
import { StatusMessage } from "./status-message";

interface ReviewStepProps {
  selectedMine: ICompanyCredit | null;
  selectedProduct: IProduct | null;
  selectedTrucks: ITruck[];
  quantities: any;
  debit: { debitAmount: number };
  discountAmount: number;
  isGridPlus: boolean;
  collectionDate: string;
  setCollectionDate: (d: string) => void;
  onBack: () => void;
}

export function ReviewStep({
  selectedMine,
  selectedProduct,
  selectedTrucks,
  quantities,
  debit,
  discountAmount,
  isGridPlus,
  collectionDate,
  setCollectionDate,
  onBack,
}: ReviewStepProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!selectedMine || !selectedProduct) {
    return (
      <div className="space-y-4">
        <p className="text-gray-700 text-sm">
          Please complete previous steps before reviewing your order.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>
      </div>
    );
  }

  const purchasePrice = selectedProduct.grid - (selectedProduct.discount || 0);
  const sellingPrice =
    isGridPlus && discountAmount > 0
      ? selectedProduct.grid + discountAmount
      : selectedProduct.grid - discountAmount;

  const getQuantity = (truckId?: string) =>
    truckId ? Number(quantities?.[truckId] || 0) : 0;

  const total = selectedTrucks.reduce((acc, truck) => {
    const qty = getQuantity(truck.id);
    return acc + qty * sellingPrice;
  }, 0);

  const totalLitres = selectedTrucks.reduce(
    (acc, truck) => acc + getQuantity(truck.id),
    0,
  );

  const orderItems = selectedTrucks
    .filter((truck) => Boolean(truck.id))
    .map((truck) => ({
      truckId: truck.id,
      quantity: getQuantity(truck.id),
    }));

  const hasSufficientDebit = total <= debit.debitAmount;
  const debitToUse = Math.min(total, debit.debitAmount);
  const remainingAfterDebit = total - debitToUse;
  const needsPaymentGateway = !hasSufficientDebit && remainingAfterDebit > 0;

  // Handle debit-only or credit order
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const debitPaid = Math.min(total, debit.debitAmount);
      const creditUsed =
        total > debit.debitAmount ? total - debit.debitAmount : 0;

      const orderData = {
        mineId: selectedMine.mineId,
        productId: selectedProduct.id,
        totalAmount: total,
        collectionDate,
        purchasePrice,
        sellingPrice,
        items: orderItems,
        debit: debitPaid,
        credit: creditUsed,
        isPaymentGateway: false, // Explicitly mark as not payment gateway
      };

      const formData = new FormData();
      formData.append("orderData", JSON.stringify(orderData));

      const result = await createOrderAction(formData);

      if (
        result?.message?.toLowerCase().includes("success") ||
        result?.orderId
      ) {
        setMessage("✅ Order created successfully!");
        setTimeout(() => {
          setMessage(null);
          router.push("/orders");
        }, 1500);
      } else {
        setLoading(false);
        setMessage(result?.message || "❌ Failed to create order");
      }
    } catch (error) {
      console.error("createOrderAction error:", error);
      setMessage("❌ Unexpected error occurred.");
    }
  };

  // Handle payment gateway order (credit card / EFT)
  const handlePaymentGateway = async () => {
    try {
      setPaymentLoading(true);
      setMessage(null);

      const debitPaid = Math.min(total, debit.debitAmount);
      const amountToPay = total - debitPaid;

      const orderData = {
        mineId: selectedMine.mineId,
        productId: selectedProduct.id,
        totalAmount: total,
        collectionDate,
        purchasePrice,
        sellingPrice,
        items: orderItems,
        debit: debitPaid,
        credit: 0,
        isPaymentGateway: true, // Mark as payment gateway order
      };

      const formData = new FormData();
      formData.append("orderData", JSON.stringify(orderData));

      const result = await createOrderAction(formData);

      if (!result?.orderId) {
        setMessage(result?.message || "❌ Failed to create order");
        setPaymentLoading(false);
        return;
      }

      const paymentUrl = await createPaymentUrlAction(
        result.orderId,
        amountToPay,
        selectedProduct.name,
      );

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setMessage("❌ Failed to initialize payment gateway");
      }
    } catch (error) {
      console.error("Payment gateway error:", error);
      setMessage("❌ Unexpected error occurred during payment setup.");
    }
  };

  return (
    <div className="space-y-8">
      <OrderSummary
        selectedMine={selectedMine}
        selectedProduct={selectedProduct}
        selectedTrucks={selectedTrucks}
        getQuantity={getQuantity}
        totalLitres={totalLitres}
        collectionDate={collectionDate}
        setCollectionDate={setCollectionDate}
      />

      <PaymentBreakdown
        total={total}
        debitAmount={debit.debitAmount}
        hasSufficientDebit={hasSufficientDebit}
        debitToUse={debitToUse}
        remainingAfterDebit={remainingAfterDebit}
        needsPaymentGateway={needsPaymentGateway}
      />

      <PaymentGatewayInfo
        needsPaymentGateway={needsPaymentGateway}
        debitAmount={debit.debitAmount}
        remainingAfterDebit={remainingAfterDebit}
      />

      <StatusMessage message={message} />

      <ActionButtons
        needsPaymentGateway={needsPaymentGateway}
        collectionDate={collectionDate}
        loading={loading}
        paymentLoading={paymentLoading}
        remainingAfterDebit={remainingAfterDebit}
        onBack={onBack}
        onSubmit={handleSubmit}
        onPaymentGateway={handlePaymentGateway}
      />
    </div>
  );
}
