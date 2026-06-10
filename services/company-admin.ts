import { connectDB } from "@/lib/db";
import Order from "@/models/order";
import Company from "@/models/company";
import CompanyCredit from "@/models/company-credit";
import Truck from "@/models/truck";
import { Types } from "mongoose";

function toPlainObject(doc: any): any {
  if (!doc) return null;

  const plain: any = {};

  for (const key of Object.keys(doc)) {
    const value = doc[key];

    if (value instanceof Types.ObjectId) {
      plain[key] = value.toString();
    } else if (value instanceof Date) {
      plain[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      plain[key] = value.map((v) => toPlainObject(v));
    } else if (value && typeof value === "object" && !Buffer.isBuffer(value)) {
      plain[key] = toPlainObject(value);
    } else {
      plain[key] = value;
    }
  }

  return plain;
}

export async function getCompanyAdminDashboardDataService(companyId: string) {
  await connectDB();

  const companyObjectId = new Types.ObjectId(companyId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Company Credit Info
  const company = await Company.findById(companyObjectId).lean();
  const companyCredit = await CompanyCredit.findOne({
    companyId: companyObjectId,
  }).lean();

  const debitBalance = company?.debitAmount || 0;
  const creditLimit = companyCredit?.creditLimit || 0;
  const usedCredit = companyCredit?.usedCredit || 0;
  const availableCredit = creditLimit - usedCredit;
  const totalBalance = debitBalance + availableCredit;

  // Orders Statistics
  const allOrders = await Order.find({ companyId: companyObjectId }).lean();
  const orders = allOrders.map((o) => toPlainObject(o));

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalLitresOrdered = orders.reduce((sum, o) => {
    // This would need order items aggregation, simplified
    return sum + o.totalAmount / (o.sellingPrice || 1);
  }, 0);

  // Orders by Status
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const acceptedOrders = orders.filter((o) => o.status === "accepted").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  // Recent Orders (last 10)
  const recentOrders = orders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  // Monthly Order Trend
  const monthlyOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= startOfMonth;
  });
  const monthlySpent = monthlyOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );
  const monthlyLitres = monthlyOrders.reduce((sum, o) => {
    return sum + o.totalAmount / (o.sellingPrice || 1);
  }, 0);

  // Truck Fleet
  const trucks = await Truck.find({ companyId: companyObjectId }).lean();
  const fleetCount = trucks.length;
  const activeTrucks = trucks.filter(
    (t: any) => t.status !== "maintenance",
  ).length;

  // Order History with Items
  const orderHistory = await Order.aggregate([
    { $match: { companyId: companyObjectId } },
    { $sort: { createdAt: -1 } },
    { $limit: 20 },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "orderId",
        as: "items",
      },
    },
    {
      $lookup: {
        from: "trucks",
        localField: "items.truckId",
        foreignField: "_id",
        as: "truckDetails",
      },
    },
  ]);

  const orderHistoryPlain = orderHistory.map((o) => toPlainObject(o));

  // Active Orders (pending + accepted)
  const activeOrdersList = orders
    .filter((o) => o.status === "pending" || o.status === "accepted")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return {
    credit: {
      debitBalance,
      creditLimit,
      usedCredit,
      availableCredit,
      totalBalance,
      utilizationPercentage:
        creditLimit > 0 ? (usedCredit / creditLimit) * 100 : 0,
    },
    orders: {
      totalOrders,
      totalSpent,
      totalLitres: Math.round(totalLitresOrdered),
      pending: pendingOrders,
      accepted: acceptedOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      monthlySpent,
      monthlyLitres: Math.round(monthlyLitres),
    },
    fleet: {
      totalTrucks: fleetCount,
      activeTrucks,
    },
    recentOrders,
    activeOrdersList,
    orderHistory: orderHistoryPlain,
  };
}
