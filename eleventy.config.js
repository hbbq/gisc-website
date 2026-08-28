import fs from "node:fs";
import path from "node:path";

export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/products/**/schematics/**/*");
    eleventyConfig.addPassthroughCopy("src/products/**/references/**/*");

    eleventyConfig.addFilter("productDocs", function (collection, productInputPath, section) {
        const productBasePath = productInputPath.replace(/index\.md$/, "");
        const sectionPath = `${productBasePath}${section}/`;

        return collection
            .filter(item => item.inputPath.startsWith(sectionPath))
            .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
    });

    eleventyConfig.addFilter("productFiles", function (productInputPath, section) {
        const productBasePath = productInputPath.replace(/index\.md$/, "");
        const sectionPath = path.normalize(`${productBasePath}${section}/`);

        if (!fs.existsSync(sectionPath)) {
            return [];
        }

        const files = [];

        function collectFiles(directory) {
            for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
                const filePath = path.join(directory, entry.name);

                if (entry.isDirectory()) {
                    collectFiles(filePath);
                } else if (entry.isFile() && entry.name !== ".gitkeep") {
                    const url = filePath
                        .replace(/\\/g, "/")
                        .replace(/^\.\/src\//, "/")
                        .replace(/^src\//, "/");

                    files.push({
                        name: entry.name,
                        url
                    });
                }
            }
        }

        collectFiles(sectionPath);
        return files.sort((a, b) => a.name.localeCompare(b.name));
    });

    return {
        pathPrefix: process.env.SITE_PATH_PREFIX || "/",
        dir: {
            input: "src",
            output: "_site"
        }
    };
}
