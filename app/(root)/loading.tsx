"use client";

import React from "react";

const RootLoading = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="text-lg font-medium text-primary-700">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
};

export default RootLoading;
