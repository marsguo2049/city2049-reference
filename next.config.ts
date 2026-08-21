import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "city2049-reference";
const pagesBasePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: "export" as const } : {}),
  assetPrefix: pagesBasePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
