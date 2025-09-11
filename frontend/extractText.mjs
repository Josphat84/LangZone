// extractText.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const pagesDir = path.join(process.cwd(), 'app'); // change to 'pages' if needed
const locale = process.argv[2] || 'sn'; // e.g., 'sn' for Shona
const outputFile = path.join(process.cwd(), 'locales', `${locale}.json`);

// Load existing translations or start fresh
let existingTranslations = {};
if (fs.existsSync(outputFile)) {
  try {
    const data = fs.readFileSync(outputFile, 'utf8');
    existingTranslations = JSON.parse(data);
  } catch (e) {
    console.warn(`Failed to read existing ${locale}.json, starting fresh: ${e.message}`);
  }
}

const newEntries = {};

function addText(key, value) {
  if (!(key in existingTranslations)) {
    newEntries[key] = "";
  }
}

// Helper to recursively extract text from JSX nodes
function extractJSXText(node) {
  let text = "";

  if (node.type === "JSXText") {
    text += node.value;
  } else if (node.type === "JSXExpressionContainer" && node.expression.type === "StringLiteral") {
    text += node.expression.value;
  } else if (node.children) {
    node.children.forEach(child => {
      text += extractJSXText(child);
    });
  }

  return text;
}

async function extractText() {
  const files = await glob(`${pagesDir}/**/*.{tsx,jsx}`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    let ast;
    try {
      ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
    } catch (e) {
      console.warn(`Failed to parse ${file}: ${e.message}`);
      continue;
    }

    traverse(ast, {
      JSXElement(path) {
        const text = extractJSXText(path.node).trim();
        if (text.length > 0) {
          const key = text
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^\w_]/g, '');
          addText(key, text);
        }
      }
    });
  }

  const merged = { ...existingTranslations, ...newEntries };
  fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
  console.log(`✅ ${locale}.json updated. ${Object.keys(newEntries).length} new keys added.`);

  // List empty keys
  const emptyKeys = Object.entries(merged)
    .filter(([_, value]) => value === "")
    .map(([key]) => key);

  if (emptyKeys.length > 0) {
    console.log(`📝 Keys still needing translation (${emptyKeys.length}):`);
    emptyKeys.forEach(key => console.log(`- ${key}`));
  } else {
    console.log("🎉 All keys have translations!");
  }
}

extractText();
