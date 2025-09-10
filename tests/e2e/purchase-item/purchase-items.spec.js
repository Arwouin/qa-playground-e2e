const { test, expect } = require('@playwright/test');
const { LoginPage } = require("../../../pages/login.page");
const { NavigateDashboard } = require("../../../pages/navigate.dashboard.page");
const users = require('../../../userJson/users.json');

test.describe("Achat d'un article avec les différents utilisateurs", () => {
    let loginPage;
    let dashboard;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboard = new NavigateDashboard(page);

        await loginPage.navigateTo('');
    });

    test("Achat d'un item en tant que standard_user", async ({ page }) => {
        await test.step("Connexion en tant que standard_user", async () => {
            await loginPage.login(
                users.user_standard.username,
                users.user_standard.password 
            );
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
        });

        await test.step("Ajouter un panier au panier et vérification de l'ajout", async () => {
            await dashboard.clickOnProduct(0);
            const cart = await dashboard.getCountOfCart();
            expect(cart).toBe(1);
        });

        await test.step("Procéder au paiement de celui-ci", async () => {
            await dashboard.goToCart();
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/cart.html');
            await dashboard.purchaseItem('Jean', 'Jacques', '20000');

            await expect(page).toHaveURL('https://www.saucedemo.com/v1/checkout-complete.html');
        });

        await test.step("Screenshot de la page affirmant la commande", async () => {
            await page.screenshot({
                path: 'screenshots/screenshots-purchase/command_as_standar_user.png',
                fullPage: true
            });
        });
    });
});