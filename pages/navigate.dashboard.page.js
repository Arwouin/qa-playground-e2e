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

    async clickOnProduct(index) { // Add product
        const product = this.products.nth(index);
        await product.waitFor({ state: "visible" });
        const addButton = product.locator('button');
        await addButton.click();
    }

    async goToCart() {
        const iconCart = this.page.locator('.shopping_cart_link');
        await iconCart.click();
    }

    async getCountOfCart() {
        const cart = this.page.locator('.fa-layers-counter');
        if (await cart.count() === 0) return 0;
        const text = await cart.first().innerText();
        return parseInt(text);
    }

    async removeProduct(index) {
        const removeButton = this.page.locator('button:has-text("REMOVE")').nth(index);
        await removeButton.click();
    }

    async purchaseItem(first, last, zip) {
        const checkout = this.page.locator('a.btn_action.checkout_button');
        await checkout.waitFor({ state: "visible" });
        await checkout.click();
        
        await this.page.fill('#first-name', first);
        await this.page.fill('#last-name', last);
        await this.page.fill('#postal-code', zip);

        await this.page.locator('input[value="CONTINUE"]').click();
        await this.page.waitForURL('https://www.saucedemo.com/v1/checkout-step-two.html');

        await this.page.locator('a.btn_action.cart_button').click();
    }

    async waitForLoad() {
        await this.products.first().waitFor({ state: "visible" });
    }
}

module.exports = { NavigateDashboard }