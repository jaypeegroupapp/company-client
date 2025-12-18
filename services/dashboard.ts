"use server";

import { connectDB } from "@/lib/db";

import Order from "@/models/order";
import Truck from "@/models/truck";
import Product from "@/models/product";
import Mine from "@/models/mine";
import CompanyInvoice from "@/models/company-invoice";
import { Types } from "mongoose";
import { getCompanyDetails } from "@/data/company";
import { getCompanyByIdService } from "./company";

/* -----------------------------------------------------
   0. DASHBOARD SUMMARY
----------------------------------------------------- */
export async function getCompanyDashboardSummaryService(companyId: string) {
  await connectDB();

  const [totalOrders, totalTrucks, totalCompanyInvoices, company] =
    await Promise.all([
      Order.countDocuments({ companyId }),
      Truck.countDocuments({ companyId, isActive: true }),
      CompanyInvoice.countDocuments({ companyId, status: "published" }),
      getCompanyByIdService(companyId),
    ]);

  return {
    totalOrders,
    totalTrucks,
    totalCompanyInvoices,
    credit: {
      limit: company?.creditLimit || 0,
      balance: company?.debitAmount || 0,
    },
  };
}

async function getCompanyRevenueForCurrentMonth(companyId: string) {
  await connectDB();

  const res = await CompanyInvoice.aggregate([
    {
      $match: {
        companyId,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  return res[0]?.total || 0;
}

/* -----------------------------------------------------
   1. MONTHLY ORDERS STATS
----------------------------------------------------- */
export async function getMonthlyOrdersStatsService(companyId: string) {
  await connectDB();

  const results = await Order.aggregate([
    { $match: { companyId: new Types.ObjectId(companyId) } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        orders: 1,
        _id: 0,
      },
    },
  ]);

  // Build months 1–12
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    orders: 0,
  }));

  // Merge DB results
  results.forEach((r) => {
    const index = r.month - 1;
    months[index].orders = r.orders;
  });

  return months;
}

/* -----------------------------------------------------
   2. MONTHLY REVENUE STATS
----------------------------------------------------- */
/* -----------------------------------------------------
   3. ORDER STATUS DISTRIBUTION
----------------------------------------------------- */
export async function getOrderStatusStatsService(companyId: string) {
  await connectDB();

  return await Order.aggregate([
    { $match: { companyId: new Types.ObjectId(companyId) } },
    {
      $group: {
        _id: "$status",
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        value: 1,
        _id: 0,
      },
    },
  ]);
}

/* -----------------------------------------------------
   4. ORDERS BY MINE
----------------------------------------------------- */
export async function getOrdersByMineStatsService(companyId: string) {
  await connectDB();

  return await Mine.aggregate([
    {
      $lookup: {
        from: "orders",
        pipeline: [
          {
            $match: {
              companyId: new Types.ObjectId(companyId),
            },
          },
        ],
        localField: "_id",
        foreignField: "mineId",
        as: "orders",
      },
    },
    {
      $project: {
        mine: "$name",
        orders: { $size: "$orders" },
        _id: 0,
      },
    },
  ]);
}

/* -----------------------------------------------------
   5. TRUCK STATUS SUMMARY
----------------------------------------------------- */
export async function getTruckStatusService(companyId: string) {
  await connectDB();

  return await Truck.aggregate([
    { $match: { companyId: new Types.ObjectId(companyId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: { status: "$_id", count: 1, _id: 0 },
    },
  ]);
}

/* -----------------------------------------------------
   7. MONTHLY COMPANY INVOICES
----------------------------------------------------- */
export async function getMonthlyCompanyInvoiceService(companyId: string) {
  await connectDB();

  const results = await CompanyInvoice.aggregate([
    {
      $match: {
        companyId: new Types.ObjectId(companyId),
        status: { $ne: "pending" },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        totalAmount: 1,
        _id: 0,
      },
    },
  ]);

  // Build months 1–12
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalAmount: 0,
  }));

  // Merge DB results
  results.forEach((r) => {
    const index = r.month - 1;
    months[index].totalAmount = r.totalAmount;
  });

  return months;
}
