import CancelClient from "@/components/(dashboard)/orders/cancel/client";
import { Suspense } from "react";

export default function CancelPage() {
  return (
    <Suspense>
      <CancelClient />
    </Suspense>
  );
}
