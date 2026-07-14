// src/components/(dashboard)/orders/[id]/delete-modal.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteOrderAction } from "@/actions/order";

interface Props {
    orderId: string;
    open: boolean;
    onClose: () => void;
}

export function DeleteOrderModal({ orderId, open, onClose }: Props) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        setMessage("");

        startTransition(async () => {
            const result = await deleteOrderAction(orderId);

            if (result.success) {
                setMessage("✅ Order deleted successfully!");
                router.push("/orders");
                router.refresh();
            } else {
                setMessage(`❌ ${result.message}`);
            }
        });
    };

    return (
        <BaseModal open={open} onClose={onClose}>
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle size={24} />
                    <h3 className="text-lg font-semibold">Delete Order</h3>
                </div>

                <p className="text-sm text-gray-600">
                    Are you sure you want to delete this order? This action cannot be undone.
                    <br />
                    <span className="text-xs text-gray-400 mt-1 block">
                        All associated order items will also be deleted.
                    </span>
                </p>

                {message && (
                    <p
                        className={`text-sm p-2 rounded ${message.includes("✅")
                            ? "text-green-600 bg-green-50"
                            : "text-red-600 bg-red-50"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${isPending
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {isPending ? "Processing..." : "Delete Order"}
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}