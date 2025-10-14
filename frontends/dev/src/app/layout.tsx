import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "dev.tion.work - 现代化开发者工具集合平台",
  description:
    "为开发者提供一站式解决方案，包含代码处理、数据处理、安全工具等30+个实用工具。零注册使用，实时处理，响应式设计。",
  keywords: [
    "开发者工具",
    "代码格式化",
    "数据处理",
    "安全工具",
    "在线工具",
    "开发效率",
    "developer tools",
    "code formatter",
    "data processing",
    "security tools",
    "online tools",
    "development efficiency",
  ],
  authors: [{ name: "dev.tion.work" }],
  creator: "dev.tion.work",
  publisher: "dev.tion.work",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dev.tion.work"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "https://dev.tion.work",
      "en-US": "https://dev.tion.work",
    },
  },
  openGraph: {
    title: "dev.tion.work - 现代化开发者工具集合平台",
    description:
      "为开发者提供一站式解决方案，包含代码处理、数据处理、安全工具等30+个实用工具。",
    url: "https://dev.tion.work",
    siteName: "dev.tion.work",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "dev.tion.work - 开发者工具集合平台",
      },
    ],
    locale: "zh_CN",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dev.tion.work - 现代化开发者工具集合平台",
    description:
      "为开发者提供一站式解决方案，包含代码处理、数据处理、安全工具等30+个实用工具。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 多语言SEO支持 */}
        <link rel="alternate" hrefLang="zh-CN" href="https://dev.tion.work" />
        <link rel="alternate" hrefLang="en-US" href="https://dev.tion.work" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://dev.tion.work"
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LRERQ8J5K7"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LRERQ8J5K7');
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
