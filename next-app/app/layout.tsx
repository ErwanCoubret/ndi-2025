import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIRD NDI 2025 - BABTEAM",
  keywords: [
    "NDI 2025",
    "Application",
    "Babteam",
  ],
  authors: [{ name: "Erwan Coubret", url: "https://erwancoubret.fr" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}