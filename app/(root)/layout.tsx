import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";

// Mock user for demonstration - in a real app, this would come from authentication
const mockUser = {
  firstName: "Pawan",
  lastName: "Kumar",
  email: "pawan@example.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar user={mockUser} />

      {/* Mobile navigation - visible only on mobile */}
      <div className="lg:hidden">
        <MobileNavbar user={mockUser} />
      </div>

      {/* Main content area */}
      <main className="flex-1 mt-16 lg:mt-0">
        {children}
        <Footer />
      </main>
    </div>
  );
}
