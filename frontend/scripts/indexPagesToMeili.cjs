// scripts/indexPagesToMeili.cjs
const path = require("path");
const dotenv = require("dotenv");

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const { createClient } = require("@supabase/supabase-js");
const { MeiliSearch } = require("meilisearch");

// --- Environment variables ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const MEILI_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://127.0.0.1:7700";
const MEILI_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.");
  process.exit(1);
}

// --- Supabase client ---
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Meili client ---
const meili = new MeiliSearch({
  host: MEILI_HOST,
  apiKey: MEILI_KEY || undefined,
});

// --- Pagination helper for Supabase ---
async function fetchAllPages(batchSize = 1000) {
  let allPages = [];
  let offset = 0;

  // --- Check if table exists first ---
  const { data: tableCheck, error: tableError } = await supabase
    .from("pg_tables")
    .select("tablename")
    .eq("schemaname", "public")
    .eq("tablename", "pages")
    .limit(1);

  if (tableError) throw tableError;
  if (!tableCheck || tableCheck.length === 0) {
    console.error("❌ Table 'pages' does not exist in the 'public' schema. Please check your database.");
    process.exit(1);
  }

  // --- Fetch pages with pagination ---
  while (true) {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .range(offset, offset + batchSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    allPages.push(...data);
    offset += batchSize;
  }
  return allPages;
}

// --- Index pages to Meili ---
async function indexPages() {
  try {
    const pages = await fetchAllPages();

    if (!pages || pages.length === 0) {
      console.log("No pages found to index.");
      return;
    }

    // Prepare Meili documents
    const docs = pages.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      type: "page",
    }));

    // Ensure index exists and set settings
    const index = meili.index("pages");
    await index.updateSettings({
      searchableAttributes: ["title", "content"],
      displayedAttributes: ["title", "slug", "type"],
    });

    // Add documents
    const response = await index.addDocuments(docs, { primaryKey: "id" });
    console.log(`✅ Indexed ${docs.length} pages! Response:`, response);
  } catch (err) {
    console.error("❌ Error indexing pages:", err);
  }
}

// Run
indexPages();
