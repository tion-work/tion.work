import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'tion.work - 现代化开发者工具集合平台',
  description: '为开发者提供一站式解决方案，包含代码处理、数据处理、安全工具等30+个实用工具。零注册使用，实时处理，响应式设计。',
  keywords: ['开发者工具', '代码格式化', '数据处理', '安全工具', '在线工具', '开发效率'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
