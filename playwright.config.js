const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    use: {
        headless: false,
        launchOptions: {
            slowMo: 1000,
        }
    }
})