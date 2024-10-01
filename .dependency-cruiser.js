/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  allowed: [
    // -------------------------------------------------------------------------
    // Generic rules. These will apply to most projects.
    // -------------------------------------------------------------------------
    // Allow files to import from sibling files unconditionally
    { from: { path: "^src/(.+)/.+" }, to: { path: "^src/$1/.+" } },
    // Allow src files to import from node_modules
    { from: { path: "^src/.+" }, to: { path: "^node_modules/.+" } },
    // Allow node_modules to import from anywhere
    { from: { path: "^node_modules/.+" }, to: { path: ".+" } },

    // -------------------------------------------------------------------------
    // App-specific rules. These are purposely easy to change, since your
    // project will most likely develop its own conventions over time. But
    // having this in place provides a little bit of friction to prevent
    // accidental dependencies from creeping in.
    // -------------------------------------------------------------------------
    {
      from: { path: "^src/.*.test.ts" },
      to: { path: "~/app/context/test-context" },
    },
    {
      from: { path: "src/modules/cache" },
      to: { path: "~/modules/cache/port" },
    },
    {
      from: { path: "src/modules/cache" },
      to: { path: "~/modules/hexagonal" },
    },
    { from: { path: "src/db" }, to: { path: "~/db/port" } },
    { from: { path: "src/db" }, to: { path: "~/modules/hexagonal" } },
    { from: { path: "src/db/blueprints" }, to: { path: "~/db/drizzle" } },
    { from: { path: "src/app" }, to: { path: "~/modules/hexagonal" } },
    { from: { path: "src/app/stores" }, to: { path: "~/modules/cache" } },
    { from: { path: "src/app/services" }, to: { path: "~/app/services" } },
    { from: { path: "src/app/services" }, to: { path: "~/app/repositories" } },
    { from: { path: "src/app/server" }, to: { path: "~/app/context" } },
    { from: { path: "src/app/repositories" }, to: { path: "~/db" } },
    { from: { path: "src/app/repositories" }, to: { path: "~/app/stores" } },
    { from: { path: "src/app/context" }, to: { path: "~/*" } },
  ],
  allowedSeverity: "error",
};
