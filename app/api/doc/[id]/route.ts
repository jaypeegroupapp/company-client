import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

// ✅ GET /api/files/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 must await params (it's now a Promise)

    if (!id) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    const { gfs } = await connectDB();

    const fileId = new mongoose.Types.ObjectId(id);
    const files = await gfs.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = files[0];
    const stream = gfs.openDownloadStream(fileId);

    const headers = new Headers({
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${file.filename}"`,
    });

    return new Response(stream as any, { headers });
  } catch (error: any) {
    console.error("❌ Error streaming file:", error);
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 });
  }
}
