"use client";

import React from "react";

const AuthLoading = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-blue-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-lg font-medium text-blue-700">Loading...</p>
      </div>
    </div>
  );
};

export default AuthLoading;
