"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProducts } from "@/data/product"; // Your data service
import { IProduct } from "@/definitions/product";
import CreditBalance from "./credit-balance";

export function ProductStep({
  selectedProduct,
  credit,
  setSelectedProduct,
  onNext,
  onBack,
}: {
  selectedProduct: IProduct | null;
  credit: { limit: number; balance: number };
  setSelectedProduct: (p: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const res = await getProducts();
      setProducts(res.data || []);
    }
    loadProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select a Product</h2>
        <CreditBalance credit={credit} />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedProduct(product)}
            className={`border rounded-xl cursor-pointer p-4 transition-all ${
              selectedProduct?.id === product.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
            <p className="text-sm font-semibold mt-2 text-gray-700">
              R {product.sellingPrice.toFixed(2)}
            </p>
          </motion.div>
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
          disabled={!selectedProduct}
          onClick={onNext}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
            selectedProduct
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
