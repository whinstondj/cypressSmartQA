const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  projectId: "z5ejux",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
