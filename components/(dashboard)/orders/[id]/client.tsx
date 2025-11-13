"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IOrder } from "@/definitions/order";
import { OrderHeader } from "./header";
import { DeleteOrderModal } from "./delete-modal";
import { OrderSummary } from "./summary";
import { OrderItemsList } from "./item-list";

export function OrderDetailsClient({ order }: { order: IOrder }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <OrderHeader
        order={order}
        onBack={() => router.back()}
        onDelete={() => setShowDeleteModal(true)}
      />

      <OrderSummary order={order} />

      {/* 🧩 Order Items Section */}
      <OrderItemsList items={order.items || []} />

      {/* 🗑️ Delete Modal */}
      <DeleteOrderModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        orderId={order.id!}
      />
    </motion.div>
  );
}
