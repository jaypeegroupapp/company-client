import z from "zod";

export const orderFormSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  totalAmount: z.coerce.number().min(0, "Invalid amount"),
  collectionDate: z.string().min(1, "Collection date is required"),
  items: z
    .array(
      z.object({
        truckId: z.string().min(1, "Truck is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one truck item is required"),
});
