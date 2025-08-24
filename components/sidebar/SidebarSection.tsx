"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import NavLink from "@/components/NavLink";
import { ROUTES } from "@/constants/route";

interface SidebarLink {
  imgURL: string;
  route: (typeof ROUTES)[keyof typeof ROUTES];
  label: string;
}

interface SidebarSectionProps {
  title: string;
  links: SidebarLink[];
  isExpanded: boolean;
  isCollapsed: boolean;
  onToggle: (section: string) => void;
  sectionKey: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  links,
  isExpanded,
  isCollapsed,
  onToggle,
  sectionKey,
}) => {
  return (
    <div className="mb-5">
      {!isCollapsed && (
        <div
          className="px-3 py-1 mb-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-md"
          onClick={() => onToggle(sectionKey)}
        >
          <h3 className="text-xs font-semibold uppercase text-gray-600">
            {title}
          </h3>
          <Icon
            name={isExpanded ? "chevron-up" : "chevron-down"}
            className="h-3.5 w-3.5 text-gray-500"
          />
        </div>
      )}
      <AnimatePresence initial={false}>
        {(isExpanded || isCollapsed) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1 overflow-hidden"
          >
            {links.map((link) => (
              <NavLink
                key={link.label}
                href={link.route}
                label={link.label}
                iconSrc={link.imgURL}
                collapsed={isCollapsed}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarSection;
