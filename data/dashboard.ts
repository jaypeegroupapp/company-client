"use server";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import {
  getCompanyDashboardSummaryService,
  getMonthlyOrdersStatsService,
  getOrderStatusStatsService,
  getOrdersByMineStatsService,
  getTruckStatusService,
  getMonthlyCompanyInvoiceService,
} from "@/services/dashboard";
import { months } from "@/constants/dashboard";

//
// 🔹 0. SUMMARY TILE STATS
//
export async function getCompanyDashboardSummary() {
  try {
    const session = await verifySession();
    if (!session) redirect("/login");

    const companyId = session.companyId as string;

    return await getCompanyDashboardSummaryService(companyId);
  } catch (err: any) {
    console.error("❌ getCompanyDashboardSummary error:", err);
    return {
      totalOrders: 0,
      totalTrucks: 0,
      totalCompanyInvoices: 0,
      credit: {
        limit: 0,
        balance: 0,
      },
    };
  }
}

//
// 🔹 1. MONTHLY ORDERS
//
export async function getCompanyMonthlyOrdersStats() {
  try {
    const session = await verifySession();
    if (!session) redirect("/login");

    const companyId = session.companyId as string;

    const result = await getMonthlyOrdersStatsService(companyId);

    return result.map((x: any) => ({
      month: months[x.month - 1],
      orders: x.orders,
    }));
  } catch (err) {
    console.error("❌ getCompanyMonthlyOrdersStats error:", err);
    return [];
  }
}

//
// 🔹 3. ORDER STATUS DISTRIBUTION
//
export async function getCompanyOrderStatusStats() {
  try {
    const session = await verifySession();
    if (!session) redirect("/login");

    const companyId = session.companyId as string;

    const result = await getOrderStatusStatsService(companyId);
    return result.map((x: any) => ({
      status: x.status,
      value: x.value,
    }));
  } catch (err) {
    console.error("❌ getCompanyOrderStatusStats error:", err);
    return [];
  }
}

//
// 🔹 4. ORDERS BY MINE
//
export async function getCompanyOrdersByMine() {
  try {
    const session = await verifySession();
    if (!session) redirect("/login");

    const companyId = session.companyId as string;

    return await getOrdersByMineStatsService(companyId);
  } catch (err) {
    console.error("❌ getCompanyOrdersByMine error:", err);
    return [];
  }
}

//
// 🔹 5. TRUCK STATUS SUMMARY
//
export async function getCompanyTruckStatus() {
  try {
    const session = await verifySession();
    if (!session) redirect("/login");

    const companyId = session.companyId as string;

    return await getTruckStatusService(companyId);
  } catch (err) {
    console.error("❌ getCompanyTruckStatus error:", err);
    return [];
  }
}

//
// 🔹 7. MONTHLY INVOICES
//
export async function getCompanyMonthlyInvoices() {
  try {
    const session = await verifySession();
    if (!session) redirect("/login");

    const companyId = session.companyId as string;
    const result = await getMonthlyCompanyInvoiceService(companyId);
    return result.map((x: any) => ({
      month: months[x.month - 1],
      total: x.totalAmount,
    }));
  } catch (err) {
    console.error("❌ getCompanyMonthlyInvoices error:", err);
    return [];
  }
}
