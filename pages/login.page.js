const { BasePage } = require('./base.page');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.username = "#user-name";
        this.password = "#password";
    };

    async login(username, password) {
        await this.page.fill(this.username, username);
        await this.page.fill(this.password, password);

        await this.page.getByRole('button', { name: "LOGIN" }).click();
    };
};
module.exports = { LoginPage }