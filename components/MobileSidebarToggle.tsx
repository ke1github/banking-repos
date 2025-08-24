"use client";

import React from "react";
import Icon from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

interface MobileSidebarToggleProps {
  onClick: () => void;
}

const MobileSidebarToggle = ({ onClick }: MobileSidebarToggleProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full h-12 w-12 md:hidden"
      onClick={onClick}
    >
      <Icon name="menu" className="h-6 w-6" />
    </Button>
  );
};

export default MobileSidebarToggle;
