import React from "react";
import Link from "next/link";

export default function UiDemoPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          UI Component Demos
        </h1>
        <p className="text-muted-foreground">
          Examples and documentation for reusable UI components
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/ui-demo/button-links"
          className="group block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600">
            ButtonLink Component
          </h2>
          <p className="text-muted-foreground">
            Reusable link components with button styling for navigation
          </p>
        </Link>

        {/* Add more UI component demos here as we create them */}
      </div>
    </div>
  );
}
