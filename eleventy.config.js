export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");

    eleventyConfig.addFilter("productDocs", function (collection, productInputPath, section) {
        const productBasePath = productInputPath.replace(/index\.md$/, "");
        const sectionPath = `${productBasePath}${section}/`;

        return collection
            .filter(item => item.inputPath.startsWith(sectionPath))
            .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
    });

    return {
        pathPrefix: process.env.SITE_PATH_PREFIX || "/",
        dir: {
            input: "src",
            output: "_site"
        }
    };
}
