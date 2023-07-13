import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Momento Mori",
  description: "A simple app to remind you of your mortality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="author" content="shadoath" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
