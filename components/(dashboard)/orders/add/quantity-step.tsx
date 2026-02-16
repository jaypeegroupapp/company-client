"use client";
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
  const handleQuantityChange = (truckId: string, value: string) => {
    setQuantities({
      ...quantities,
      [truckId]: Number(value),
    });
  };

  const buildOptions = (tankSize?: number) => {
    if (!tankSize) return [];

    const full = tankSize;
    const half = tankSize / 2;
    const quarter = tankSize / 4;

    return [
      { label: `Full - ${full}`, value: full },
      { label: `Half - ${half}`, value: half },
      { label: `Quarter - ${quarter}`, value: quarter },
    ];
  };

  const canContinue = selectedTrucks.every((truck) => {
    if (!truck.id) return false;

    const quantity = quantities[truck.id];
    return typeof quantity === "number" && quantity > 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Set Quantities</h2>
        <CreditBalance debit={debit} selectedMine={selectedMine} />
      </div>

      <div className="space-y-4">
        {selectedTrucks.map((truck, index) => {
          const options = buildOptions(truck.tankSize);
          const truckId = truck.id;
          const quantity = truckId ? quantities[truckId] : undefined;
          const selectValue =
            typeof quantity === "number" ? String(quantity) : "";

          return (
            <div
              key={truckId ?? `truck-${index}`}
              className="border border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              {/* LEFT — Truck Details */}
              <div className="space-y-1">
                <p className="font-medium text-gray-800">
                  {truck.plateNumber} - {truck.make} {truck.model} ({truck.year}
                  )
                </p>

                <p className="text-xs font-medium text-gray-700">
                  Tank Size: {truck.tankSize} ℓ
                </p>
              </div>

              <input
              type="number"
              min={1}
              value={quantities[truckId ?? ""] || ""}
              onChange={(e) => handleQuantityChange(truckId ?? "", e.target.value)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="Litres"
            />
              {/* RIGHT — Dropdown Quantity */}
              {/* <select
                value={selectValue}
                onChange={(e) =>
                  truckId && handleQuantityChange(truckId, e.target.value)
                }
                disabled={!truckId}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-700"
              >
                <option value="">Select Litres</option>
                {options.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select> */}
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
