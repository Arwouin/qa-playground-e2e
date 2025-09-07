class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = "https://www.saucedemo.com/v1/";
    };

    async navigateTo(path) {
        await this.page.goto(`${this.baseUrl}${path}`);
    }
}
module.exports = { BasePage }