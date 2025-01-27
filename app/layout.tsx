import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";  

import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Private Article Reader",
  description: "A distraction-free way to read articles",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className + " max-w-5xl bg-gray-100 mx-auto"}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer /> 
      </body>
    </html>
  );
}
