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
