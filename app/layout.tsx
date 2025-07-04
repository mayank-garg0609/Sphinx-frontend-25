import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "sonner";

// Load custom font
const spaceArmor = localFont({
  src: "./fonts/SPACE_ARMOR.woff", // use ./ for local font within /app or /public if needed
  display: "swap",
  variable: "--font-space-armor", 
});

export const metadata: Metadata = {
  title: "Sphinx'25",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceArmor.className}>
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
