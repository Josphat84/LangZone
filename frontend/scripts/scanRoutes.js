//Scan routes in the app directory
//This script scans the app directory for route files and generates a routes.json file
//that can be used by the frontend to dynamically load routes.

// scripts/scanRoutes.js


import fs from "fs";
import path from "path";

const appDir = path.join(process.cwd(), "app");

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
console.log("Discovered routes:", routes);