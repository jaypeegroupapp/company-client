"use client";

export function TruckList({
  trucks,
  selectedTrucks,
  toggleTruck,
}: {
  trucks: any[];
  selectedTrucks: any[];
  toggleTruck: (t: any) => void;
}) {
  return (
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
  );
}
