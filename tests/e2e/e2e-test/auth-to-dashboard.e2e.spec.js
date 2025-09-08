const { test, expect } = require('@playwright/test');
const { NavigateDashboard } = require('../../../pages/navigate.dashboard.page');
const { LoginPage } = require('../../../pages/login.page');
const users = require('../../../userJson/users.json');

test.describe('Test E2E contenant login, ajout au panier et vérifications du fonctionnement', () => {
    let loginPage;
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new NavigateDashboard(page);

        await loginPage.navigateTo('');
        await loginPage.login(
            users.user_standard.username,
            users.user_standard.password
        );
        await dashboardPage.waitForLoad();
    });

    test('Ajouter un produit au panier et vérifier que le nbr de produit et correct', async ({ page }) => {
        await dashboardPage.clickOnProduct(0);
        const count = await dashboardPage.getCountOfCart();
        expect(count).toBe(1);
    });
})