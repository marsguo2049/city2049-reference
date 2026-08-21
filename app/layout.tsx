import type { Metadata } from "next";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const publicBasePath = isGitHubPages ? "/city2049-reference" : "";
const publicOrigin = isGitHubPages
  ? "https://marsguo2049.github.io/city2049-reference"
  : "https://city2049-future-cure.ivory-perch-6058.chatgpt.site";

export const metadata: Metadata = {
  title: "City2049 · 未来参考",
  description: "一组探索可能未来的文化参考：从书、电影、剧集与游戏，走向可以被建模和验证的 City2049 项目。",
  openGraph: { title: "City2049 · 未来参考", description: "从书、电影、剧集与游戏出发，收藏未来可能成为的许多种样子。", type: "website", images: [`${publicOrigin}/og.png`] },
  twitter: { card: "summary_large_image", title: "City2049 · 未来参考", description: "从书、电影、剧集与游戏出发，收藏未来可能成为的许多种样子。", images: [`${publicOrigin}/og.png`] },
  icons: { icon: `${publicBasePath}/favicon.svg`, shortcut: `${publicBasePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
