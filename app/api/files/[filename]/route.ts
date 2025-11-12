// app/api/files/[filename]/route.ts
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose, { Types } from "mongoose";

const CACHE_STRATEGY = {
  mutable: "public, max-age=3600", // 1 hour cache
  immutable: "public, max-age=31536000, immutable", // 1 year cache
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  try {
    const { gfs } = await connectDB();

    // Optionally: lookup file metadata (contentType)
    const filesCollection = mongoose.connection.db?.collection("uploads.files");
    const fileDoc = filesCollection
      ? await filesCollection.findOne({
          filename,
        })
      : null;

    if (!fileDoc) {
      return new Response("File not found", { status: 404 });
    }

    const contentType = fileDoc.contentType || "application/octet-stream";
    const lastModified =
      fileDoc.uploadDate?.toUTCString() ?? new Date().toUTCString();
    const etag = `"${fileDoc._id.toString()}-${fileDoc.length}"`;

    // Check if client already has this version
    const ifNoneMatch = req.headers.get("if-none-match");
    const ifModifiedSince = req.headers.get("if-modified-since");

    if (
      ifNoneMatch === etag ||
      (ifModifiedSince && new Date(ifModifiedSince) >= fileDoc.uploadDate)
    ) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Last-Modified": lastModified,
          "Cache-Control": getCacheHeader(filename),
        },
      });
    }

    // Open download stream
    const downloadStream = gfs.openDownloadStreamByName(filename);

    // Convert to ReadableStream
    const stream = new ReadableStream({
      async pull(controller) {
        for await (const chunk of downloadStream) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": getCacheHeader(filename),
        ETag: etag,
        "Last-Modified": lastModified,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("File not found", { status: 404 });
  }
}

function getCacheHeader(filename: string) {
  return filename.match(/[a-f0-9]{6,}/) // crude hash check
    ? CACHE_STRATEGY.immutable
    : CACHE_STRATEGY.mutable;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const { gfs } = await connectDB();

    // Find the file document first
    const filesCollection = mongoose.connection.db?.collection("uploads.files");
    const fileDoc = filesCollection
      ? await filesCollection.findOne({
          filename,
        })
      : null;

    if (!fileDoc?._id) {
      return new Response("File not found", { status: 404 });
    }

    // Delete by ObjectId
    await gfs.delete(new Types.ObjectId(fileDoc._id));

    return new Response("File deleted successfully", { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return new Response("Failed to delete file", { status: 500 });
  }
}
