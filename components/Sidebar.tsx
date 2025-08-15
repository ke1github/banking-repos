"use client";

import React from "react";
import Image from "next/image";
import NavLink from "./NavLink";
import { sidebarLinks } from "@/constants";

interface SidebarProps {
  user?: {
    firstName: string;
    lastName?: string;
  };
}

const Sidebar = ({ user }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <div>
        <div className="mb-10 flex items-center justify-start px-4">
          <h2 className="sidebar-logo">SP BANKING</h2>
        </div>

        <div className="flex flex-col gap-2 px-2">
          {/* Main navigation links */}
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.label}
              href={link.route}
              label={link.label}
              iconSrc={link.imgURL}
            />
          ))}
        </div>
      </div>

      {/* Bottom section with logout */}
      <div className="p-4">
        <NavLink
          href="/logout"
          label="Logout"
          iconSrc="/icons/logout.svg"
          onClick={() => console.log("Logout clicked")}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
