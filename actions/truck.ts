// actions/truck.ts
"use server";

import { connectDB } from "@/lib/db";
import Truck from "@/models/truck";
import { revalidatePath } from "next/cache"; // optional if you use ISR/revalidation
import { ITruck } from "@/definitions/truck";
import { redirect } from "next/navigation";
import { truckFormSchema } from "@/validations/truck";
import {
  createTruckService,
  updateTruckService,
  deleteTruckService,
  isTruckExist,
  getTruckByIdService,
} from "@/services/truck";

export async function createTruckAction(
  truckId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = truckFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      console.log(validated.error.flatten().fieldErrors);
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    // 🧠 When updating — check that unique fields don’t conflict with other trucks
    if (truckId) {
      const existingTruck = await getTruckByIdService(truckId);
      if (!existingTruck) {
        return {
          message: "Truck not found",
          errors: { global: "Invalid truck ID" },
        };
      }

      // Check only if value changed
      if (existingTruck.registrationNumber !== data.registrationNumber) {
        const exists = await isTruckExist({
          registrationNumber: data.registrationNumber,
        });
        if (exists) {
          return {
            errors: {
              registrationNumber: ["Registration Number already exists"],
            },
          };
        }
      }

      if (existingTruck.vinNumber !== data.vinNumber) {
        const exists = await isTruckExist({
          vinNumber: data.vinNumber,
        });
        if (exists) {
          return {
            errors: { vinNumber: ["VIN Number already exists"] },
          };
        }
      }

      if (existingTruck.plateNumber !== data.plateNumber) {
        const exists = await isTruckExist({
          plateNumber: data.plateNumber,
        });
        if (exists) {
          return {
            errors: { plateNumber: ["Plate Number already exists"] },
          };
        }
      }

      await updateTruckService(truckId, data);
    }
    // 🧩 Otherwise, create a new truck
    else {
      let errors = null;
      const isRegistrationExist = await isTruckExist({
        registrationNumber: data.registrationNumber,
      });
      if (isRegistrationExist)
        errors = {
          registrationNumber: ["Registration Number already exists"],
        };

      const isVinExist = await isTruckExist({
        vinNumber: data.vinNumber,
      });
      if (isVinExist) {
        errors = { vinNumber: ["VIN Number already exists"] };
      }

      const isPlateExist = await isTruckExist({
        plateNumber: data.plateNumber,
      });
      if (isPlateExist) {
        errors = { plateNumber: ["Plate Number already exists"] };
      }
      if (errors) return { errors };

      await createTruckService(data);
    }
  } catch (error: any) {
    console.error("❌ createTruckAction error:", error);
    return {
      message: "Failed to create or update truck",
      errors: { global: error.message },
    };
  }

  revalidatePath("/trucks");
  redirect("/trucks");
}
export async function deleteTruckAction(truckId: string) {
  try {
    await deleteTruckService(truckId);
    revalidatePath("/trucks");

    return { success: true, message: "Truck deleted successfully." };
  } catch (error: any) {
    console.error("❌ deleteTruckAction error:", error);
    return { success: false, message: "Failed to delete truck." };
  }
}
