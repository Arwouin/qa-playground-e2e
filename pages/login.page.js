const { BasePage } = require('./base.page');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.username = "#user-name";
        this.password = "#password";
        this.loginButton = this.page.getByRole('button', { name: "LOGIN"});
        this.error = this.page.locator('[data-test="error"]');
    };

    async login(username, password) {
        await this.page.fill(this.username, username);
        await this.page.fill(this.password, password);
        await this.loginButton.click();
    };
};
module.exports = { LoginPage }