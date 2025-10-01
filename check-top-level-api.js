// check-top-level-api.js


// check-top-level-api.js
const fs = require('fs');
const path = require('path');

const foldersToScan = ['./app', './components', './lib']; // Add any other folders with TS/TSX files
const apiKeywords = ['fetch', 'supabase', 'OpenAI', 'axios']; // Add any other API keywords

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check if line contains API keyword outside function/useEffect
    if (
      apiKeywords.some(keyword => trimmed.includes(keyword)) &&
      !trimmed.startsWith('function') &&
      !trimmed.startsWith('const') && 
      !trimmed.startsWith('let') &&
      !trimmed.startsWith('useEffect') &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('*') // ignore JSDoc
    ) {
      console.log(`[!] Potential top-level API call in ${filePath}:${idx + 1}`);
      console.log(`    ${trimmed}`);
    }
  });
}

function scanFolder(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      scanFolder(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      scanFile(fullPath);
    }
  });
}

// Run scan
foldersToScan.forEach(folder => {
  if (fs.existsSync(folder)) {
    scanFolder(folder);
  }
});
