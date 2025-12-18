// data/mapper.ts

export function mapCompanyCredit(doc: any) {
  return {
    id: doc._id.toString(),
    mineId: doc.mineId?.toString() || "",
    mineName: doc.mineName || "Unknown Mine",
    creditLimit: doc.creditLimit ?? 0,
    usedCredit: doc.usedCredit ?? 0,
  };
}

// data/mapper.ts
export function mapOrder(order: any) {
  return {
    id: order._id.toString(),
    userId: order.userId?._id?.toString() || "",
    userName: order.userId?.fullName || "",
    mineId: order.mineId?._id?.toString() || "",
    mineName: order.mineId?.name || "",
    companyId: order.companyId?._id?.toString() || "",
    companyName: order.companyId?.name || "",
    productId: order.productId?._id?.toString() || "",
    productName: order.productId?.name || "N/A",
    totalAmount: Number(order.totalAmount || 0),
    debit: Number(order.debit || 0),
    credit: Number(order.credit || 0),
    collectionDate: order.collectionDate
      ? new Date(order.collectionDate).toISOString()
      : "",
    status: order.status || "pending",
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : "",
    updatedAt: order.updatedAt ? new Date(order.updatedAt).toISOString() : "",
  };
}
