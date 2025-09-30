const { DateTime } = require("luxon");

module.exports = (eleventyConfig) => {
    eleventyConfig.setServerOptions({
        host: "0.0.0.0", // bind inside container
        port: 8080,      // keep your compose mapping 8090:8080
        showAllHosts: true, // logs host/port in console
    });

    // Watch Tailwind interim output so Browsersync reloads when CSS changes
    eleventyConfig.addWatchTarget("src/assets/styles.css");

    // Copy final CSS into the output dir (written by postcss step)
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

    eleventyConfig.setBrowserSyncConfig({
        files: 'src/assets/*.css',
    });

    // ⬅️ Make /admin available at http://localhost:8090/admin/
    eleventyConfig.addPassthroughCopy({ "admin": "admin" });

    // Copy static assets if you add any later, e.g. images/
    // eleventyConfig.addPassthroughCopy({ "src/images": "assets/images" });

    // ---- Date filters for Nunjucks ----
    eleventyConfig.addFilter("date", (dateObj, format = "yyyy-LL-dd") => {
        // Accept JS Date or date-like string
        const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
        return DateTime.fromJSDate(d, { zone: "utc" }).toFormat(format);
    });

    // Optional helpers
    eleventyConfig.addFilter("readableDate", (dateObj) =>
        DateTime.fromJSDate(dateObj instanceof Date ? dateObj : new Date(dateObj), { zone: "utc" })
        .toFormat("LLL dd, yyyy")
    );

    eleventyConfig.addFilter("htmlDateString", (dateObj) =>
        DateTime.fromJSDate(dateObj instanceof Date ? dateObj : new Date(dateObj), { zone: "utc" })
        .toFormat("yyyy-LL-dd")
    );
    // ---- end date filters ----

    eleventyConfig.addShortcode("year", () => DateTime.now().toFormat("yyyy"));


    // Collections: all posts
    eleventyConfig.addCollection("posts", (collectionApi) =>
        collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
    );

    return {
        dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        templateFormats: ["njk", "md"]
    };
};
