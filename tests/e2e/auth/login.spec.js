const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../pages/login.page');
const users = require('../../../userJson/users.json');

const invalid_credentials = [
    { username: "", password: ""},
    { username: "standard_user", password: ""},
    { username: "", password: "secret_sauce"}
];

test.describe('Test de connexion avec utilisateur et mot de passe demandé', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo("");
    });

    test("Connexion sur le site web avec un utilisateur standard", async ({ page }) => {
        await loginPage.login(
            users.user_standard.username,
            users.user_standard.password
        );
        await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
    });

    for (const { username, password } of invalid_credentials) {
        test(`Erreur de connexion avec username=${username} et password=${password}`, async ({ page }) => {
            await test.step('Remplir le formulaire de connexion', async () => {
                await loginPage.login(username, password);
            });
            
            await test.step("Vérifier le message d'erreur", async () => {
                await expect(loginPage.error).toBeVisible();
            });
            
            await test.step("Screenshot des messages d'erreur", async () => {
                await page.screenshot({ path: `screenshots/screenshots-login/error_login_as${username || 'empty'}_${password || 'empty'}.png`, fullPage: true });
            });
        });
    };

    test("Connexion en tant qu'utilisateur bloqué", async ({ page }) => {
        await test.step("Remplissage du formulaire avec locked_user", async () => {
            await loginPage.login(
                users.locked_user.username,
                users.locked_user.password
            );
        });

        await test.step("Vérification du message d'erreur et screenshot", async () => {
            await expect(loginPage.error).toBeVisible();
            await expect(loginPage.error).toContainText("this user has been locked out.");
            await page.screenshot ({ path: 'screenshots/screenshots-login/locked_user.png', fullPage: true });
        });
    });

    test("Connexion en tant que 'problem_user'", async ({ page }) => {
        await test.step("Remplissage du formulaire en problem_user", async () => {
            await loginPage.login(
                users.problem_user.username,
                users.problem_user.password 
            );
        });

        await test.step("Vérification de la redirection et vérification via un screenshot", async () => {
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
            await page.screenshot ({ path: "screenshots/screenshots-login/redirection-ok.png", fullPage: true});
        });
    });

    test("Connexion en tant que performance_glitch_user", async ({ page }) => {
        await test.step("Remplissage du formulaire en tant que performance glitch user", async () => {
            await loginPage.login(
                users.performance_glitch_user.username,
                users.performance_glitch_user.password 
            );
        });

        await test.step("Attente de chargement de l'URL (Erreur par défaut du site web) et vérification de celle-ci", async () => {
            await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
            await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
        });
    });
});

