import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const soraSans = Sora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Pokedex",
  description: "A simple pokedex in React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${soraSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
