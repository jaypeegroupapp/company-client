"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "./steps";
import { ProductStep } from "./product-step";
import { TruckStep } from "./truck-step";
import { QuantityStep } from "./quantity-step";
import { ReviewStep } from "./review-step";
import { IProduct } from "@/definitions/product";
import { ITruck } from "@/definitions/truck";

export default function AddOrderClient() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedTrucks, setSelectedTrucks] = useState<ITruck[]>([]);
  const [quantities, setQuantities] = useState<{ [truckId: string]: number }>(
    {}
  );
  const [collectionDate, setCollectionDate] = useState("");

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const progressLabel = [
    "Select Product",
    "Select Trucks",
    "Set Quantities",
    "Review",
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

      {/* Card container */}
      <motion.div
        layout
        className="bg-white md:border md:border-gray-200 md:rounded-2xl md:shadow-sm md:p-6 sm:p-8 transition"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductStep
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                onNext={nextStep}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TruckStep
                selectedTrucks={selectedTrucks}
                setSelectedTrucks={setSelectedTrucks}
                onNext={nextStep}
                onBack={prevStep}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuantityStep
                selectedTrucks={selectedTrucks}
                quantities={quantities}
                setQuantities={setQuantities}
                onNext={nextStep}
                onBack={prevStep}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReviewStep
                selectedProduct={selectedProduct}
                selectedTrucks={selectedTrucks}
                quantities={quantities}
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
