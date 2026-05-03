import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Register", () => {
  test("TC1.1: Complete multi-step registration with MUI elements", async ({
    page,
  }) => {
    test.setTimeout(60000);
    // step 1
    const email = faker.internet.email();
    const tag = faker.internet.username();
    const password = "SecurePassword123!";

    await page.goto("http://localhost:5173/auth/register");

    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Tag").fill(tag);

    // search menu speciality
    const specialtyInput = page.getByPlaceholder("Spécialité");
    await specialtyInput.fill("gar");

    // expect searched value to appear
    await page.getByRole("option", { name: "Gardien" }).click();

    await page.getByRole("button", { name: "Continuer" }).click();

    // step 2
    await page.getByPlaceholder("Mot de passe").first().fill(password);
    await page.getByPlaceholder("Confirmer le mot de passe").fill(password);
    await page.getByRole("button", { name: "Continuer" }).click();

    // step 3
    await page.locator(".profile-picture-placeholder").click();

    // profile picture modal
    const firstAvatarOption = page
      .locator('img[src*="/assets/avatars/"]')
      .first();
    await expect(firstAvatarOption).toBeVisible();
    await firstAvatarOption.click();

    // 3. Confirm the selection in the pop-up
    await page.getByRole("button", { name: "Confirmer" }).click();

    await page.getByRole("button", { name: "S'inscrire" }).click();

    //verify we are in log in page
    await expect(page).toHaveURL(/.*login/);
  });
});
