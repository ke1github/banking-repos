import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/logo";

const SignIn = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Auth Asset - Left Side */}
      <div className="flex h-screen w-full sticky top-0 items-center justify-end bg-sky-1 max-lg:hidden">
        <Image
          src="/icons/auth-image.svg"
          alt="Auth"
          width={615}
          height={580}
          className="w-full max-w-[615px] h-auto"
        />
      </div>

      {/* Form - Right Side */}
      <div className="flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8">
        <div className="flex flex-col items-center mb-6">
          <Logo variant="large" className="mb-4" />
        </div>
        <div className="flex flex-col gap-1 px-8">
          <h1 className="text-[24px] font-semibold text-gray-900">Sign In</h1>
          <p className="text-[14px] text-gray-600">
            Welcome back to SP Banking
          </p>
        </div>

        <form className="flex flex-col gap-4 px-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="text-[16px] rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="text-[16px] rounded-lg border border-gray-300 p-2.5 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <Button className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#0179FE] to-[#4893FF] text-white font-semibold">
            Sign In
          </Button>
        </form>

        <p className="mt-4 text-center text-[14px] text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-[#0179FE]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
