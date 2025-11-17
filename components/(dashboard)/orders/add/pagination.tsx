"use client";

export function TruckPagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (v: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 pt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
