import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "City2049 · 未来参考",
  description: "一组探索可能未来的文化参考：从书、电影、剧集与游戏，走向可以被建模和验证的 City2049 项目。",
  openGraph: { title: "City2049 · 未来参考", description: "从书、电影、剧集与游戏出发，收藏未来可能成为的许多种样子。", type: "website", images: ["https://city2049-future-cure.ivory-perch-6058.chatgpt.site/og.png"] },
  twitter: { card: "summary_large_image", title: "City2049 · 未来参考", description: "从书、电影、剧集与游戏出发，收藏未来可能成为的许多种样子。", images: ["https://city2049-future-cure.ivory-perch-6058.chatgpt.site/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
