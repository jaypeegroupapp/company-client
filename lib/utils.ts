import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import fs from "fs";
// import path from "path";
// import { randomUUID } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* export async function fileUpload(file: File | null) {
  let fileUrl = "";

  if (file && file.size > 0) {
    // Create the /public/uploads directory if not exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create a unique filename
    const ext = path.extname(file.name);
    const filename = `${randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Convert the File to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save file to disk
    await fs.promises.writeFile(filePath, buffer);

    // File can be accessed at /uploads/filename
    fileUrl = `/uploads/${filename}`;
  }
}
 */