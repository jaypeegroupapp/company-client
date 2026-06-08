export interface IOrder {
  id?: string;
  userId: string;
  mineId: string;
  mineName?: string;
  companyId: string;
  companyName?: string;
  productId: string;
  purchasePrice?: number;
  sellingPrice?: number;
  grid?: number;
  invoiceId?: string;
  productName: string;
  totalAmount: number;
  debit: number;
  credit: number;
  collectionDate: string;
  status: string;
  paymentMethod?: "debit" | "credit" | "payment_gateway" | "mixed";
  paymentComplete?: boolean;
  paymentIntentId?: string;
  reason?: string;
  signature?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: {
    id: string;
    truckName: string;
    quantity: number;
  }[];
}

export type OrderStatus =
  | "pending" // Waiting for stock (no payment or debit pending)
  | "accepted" // Reserved, waiting fulfillment
  | "completed" // Fully fulfilled
  | "cancelled" // Cancelled
  | "payment_pending" // Awaiting payment gateway confirmation
  | "payment_failed"; // Payment gateway failed

export type PaymentMethod = "debit" | "credit" | "payment_gateway" | "mixed";

export interface CreateOrderInput {
  userId: string;
  mineId: string;
  companyId: string;
  productId: string;
  totalAmount: number;
  collectionDate: string;
  items: {
    truckId: string;
    quantity: number;
  }[];
  sellingPrice?: number;
  purchasePrice?: number;
  debit?: number;
  credit?: number;
  paymentMethod?: "debit" | "credit" | "payment_gateway" | "mixed";
  isPaymentGateway?: boolean; // Backward compatibility flag
}

export type OrderTab =
  | "All"
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled";
