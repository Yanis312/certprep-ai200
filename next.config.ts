import type { NextConfig } from "next";

// Export statique pour GitHub Pages. PAGES_BASE_PATH est défini par le workflow
// de déploiement (/certprep-ai200) et reste vide en local.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES_BASE_PATH || "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
