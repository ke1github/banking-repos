"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ImplementationToggle() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're currently on the client implementation
  const isClientImplementation = pathname.includes("/client");

  // Determine the toggle route
  const toggleRoute = isClientImplementation
    ? pathname.replace("/client", "")
    : pathname.replace(/\/([^/]+)$/, "/client");

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg p-3 border border-gray-200">
      <div className="text-sm font-medium mb-2">Implementation:</div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() =>
            router.push(
              isClientImplementation
                ? pathname.replace("/client", "")
                : pathname
            )
          }
          className={`px-3 py-1.5 text-sm rounded-md ${
            !isClientImplementation
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Server
        </button>
        <button
          onClick={() => router.push(toggleRoute)}
          className={`px-3 py-1.5 text-sm rounded-md ${
            isClientImplementation
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Client + DataStates
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {isClientImplementation
          ? "Using DataStateRenderer with useDataStates hook"
          : "Using standard server component implementation"}
      </div>
    </div>
  );
}
