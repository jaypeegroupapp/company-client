// services/truck.ts
import { getTrucksService } from "@/services/truck";

export async function getTrucks() {
  // This function will call a server endpoint - but simplest is to call a small API route.
  // If you prefer to call server action directly from server component, you can import getTrucksServer there.
  try {
    const trucks = await getTrucksService();

    return trucks.map((truck: any) => ({
      id: truck._id.toString(),
      plateNumber: truck.plateNumber,
      registrationNumber: truck.registrationNumber,
      vinNumber: truck.vinNumber,
      colour: truck.colour,
      make: truck.make,
      model: truck.model,
      year: truck.year,
      tankSize: truck.tankSize,
      isActive: truck.isActive,
      userId: truck.userId,
    }));
  } catch (err) {
    return [];
  }
}
