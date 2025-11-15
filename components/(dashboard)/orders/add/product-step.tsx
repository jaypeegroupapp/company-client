"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProducts } from "@/data/product"; // Your data service

export function ProductStep({
  selectedProduct,
  setSelectedProduct,
  onNext,
}: {
  selectedProduct: any;
  setSelectedProduct: (p: any) => void;
  onNext: () => void;
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
      <h2 className="text-xl font-semibold">Select a Product</h2>
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

      <div className="pt-6">
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
