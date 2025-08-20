"use client";

import React, { useState, useEffect } from "react";

export default function LoadingFallback() {
  const [showLoading, setShowLoading] = useState(false);

  // Only show the loading indicator after a short delay
  // This prevents flashing on quick loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!showLoading) {
    return null; // Return nothing if we haven't hit the delay yet
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
        <p className="text-sm font-medium text-blue-700">Loading...</p>
      </div>
    </div>
  );
}
