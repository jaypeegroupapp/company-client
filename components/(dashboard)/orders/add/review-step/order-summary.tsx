"use client";

import { ICompanyCredit } from "@/definitions/company-credit";
import { IProduct } from "@/definitions/product";
import { ITruck } from "@/definitions/truck";

interface OrderSummaryProps {
  selectedMine: ICompanyCredit;
  selectedProduct: IProduct;
  selectedTrucks: ITruck[];
  getQuantity: (truckId?: string) => number;
  totalLitres: number;
  collectionDate: string;
  setCollectionDate: (date: string) => void;
}

export function OrderSummary({
  selectedMine,
  selectedProduct,
  selectedTrucks,
  getQuantity,
  totalLitres,
  collectionDate,
  setCollectionDate,
}: OrderSummaryProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-4 bg-gray-50 shadow-sm">
      {/* Mine Info */}
      <div>
        <h3 className="font-medium text-gray-900">Mine</h3>
        <p className="text-gray-700">{selectedMine.mineName}</p>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-medium text-gray-900">Product</h3>
        <p className="text-gray-700">{selectedProduct.name}</p>
        <p className="text-sm text-gray-500 mt-1">
          Grid Price: R{selectedProduct.grid?.toFixed(2)}/L
          {selectedProduct.discount > 0 && (
            <span className="text-green-600 ml-2">
              (Discount: R{selectedProduct.discount}/L)
            </span>
          )}
        </p>
      </div>

      {/* Trucks & Quantities */}
      <div>
        <h3 className="font-medium text-gray-900">Trucks & Quantities</h3>
        <ul className="space-y-2 mt-2">
          {selectedTrucks.map((truck, idx) => {
            const quantity = getQuantity(truck.id);
            if (quantity === 0) return null;
            return (
              <li
                key={truck.id ?? `truck-${idx}`}
                className="flex justify-between text-sm text-gray-700 border-b border-gray-200 pb-1"
              >
                <span>{truck.plateNumber}</span>
                <span>{quantity} L</span>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">
          Total Volume: <strong>{totalLitres} L</strong>
        </p>
      </div>

      {/* Collection Date */}
      <div>
        <div className="flex flex-row items-center gap-1">
          <h3 className="font-medium text-gray-900">Collection Date</h3>
          {collectionDate ? (
            <span className="text-sm text-gray-600">
              ({new Date(collectionDate).toLocaleDateString()})
            </span>
          ) : (
            <span className="text-sm text-orange-600 font-medium">
              - Please select a date
            </span>
          )}
        </div>
        <input
          type="date"
          value={collectionDate}
          onChange={(e) => setCollectionDate(e.target.value)}
          className="mt-2 border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-800 focus:ring-1 focus:ring-gray-700 focus:outline-none"
        />
      </div>
    </div>
  );
}
