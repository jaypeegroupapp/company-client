// src/components/(dashboard)/orders/[id]/reschedule-modal.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { Calendar, Check } from "lucide-react";
import { updateCollectionDateAction } from "@/actions/order";

interface Props {
    orderId: string;
    currentDate: string;
    open: boolean;
    onClose: () => void;
}

export function RescheduleOrderModal({
    orderId,
    currentDate,
    open,
    onClose,
}: Props) {
    const router = useRouter();
    const [collectionDate, setCollectionDate] = useState(
        currentDate ? new Date(currentDate).toISOString().split("T")[0] : ""
    );
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!collectionDate) {
            setMessage("❌ Please select a collection date.");
            return;
        }

        startTransition(async () => {
            const result = await updateCollectionDateAction(orderId, collectionDate);

            if (result.success) {
                setMessage("✅ Collection date updated successfully!");
                router.refresh();
                setTimeout(onClose, 1500);
            } else {
                setMessage(`❌ ${result.message}`);
            }
        });
    };

    return (
        <BaseModal open={open} onClose={onClose}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={20} />
                Reschedule Order
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600 mb-1 block" htmlFor="date">
                        New Collection Date
                    </label>
                    <input
                        id="date"
                        type="date"
                        value={collectionDate}
                        onChange={(e) => setCollectionDate(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm text-gray-800 focus:ring-1 focus:ring-gray-700 focus:outline-none"
                        min={new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Current date: {new Date(currentDate).toLocaleDateString("en-ZA")}
                    </p>
                </div>

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
                        type="submit"
                        disabled={isPending}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${isPending
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isPending ? "Processing..." : "Update Date"}
                        <Check size={16} />
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}