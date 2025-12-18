"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IMine } from "@/definitions/mine";
import { getMines } from "@/data/mine";
import { Mountain, Wallet } from "lucide-react";
import CreditBalance from "./credit-balance";
import { getCompanyCreditsByCompanyId } from "@/data/company-credit";
import {
  CompanyCreditState,
  ICompanyCredit,
} from "@/definitions/company-credit";
import { ICompany } from "@/definitions/company";

export function MineStep({
  selectedMine,
  debit,
  setSelectedMine,
  onNext,
}: {
  selectedMine: ICompanyCredit | null;
  debit: { debitAmount: number };
  setSelectedMine: (m: ICompanyCredit) => void;
  onNext: () => void;
}) {
  const [mines, setMines] = useState<IMine[]>([]);
  const [creditMines, setCreditMines] = useState<ICompanyCredit[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getMines();
      const creditMinesRes = await getCompanyCreditsByCompanyId();
      if (creditMinesRes?.success) {
        setCreditMines(creditMinesRes.data);
      }
      setMines(res.data || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select a Mine</h2>
        {/* Credit Info */}
        <CreditBalance debit={debit} selectedMine={selectedMine} />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {creditMines.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedMine(item)}
            className={`flex justify-between items-center border-2 rounded-xl cursor-pointer p-4 transition-all ${
              selectedMine?.id === item.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <Mountain />
              </div>
              <div>
                <p className="text-md font-medium text-gray-800">
                  {item.mineName}
                </p>
                <p className="text-xs text-gray-700">
                  <b>Limit:</b> R{item.creditLimit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-700">
                  <b>Used:</b> R{item.usedCredit.toLocaleString()}
                </p>{" "}
                <div className="flex items-center gap-2"></div>
              </div>
            </div>
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
