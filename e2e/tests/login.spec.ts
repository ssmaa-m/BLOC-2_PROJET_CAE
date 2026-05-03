import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    //start from login page
    await page.goto("http://localhost:5173/auth/login");
  });

  test("TC1: Success Login with valid credentials", async ({ page }) => {
    //valid credentials
    await page.getByPlaceholder("Email").fill("ines@mail.com");
    await page.getByPlaceholder("Mot de passe").fill("Password1!");

    await page.getByLabel("Se souvenir de moi").check();

    await page.getByRole("button", { name: "Se Connecter" }).click();

    // assert: redirection to hompage
    await expect(page).toHaveURL("http://localhost:5173/");
    // assert: verify logged in
    await expect(page.getByText("se connecter")).not.toBeVisible();
  });

  test("TC 2: Should fail with invalid email format", async ({ page }) => {
    await page.getByPlaceholder("Email").fill("not-an-email");
    await page.getByPlaceholder("Mot de passe").fill("any-password");

    await page.getByRole("button", { name: "Se Connecter" }).click();

    await expect(page).toHaveURL(/.*login/);
    const loadingIcon = page.locator(".loading-icon");
    await expect(loadingIcon).not.toBeVisible();
  });
});
