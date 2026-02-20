"use client";

import { motion } from "framer-motion";
import { Receipt, Truck } from "lucide-react";
import { IOrder } from "@/definitions/order";
import { InvoiceStatusBadge } from "./status-badge";

export function InvoiceOrdersList({ orders }: { orders: IOrder[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex gap-2 items-center">
        <Receipt size={18} />
        Linked Orders
      </h3>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Order</th>
              <th className="pb-3 text-right">Total</th>
              <th className="pb-3 text-right">Debit</th>
              <th className="pb-3 text-right">Credit</th>
              <th className="pb-3 text-right">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const outstanding =
                order.totalAmount - order.debit - order.credit;

              return (
                <tr
                  key={order.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-semibold">
                    #{order.id?.slice(-6).toUpperCase()}
                  </td>

                  <td className="py-4">{order.mineName}</td>

                  <td className="py-4">
                    <InvoiceStatusBadge status={order.status} />
                  </td>

                  <td className="py-4 text-right font-medium">
                    R {order.totalAmount.toFixed(2)}
                  </td>

                  <td className="py-4 text-right text-purple-600">
                    R {order.debit.toFixed(2)}
                  </td>

                  <td className="py-4 text-right text-orange-600">
                    R {order.credit.toFixed(2)}
                  </td>

                  <td className="py-4 text-right text-red-600 font-medium">
                    R {outstanding.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders linked.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const outstanding = order.totalAmount - order.debit - order.credit;

            return (
              <div key={order.id} className="border rounded-xl p-4">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <p className="font-semibold">
                      Order #{order.id?.slice(-6).toUpperCase()} –{" "}
                      {order.mineName}
                    </p>
                    <InvoiceStatusBadge status={order.status} />
                  </div>
                  <p className="font-semibold">
                    R {order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Debit</p>
                    <p className="text-purple-600">
                      R {order.debit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Credit</p>
                    <p className="text-orange-600">
                      R {order.credit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Outstanding</p>
                    <p className="text-red-600">R {order.credit.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-3 pl-2 border-l space-y-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="flex gap-1 items-center">
                        <Truck size={12} />
                        {item.truckName}
                      </span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
