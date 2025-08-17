"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { RoutePath } from "@/constants/route";

interface NavLinkProps {
  href: RoutePath;
  label: string;
  iconSrc: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, label, iconSrc, isActive, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isCurrentPath =
    pathname === href || pathname.startsWith(href + "/") || isActive;

  return (
    <Link
      href={href}
      aria-current={isCurrentPath ? "page" : undefined}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
        isCurrentPath
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {isCurrentPath && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-full" />
      )}
      <div
        className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${
          isCurrentPath ? "text-blue-600" : "text-gray-500"
        }`}
      >
        <Image src={iconSrc} alt={label} width={20} height={20} />
      </div>
      <span className="text-sm truncate">{label}</span>

      {isCurrentPath && (
        <div className="ml-auto w-1.5 h-5 bg-blue-600/70 rounded-full" />
      )}
    </Link>
  );
};

export default NavLink;
