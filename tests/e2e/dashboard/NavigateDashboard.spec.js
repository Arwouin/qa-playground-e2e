const { test, expect } = require('@playwright/test');
const { NavigateDashboard } = require('../../../pages/navigate.dashboard.page');
const { LoginPage } = require('../../../pages/login.page');
const users = require('../../../userJson/users.json');

test.describe("Utilisation du dashboard via les différents utilisateurs", () => {
    let loginPage;
    let dashboardNav;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardNav = new NavigateDashboard(page);

        await loginPage.navigateTo('')
    });

    test("Utilisation du dashboard pour un standard_user", async ({ page }) => {
        await test.step("Connexion en tant qu'utilisateur standard", async () => {
            await loginPage.login(
                users.user_standard.username,
                users.user_standard.password
            );
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
        });

        await test.step("Ajout d'un produit au panier", async () => {
            await dashboardNav.clickOnProduct(0)
        });

        await test.step("Vérification que l'icône du panier affiche '1'", async () => {
            const count = await dashboardNav.getCountOfCart();
            expect(count).toBe(1)
        });

        await test.step("Vérification du panier (URL et produit visible)", async () => {
            await dashboardNav.goToCart();
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/cart.html');
            await page.screenshot ({ path: "screenshots/screenshots-dashboard/cart_as_standard_user.png", fullPage: true });
        });

        await test.step("Suppression du produit et vérification de l'actualisation du panier", async () => {
            await dashboardNav.removeProduct(0);
            const count = await dashboardNav.getCountOfCart();
            expect(count).toBe(0);
        });
    });

    test("Utilisation du dashboard avec le 'problem user'", async ({ page }) => {
        await test.step("Connexion en tant que problem_user", async () => {
            await loginPage.login(
                users.problem_user.username,
                users.problem_user.password
            );
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
        });

        await test.step("Anticipation de bug", async () => {
            await page.screenshot ({ path: "screenshots/screenshots-dashboard/page_as_problem_user.png", fullPage: true })
        });
    });

    test("Utilisation du dashboard avec le 'performance_glitch_user' + mesurer le temps de chargement", async ({ page }) => {
        const loadStart = Date.now();

        await test.step("Connexion en tant que performance_glitch_user", async () => {
            await loginPage.login(
                users.performance_glitch_user.username,
                users.performance_glitch_user.password
            );
        });

        await test.step("Attendre le chargement de la page", async () => {
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
            await dashboardNav.waitForLoad();
        });

        await test.step("Mesure du temps de chargement et console.log", async () => {
            const loadEnd = Date.now();
            const time = loadEnd - loadStart;
            console.log(`Temps de chargement = ${time} ms`);
        });

        await test.step("Screenshot et vérification que la page soit bien chargée", async () => {
            await page.screenshot({
                path: "screenshots/screenshots-dashboard/glitch_user_page.png",
                fullPage: true 
            });
        });
    });
});