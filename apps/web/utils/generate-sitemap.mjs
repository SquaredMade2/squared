import { writeFileSync } from "node:fs";
import { globby } from "globby";
import prettier from "prettier";

async function generateSitemap() {
  const pages = await globby([
    "app/**/page.tsx",
    "app/page.tsx",
    "!node_modules/**",
  ]);
  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                const path = page
                  .replace("pages/", "/")
                  .replace("public/", "/")
                  .replace(".tsx", "")
                  .replace(".jsx", "")
                  .replace(".mdx", "")
                  .replace(".md", "")
                  .replace("/rss.xml", "");
                const route = path === "/index" ? "" : path;
                return `
                        <url>
                            <loc>https://develop.squaredmade.com/${route}/</loc>
                        </url>
                    `;
              })
              .join("")}
        </urlset>
    `;
  writeFileSync("public/sitemap.xml", sitemap);
}

// Will call the function whenever the file is run
generateSitemap();
