"use client";

export function QuantityStep({
  selectedTrucks,
  quantities,
  setQuantities,
  onNext,
  onBack,
}: {
  selectedTrucks: any[];
  quantities: { [truckId: string]: number };
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

  const canContinue = selectedTrucks.every(
    (truck) => quantities[truck.id] && quantities[truck.id] > 0
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Set Litre per Truck</h2>
      <div className="space-y-4">
        {selectedTrucks.map((truck) => (
          <div
            key={truck.id}
            className="flex justify-between items-center border border-gray-200 rounded-xl p-4"
          >
            <div>
              <p className="font-medium text-gray-800">{truck.plateNumber}</p>
              <p className="text-xs text-gray-500">
                {truck.make} {truck.model}
              </p>
            </div>
            <input
              type="number"
              min={1}
              value={quantities[truck.id] || ""}
              onChange={(e) => handleQuantityChange(truck.id, e.target.value)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="Litres"
            />
          </div>
        ))}
      </div>

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
