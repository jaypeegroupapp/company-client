"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { updateCollectionDateAction } from "@/actions/order";

interface Props {
  orderId: string;
  currentDate: string;
  open: boolean;
  onClose: () => void;
}

export function EditCollectionDateModal({
  orderId,
  currentDate,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [collectionDate, setCollectionDate] = useState(
    new Date(currentDate).toISOString().split("T")[0]
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      const result = await updateCollectionDateAction(orderId, collectionDate);

      if (result.success) {
        setMessage("✅ Collection date updated successfully!");
        router.refresh();
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(result.message || "❌ Failed to update collection date.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Edit Collection Date
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="collectionDate"
            className="text-sm text-gray-600 mb-1 block"
          >
            New Collection Date
          </label>
          <input
            type="date"
            id="collectionDate"
            value={collectionDate}
            onChange={(e) => setCollectionDate(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm text-gray-800 focus:ring-1 focus:ring-gray-700 focus:outline-none"
          />
        </div>

        {message && (
          <p
            className={`text-xs ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("❌")
                ? "text-red-600"
                : "text-gray-500"
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
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-black"
            }`}
          >
            {isPending ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
