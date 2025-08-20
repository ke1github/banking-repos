import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import AuthProviderWrapper from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/SonnerToastProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SP Banking App",
  description: "SP is a modern banking platform for everyone",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${ibmPlexSerif.variable} antialiased`}
      >
        <AuthProviderWrapper>
          <ToastProvider>{children}</ToastProvider>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
