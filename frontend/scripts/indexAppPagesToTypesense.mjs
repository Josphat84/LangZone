// scripts/indexAppPagesToTypesense.mjs
// This script scans the app directory for page files and indexes them into a Typesense collection
// for search functionality. It creates/updates a "pages" collection with fields like title, slug, content, and type.

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Typesense from "typesense";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// --- Typesense client ---
const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY, // Server-side key
  connectionTimeoutSeconds: 5,
});

// --- Scan app directory for pages ---
const appDir = path.join(process.cwd(), "app");

function getPages(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let pages = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const isDynamic = entry.name.startsWith("[") && entry.name.endsWith("]");

    // Build route
    let route;
    if (base === "") {
      route = isDynamic ? `/:${entry.name.slice(1, -1)}` : `/${entry.name}`;
    } else {
      route = isDynamic ? `${base}/:${entry.name.slice(1, -1)}` : `${base}/${entry.name}`;
    }

    if (entry.isDirectory()) {
      pages = pages.concat(getPages(fullPath, route));
    } else if (entry.name === "page.tsx" || entry.name === "page.js") {
      // Extract meaningful title from the route
      const pathParts = route.split("/").filter(Boolean);
      const titleFromFolder = pathParts.length > 0 
        ? pathParts[pathParts.length - 1]
            .replace(/^:/, "") // Remove leading colon from dynamic segments
            .replace(/([A-Z])/g, " $1") // Add space before capital letters
            .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
            .trim()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Home";

      // Clean the slug
      let cleanSlug = route.replace(/\/page\.(tsx|js)$/, "");
      if (cleanSlug === "") cleanSlug = "/";

      // Read and clean content
      const content = fs.readFileSync(fullPath, "utf-8")
        .replace(/<[^>]+>/g, "") // Remove JSX/HTML tags
        .replace(/import\s+.*?from\s+['"].*?['"]/g, "") // Remove import statements
        .replace(/export\s+(default\s+)?/g, "") // Remove export statements
        .trim();

      // Generate unique ID
      const id = cleanSlug === "/" 
        ? "root" 
        : cleanSlug.replace(/\//g, "_").replace(/:/g, "dynamic_");

      pages.push({
        id,
        title: titleFromFolder,
        slug: cleanSlug,
        content: content.substring(0, 5000), // Limit content length
        type: isDynamic ? "dynamic-page" : "page",
        isDynamic: isDynamic,
        dynamicParam: isDynamic ? entry.name.slice(1, -1) : null,
      });
    }
  }

  return pages;
}

// --- Create or update collection ---
async function createCollection() {
  const schema = {
    name: "pages",
    fields: [
      { name: "id", type: "string" },
      { name: "title", type: "string", sort: true },
      { name: "slug", type: "string", facet: true },
      { name: "content", type: "string" },
      { name: "type", type: "string", facet: true },
      { name: "isDynamic", type: "bool", optional: true },
      { name: "dynamicParam", type: "string", optional: true },
    ],
    default_sorting_field: "title",
  };

  try {
    await typesense.collections("pages").delete();
    console.log("Old collection deleted");
  } catch {
    console.log("No existing collection found, creating new one...");
  }

  await typesense.collections().create(schema);
  console.log("✅ Collection 'pages' created");
}

// --- Index pages ---
async function indexPages() {
  const pages = getPages(appDir);
  
  if (!pages || pages.length === 0) {
    console.log("No pages found to index.");
    return;
  }

  console.log("\n📄 Found pages:");
  pages.forEach(page => {
    console.log(`  ${page.isDynamic ? '🔄' : '📌'} ${page.slug} - ${page.title}`);
  });

  try {
    const collection = typesense.collections("pages");
    const response = await collection.documents().import(
      pages.map((p) => JSON.stringify(p)).join("\n"),
      { action: "upsert" }
    );
    
    console.log(`\n✅ Indexed ${pages.length} pages!`);
    
    // Parse and display results
    const results = response.split("\n").filter(Boolean).map(JSON.parse);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);
    
    console.log(`   - Successful: ${successful}`);
    if (failed.length > 0) {
      console.log(`   - Failed: ${failed.length}`);
      failed.forEach(f => console.log(`     Error: ${f.error}`));
    }
  } catch (err) {
    console.error("❌ Error indexing pages:", err);
  }
}

// --- Run ---
(async () => {
  console.log("🚀 Starting Typesense indexing...\n");
  await createCollection();
  await indexPages();
  console.log("\n✨ Indexing complete!");
})();