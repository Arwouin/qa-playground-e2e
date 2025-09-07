const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../pages/login.page');
const users = require('../../../userJson/users.json');

test.describe('Test de connexion avec utilisateur et mot de passe demandé', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo("");
    });

    test("Connexion sur le site web", async ({ page }) => {
        await loginPage.login(
            users.user.username,
            users.user.password
        );
        await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
    });
});

