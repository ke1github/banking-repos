"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";

interface ResponsiveSidebarProps {
  user: {
    firstName: string;
    lastName?: string;
    email?: string;
    image?: string;
  };
}

const ResponsiveSidebar = ({ user }: ResponsiveSidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Check if we're on mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Set up event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <>
      {/* Mobile view uses a slide-out sheet */}
      {isMobile ? (
        <>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full h-12 w-12"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="p-0 max-w-[280px]">
              <Sidebar user={user} />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        // Desktop view uses the regular sidebar with collapse functionality
        <>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 bottom-4 z-50 rounded-full h-10 w-10 shadow-md"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </Button>
          <Sidebar user={user} initialCollapsed={collapsed} />

          {/* Adjust main content margin based on sidebar state */}
          <style jsx global>{`
            main {
              margin-left: ${collapsed ? "80px" : "256px"};
              transition: margin-left 0.3s;
            }
            @media (max-width: 768px) {
              main {
                margin-left: 0;
              }
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default ResponsiveSidebar;
