import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ChaiBari - Premium Tea from Bangladesh",
    template: "%s | ChaiBari",
  },
  description:
    "Discover the finest hand-picked teas from the gardens of Sylhet and beyond. Premium green tea, black tea, herbal infusions, and more. Free delivery across Bangladesh.",
  keywords: [
    "tea",
    "chai",
    "green tea",
    "black tea",
    "herbal tea",
    "Bangladesh",
    "Sylhet tea",
    "organic tea",
    "premium tea",
  ],
  authors: [{ name: "ChaiBari" }],
  creator: "ChaiBari",
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://chaibari.com",
    siteName: "ChaiBari",
    title: "ChaiBari - Premium Tea from Bangladesh",
    description:
      "Discover the finest hand-picked teas from the gardens of Sylhet and beyond.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ChaiBari - Premium Tea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChaiBari - Premium Tea from Bangladesh",
    description:
      "Discover the finest hand-picked teas from the gardens of Sylhet and beyond.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-16 md:pt-20">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
