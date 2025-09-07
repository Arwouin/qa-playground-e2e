const { BasePage } = require('./base.page');

class NavigateDashboard extends BasePage {
    constructor(page) {
        super(page);
        this.listClass = '.inventory_list .inventory_item';
        this.products = page.locator(this.listClass);
    };

    async productName(index) {
        await this.products.nth(index);
    }

    async clickOnProduct(index) {
        const product = this.products.nth(index);
        await product.waitFor({ state: "visible" });
        const addButton = product.locator('button');
        await addButton.click();
    }

    async waitForLoad() {
        await this.products.first().waitFor({ state: "visible" });
    }

    async getCountOfCart() {
        const cart = this.page.locator('.fa-layers-counter');
        if (await cart.count() === 0) return 0;
        const text = await cart.first().innerText();
        return parseInt(text);
    }
}

module.exports = { NavigateDashboard }