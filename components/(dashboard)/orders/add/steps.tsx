"use client";

const steps = ["Product", "Trucks", "Quantity", "Review"];

export function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-700">
      {steps.map((label, i) => {
        const active = step === i + 1;
        const completed = step > i + 1;

        return (
          <div key={label} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full border ${
                completed
                  ? "border-gray-800 bg-gray-800 text-white"
                  : active
                  ? "border-gray-800 text-gray-800"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <p
              className={`mt-2 ${
                active
                  ? "text-gray-900"
                  : completed
                  ? "text-gray-700"
                  : "text-gray-400"
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
