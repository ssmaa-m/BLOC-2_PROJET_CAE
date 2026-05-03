import { test, expect } from "@playwright/test";

test.describe("Admin Access", () => {
  test("TC3.1: Admin 'Lea' should see the Create Tournament button", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173/auth/login");

    //  Login as Lea (Admin credentials)
    await page.getByPlaceholder("Email").fill("lea@mail.com");
    await page.getByPlaceholder("Mot de passe").fill("Password1!");
    await page.getByRole("button", { name: "Se Connecter" }).click();

    // assert: verify successful redirection
    await expect(page).toHaveURL("http://localhost:5173/");

    // Assert: The "Créer un tournoi" button must be visible for an Admin
    const createButton = page.getByRole("button", { name: "Créer un tournoi" });
    await expect(createButton).toBeVisible();

    // Verify that clicking it actually opens the modal
    await createButton.click();
    await expect(page.getByText("Informations")).toBeVisible();
  });
});
