"use client";

export function TruckSearchInput({
  search,
  setSearch,
  setPage,
}: {
  search: string;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Search trucks (plate, reg, make, model)..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1); // reset when searching
      }}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
    />
  );
}
