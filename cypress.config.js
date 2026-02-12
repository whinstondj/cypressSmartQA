const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  projectId: "z5ejux",
  
  // Configuración para videos y screenshots
  video: true,
  videoCompression: 32,
  videosFolder: 'cypress/videos',
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  trashAssetsBeforeRuns: true,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
