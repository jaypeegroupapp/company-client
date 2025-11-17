"use client";

export function TruckSelectAll({
  allSelected,
  toggleSelectAll,
}: {
  allSelected: boolean;
  toggleSelectAll: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={allSelected}
        onChange={toggleSelectAll}
        className="accent-gray-800"
        id="select-all"
      />
      <label htmlFor="select-all" className="text-sm text-gray-700">
        Select all on this page
      </label>
    </div>
  );
}
