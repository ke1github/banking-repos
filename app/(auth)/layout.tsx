import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Background with Images */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 flex-col items-center justify-center p-10 relative">
        <div className="absolute inset-0 bg-blue-600 opacity-90 z-0"></div>

        {/* Banking illustration */}
        <div className="relative z-10 mb-8">
          <Image
            src="/icons/auth-image.svg"
            alt="Banking illustration"
            width={400}
            height={400}
            className="max-w-md"
          />
        </div>

        {/* Testimonial */}
        <div className="relative z-10 text-white text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Banking Made Simple</h2>
          <p className="mb-6">
            SP Banking has transformed how I manage my finances. The dashboard
            is intuitive and the features are exactly what I need.
          </p>
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 mr-4"></div>
            <div>
              <p className="font-medium">Amit Sharma</p>
              <p className="text-sm opacity-80">Business Owner</p>
            </div>
          </div>
        </div>

        {/* Background patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-400/20"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-blue-400/20"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-blue-300/20"></div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}
