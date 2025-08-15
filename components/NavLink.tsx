"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface NavLinkProps {
  href: string;
  label: string;
  iconSrc: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, label, iconSrc, isActive, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isCurrentPath = pathname === href || isActive;

  return (
    <Link
      href={href}
      className={`sidebar-link ${
        isCurrentPath ? "bg-blue-25" : "hover:bg-blue-25"
      }`}
      onClick={onClick}
    >
      <Image src={iconSrc} alt={label} width={20} height={20} />
      <span className="sidebar-label">{label}</span>
    </Link>
  );
};

export default NavLink;
