import { z } from "zod";

export const orderFormSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  totalAmount: z.number().positive("Total amount must be positive"),
  collectionDate: z.string().min(1, "Collection date is required"),
  items: z.array(
    z.object({
      truckId: z.string().min(1, "Truck is required"),
      quantity: z.number().positive("Quantity must be positive"),
    }),
  ),
  sellingPrice: z.number().optional(),
  purchasePrice: z.number().optional(),
  mineId: z.string().min(1, "Mine is required"),
  debit: z.number().min(0).default(0),
  credit: z.number().min(0).default(0),
  // Backward compatibility flag
  isPaymentGateway: z.boolean().optional().default(false),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
