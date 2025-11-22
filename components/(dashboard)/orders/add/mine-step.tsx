"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IMine } from "@/definitions/mine";
import { getMines } from "@/data/mine";

export function MineStep({
  selectedMine,
  setSelectedMine,
  onNext,
}: {
  selectedMine: IMine | null;
  setSelectedMine: (m: IMine) => void;
  onNext: () => void;
}) {
  const [mines, setMines] = useState<IMine[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getMines();
      setMines(res.data || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select a Mine</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mines.map((mine) => (
          <motion.div
            key={mine.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedMine(mine)}
            className={`border rounded-xl cursor-pointer p-4 transition-all ${
              selectedMine?.id === mine.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <h3 className="font-medium text-gray-900">{mine.name}</h3>
            {/* <p className="text-sm text-gray-500 mt-1">{mine.location}</p> */}
          </motion.div>
        ))}
      </div>

      <div className="pt-6">
        <button
          disabled={!selectedMine}
          onClick={onNext}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
            selectedMine
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
