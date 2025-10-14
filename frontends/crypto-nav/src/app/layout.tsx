import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "crypto.tion.work - 加密货币投资导航",
  description:
    "专为加密货币投资者而生，聚合优质网站、教程、工具，一站式加密货币投资导航平台",
  keywords: "加密货币,比特币,以太坊,DeFi,投资,导航,工具,教程",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
