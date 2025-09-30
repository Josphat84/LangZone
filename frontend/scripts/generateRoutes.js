//Script to generate a site map for SEO and search engines
// scripts/scanRoutes.js


import fs from "fs";
import path from "path";

const appDir = path.join(process.cwd(), "app");
const publicDir = path.join(process.cwd(), "public"); // for sitemap.xml

function getRoutes(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      routes = routes.concat(
        getRoutes(path.join(dir, entry.name), `${base}/${entry.name}`)
      );
    } else if (entry.name === "page.tsx") {
      routes.push(base === "" ? "/" : base);
    }
  }
  return routes;
}

const routes = getRoutes(appDir);

// 1. Generate sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>https://yourdomain.com${route}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
console.log("✅ sitemap.xml generated in /public");

// 2. Generate a NavigationMenu.tsx component
const navComponent = `
// app/components/NavigationMenu.tsx
"use client";
import Link from "next/link";

export default function NavigationMenu() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100">
      ${routes
        .map(
          (route) =>
            `<Link href="${route}">${route === "/" ? "Home" : route.replace("/", "")}</Link>`
        )
        .join("\n      ")}
    </nav>
  );
}
`;

const componentsDir = path.join(appDir, "components");
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir);
}

fs.writeFileSync(path.join(componentsDir, "NavigationMenu.tsx"), navComponent);
console.log("✅ NavigationMenu.tsx generated in /app/components");


