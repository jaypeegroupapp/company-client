"use client";
import { useEffect, useState } from "react";
import { ITruck } from "@/definitions/truck";
import CreditBalance from "./credit-balance";
import { ICompanyCredit } from "@/definitions/company-credit";

export function QuantityStep({
  selectedMine,
  selectedTrucks,
  quantities,
  debit,
  setQuantities,
  onNext,
  onBack,
}: {
  selectedMine: ICompanyCredit | null;
  selectedTrucks: ITruck[];
  quantities: { [truckId: string]: number };
  debit: { debitAmount: number };
  setQuantities: (q: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<{ [truckId: string]: string }>({});

  const handleQuantityChange = (
    truckId: string,
    value: string,
    tankSize?: number,
  ) => {
    const numericValue = Number(value);

    // Update quantity immediately (so typing feels natural)
    setQuantities({
      ...quantities,
      [truckId]: numericValue,
    });

    // Validation
    if (!value) {
      setErrors((prev) => ({ ...prev, [truckId]: "Quantity is required" }));
      return;
    }

    if (tankSize && numericValue > tankSize) {
      setErrors((prev) => ({
        ...prev,
        [truckId]: `Cannot exceed tank size of ${tankSize}ℓ`,
      }));
    } else {
      // Clear error when valid
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[truckId];
        return updated;
      });
    }
  };

  const canContinue =
    selectedTrucks.every((truck) => {
      if (!truck.id) return false;
      const quantity = quantities[truck.id];
      return typeof quantity === "number" && quantity > 0;
    }) && Object.keys(errors).length === 0;

  useEffect(() => {
    for (const truck of selectedTrucks) {
      if (truck.id && !quantities[truck.id]) {
        setQuantities((prev: any) => ({
          ...prev,
          [truck.id as string]: truck.tankSize,
        }));
      }
    }
  }, [selectedTrucks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Set Quantities</h2>
        <CreditBalance debit={debit} selectedMine={selectedMine} />
      </div>

      <div className="space-y-4">
        {selectedTrucks.map((truck, index) => {
          const truckId = truck.id;
          const error = truckId ? errors[truckId] : undefined;

          return (
            <div
              key={truckId ?? `truck-${index}`}
              className="border border-gray-200 rounded-xl p-4"
            >
              {/* Truck Info */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">
                    {truck.plateNumber} - {truck.make} {truck.model} (
                    {truck.year})
                  </p>

                  <p className="text-xs font-medium text-gray-700">
                    Tank Size: {truck.tankSize} ℓ
                  </p>
                </div>

                <input
                  type="number"
                  min={1}
                  value={quantities[truckId ?? ""] || ""}
                  onChange={(e) =>
                    handleQuantityChange(
                      truckId ?? "",
                      e.target.value,
                      truck.tankSize,
                    )
                  }
                  className={`w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-gray-700"
                  }`}
                  placeholder="Litres"
                />
              </div>

              {/* Error Message */}
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          Back
        </button>

        <button
          disabled={!canContinue}
          onClick={onNext}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
            canContinue
              ? "bg-gray-900 hover:bg-black"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
