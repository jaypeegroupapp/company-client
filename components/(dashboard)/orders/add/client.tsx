"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { StepIndicator } from "./steps";
import { MineStep } from "./mine-step";
import { ProductStep } from "./product-step";
import { TruckStep } from "./truck-step";
import { QuantityStep } from "./quantity-step";
import { ReviewStep } from "./review-step";

import { IProduct } from "@/definitions/product";
import { ITruck } from "@/definitions/truck";
import { ICompanyCredit } from "@/definitions/company-credit";

export default function AddOrderClient({
  debit,
}: {
  debit: { debitAmount: number; usedDebit: number };
}) {
  const [step, setStep] = useState(1);

  const [selectedMine, setSelectedMine] = useState<ICompanyCredit | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedTrucks, setSelectedTrucks] = useState<ITruck[]>([]);
  const [quantities, setQuantities] = useState<{ [truckId: string]: number }>(
    {}
  );
  const [collectionDate, setCollectionDate] = useState("");

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const progressLabel = [
    "Select Mine",
    "Select Product",
    "Select Trucks",
    "Set Quantities",
    "Review Order",
  ][step - 1];

  return (
    <div className="max-w-5xl mx-auto py-2 md:py-10 px-0 md:px-4 sm:px-6 text-gray-900 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Order
          </h1>
          <p className="text-sm text-gray-500 mt-1">{progressLabel}</p>
        </div>

        <div className="flex gap-2">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="border border-gray-400 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator step={step} />

      {/* Step Container */}
      <motion.div
        layout
        className="bg-white md:border md:border-gray-200 md:rounded-2xl md:shadow-sm md:p-6 sm:p-8 transition"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1-mine"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MineStep
                selectedMine={selectedMine}
                debit={debit}
                setSelectedMine={setSelectedMine}
                onNext={nextStep}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2-product"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductStep
                selectedMine={selectedMine}
                selectedProduct={selectedProduct}
                debit={debit}
                setSelectedProduct={setSelectedProduct}
                onNext={nextStep}
                onBack={prevStep}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3-trucks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TruckStep
                selectedMine={selectedMine}
                selectedTrucks={selectedTrucks}
                debit={debit}
                setSelectedTrucks={setSelectedTrucks}
                onNext={nextStep}
                onBack={prevStep}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4-quantities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuantityStep
                selectedMine={selectedMine}
                selectedTrucks={selectedTrucks}
                quantities={quantities}
                debit={debit}
                setQuantities={setQuantities}
                onNext={nextStep}
                onBack={prevStep}
              />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5-review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReviewStep
                selectedMine={selectedMine}
                selectedProduct={selectedProduct}
                selectedTrucks={selectedTrucks}
                quantities={quantities}
                debit={debit}
                collectionDate={collectionDate}
                setCollectionDate={setCollectionDate}
                onBack={prevStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
