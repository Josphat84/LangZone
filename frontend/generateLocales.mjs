// generateLocales.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const pagesDir = path.join(process.cwd(), 'app'); // adjust if using 'pages/'
const localesDir = path.join(process.cwd(), 'locales');

// List of locales you want to manage
const locales = ['en', 'sn', 'es']; 

// Helper function to extract JSX text recursively
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

// Ensure locales directory exists
if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir);

async function generateLocales() {
  const files = await glob(`${pagesDir}/**/*.{tsx,jsx}`);

  // Collect all unique text keys from pages
  const allTextKeys = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    let ast;
    try {
      ast = parse(content, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
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
          allTextKeys.add(key);
        }
      }
    });
  }

  // Update each locale
  locales.forEach(locale => {
    const localeFile = path.join(localesDir, `${locale}.json`);
    let existingTranslations = {};

    if (fs.existsSync(localeFile)) {
      try {
        const data = fs.readFileSync(localeFile, 'utf8');
        existingTranslations = JSON.parse(data);
      } catch (e) {
        console.warn(`Failed to read ${locale}.json, starting fresh: ${e.message}`);
      }
    }

    const newTranslations = {};
    allTextKeys.forEach(key => {
      if (key in existingTranslations) {
        newTranslations[key] = existingTranslations[key];
      } else {
        newTranslations[key] = "";
      }
    });

    fs.writeFileSync(localeFile, JSON.stringify(newTranslations, null, 2));
    console.log(`✅ ${locale}.json updated with ${allTextKeys.size} keys.`);
  });
}

generateLocales();
