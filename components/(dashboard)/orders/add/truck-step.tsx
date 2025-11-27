"use client";

import { useEffect, useState, useMemo } from "react";
import { getTrucks } from "@/data/truck";
import { TruckSearchInput } from "./search";
import { TruckSelectAll } from "./select-all";
import { TruckList } from "./list";
import { TruckPagination } from "./pagination";
import { ITruck } from "@/definitions/truck";
import CreditBalance from "./credit-balance";

export function TruckStep({
  selectedTrucks,
  credit,
  setSelectedTrucks,
  onNext,
  onBack,
}: {
  selectedTrucks: ITruck[];
  credit: { limit: number; balance: number };
  setSelectedTrucks: (t: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  useEffect(() => {
    async function loadTrucks() {
      const data = await getTrucks();
      setTrucks(data || []);
    }
    loadTrucks();
  }, []);

  // FILTERED
  const filteredTrucks = useMemo(() => {
    return trucks.filter((t) => {
      const target =
        `${t.plateNumber} ${t.registrationNumber} ${t.make} ${t.model}`.toLowerCase();
      return target.includes(search.toLowerCase());
    });
  }, [trucks, search]);

  // PAGINATION
  const totalPages = Math.ceil(filteredTrucks.length / PAGE_SIZE);

  const paginatedTrucks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTrucks.slice(start, start + PAGE_SIZE);
  }, [filteredTrucks, page]);

  // SELECT ALL
  const allSelected = paginatedTrucks.every((t) =>
    selectedTrucks.some((x) => x.id === t.id)
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTrucks(
        selectedTrucks.filter(
          (x) => !paginatedTrucks.some((t) => t.id === x.id)
        )
      );
    } else {
      const newTrucks = [
        ...selectedTrucks,
        ...paginatedTrucks.filter(
          (t) => !selectedTrucks.some((x) => x.id === t.id)
        ),
      ];
      setSelectedTrucks(newTrucks);
    }
  };

  // SELECT SINGLE TRUCK
  const toggleTruck = (truck: any) => {
    if (selectedTrucks.some((t) => t.id === truck.id)) {
      setSelectedTrucks(selectedTrucks.filter((t) => t.id !== truck.id));
    } else {
      setSelectedTrucks([...selectedTrucks, truck]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select Trucks</h2>
        <CreditBalance credit={credit} />
      </div>

      <TruckSearchInput
        search={search}
        setSearch={setSearch}
        setPage={setPage}
      />

      <TruckSelectAll
        allSelected={allSelected}
        toggleSelectAll={toggleSelectAll}
      />

      <TruckList
        trucks={paginatedTrucks}
        selectedTrucks={selectedTrucks}
        toggleTruck={toggleTruck}
      />

      <TruckPagination page={page} totalPages={totalPages} setPage={setPage} />

      {/* Footer */}
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
