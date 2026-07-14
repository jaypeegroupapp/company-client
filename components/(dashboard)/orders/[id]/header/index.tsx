// src/components/(dashboard)/orders/[id]/header.tsx
"use client";

import { ArrowLeft, Printer, Download, Calendar, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { RescheduleOrderModal } from "./reschedule-modal";
import { DeleteOrderModal } from "./delete-modal";

export function OrderHeader({
  order,
  onBack,
}: {
  order: any;
  onBack: () => void;
}) {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isPending = order.status === "pending";
  const isCompleted = order.status === "completed";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-xl font-semibold text-gray-800">Order Details</h1>

        <div className="flex items-center gap-2">
          {/* Reschedule Button - Only for pending orders */}
          {isPending && (
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
              title="Reschedule Order"
            >
              <Calendar size={18} />
            </button>
          )}

          {/* Edit Button - Only for pending orders */}
          {/* {isPending && (
            <button
              onClick={() => {/ * Navigate to edit page * / }}
              className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 transition"
              title="Edit Order"
            >
              <Edit size={18} />
            </button>
          )} */}

          {/* Delete Button - Only for pending orders */}
          {isPending && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
              title="Delete Order"
            >
              <Trash2 size={18} />
            </button>
          )}

          {isCompleted && (<>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              title="Print Order"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              title="Download PDF"
            >
              <Download size={18} />
            </button>
          </>
          )}

        </div>
      </div>

      {/* Modals */}
      <RescheduleOrderModal
        orderId={order.id}
        currentDate={order.collectionDate}
        open={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
      />

      <DeleteOrderModal
        orderId={order.id}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}