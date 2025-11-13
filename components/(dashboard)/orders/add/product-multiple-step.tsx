"use client";

import { motion } from "framer-motion";
import { getProducts } from "@/data/product";
import { useEffect, useState } from "react";

export function ProductStep({
  selectedProducts,
  setSelectedProducts,
  onNext,
}: {
  selectedProducts: any[];
  setSelectedProducts: (v: any[]) => void;
  onNext: () => void;
}) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getProducts();
      setProducts(res.data || []);
    })();
  }, []);

  const toggleProduct = (p: any) => {
    if (selectedProducts.some((x) => x.id === p.id)) {
      setSelectedProducts(selectedProducts.filter((x) => x.id !== p.id));
    } else {
      setSelectedProducts([...selectedProducts, p]);
    }
  };

  return (
    <motion.div
      key="product-step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-lg font-semibold text-gray-800">Select Product</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => toggleProduct(p)}
            className={`border rounded-lg p-4 text-left ${
              selectedProducts.some((x) => x.id === p.id)
                ? "border-gray-800 bg-gray-100"
                : "border-gray-300"
            }`}
          >
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-500">{p.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-5 py-2 border border-gray-800 rounded-lg text-gray-800 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
