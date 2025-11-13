"use client";

import { useEffect, useState } from "react";
import { getTrucks } from "@/data/truck";

export function TruckStep({
  selectedTrucks,
  setSelectedTrucks,
  onNext,
  onBack,
}: {
  selectedTrucks: any[];
  setSelectedTrucks: (t: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [trucks, setTrucks] = useState<any[]>([]);

  useEffect(() => {
    async function loadTrucks() {
      const data = await getTrucks();
      setTrucks(data || []);
    }
    loadTrucks();
  }, []);

  const toggleTruck = (truck: any) => {
    if (selectedTrucks.some((t) => t.id === truck.id)) {
      setSelectedTrucks(selectedTrucks.filter((t) => t.id !== truck.id));
    } else {
      setSelectedTrucks([...selectedTrucks, truck]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Trucks</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {trucks.map((t) => (
          <label
            key={t.id}
            className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition ${
              selectedTrucks.some((x) => x.id === t.id)
                ? "border-gray-800 bg-gray-100"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedTrucks.some((x) => x.id === t.id)}
              onChange={() => toggleTruck(t)}
              className="accent-gray-800"
            />
            <div>
              <p className="font-medium text-gray-900">{t.plateNumber}</p>
              <p className="text-sm text-gray-500">
                {t.make} {t.model}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Reg: {t.registrationNumber}
              </p>
            </div>
          </label>
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
          disabled={selectedTrucks.length === 0}
          onClick={onNext}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
            selectedTrucks.length
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
