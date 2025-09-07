const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    use: {
        headless: true,
        launchOptions: {
            slowMo: 1000,
        }
    }
})