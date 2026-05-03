import { test, expect } from "@playwright/test";
import { loginUser, logoutUser, gotoProfilePage } from "./utils/auth-utils";

test.describe("Profile Modification Flow", () => {
  // Scenario Data - Using Lynx for this independent test
  test.setTimeout(2 * 300000);
  const user = {
    tag: "Lynx",
    email: "lea@mail.com",
    password: "Password1!",
  };

  test("should update avatar and specialty successfully", async ({ page }) => {
    await loginUser(page, user.email, user.password, true, user.tag);
    await gotoProfilePage(page);

    // --- TEST CHANGE AVATAR ---
    await page.getByTestId("profile-avatar-clickable").click();

    // Ensure the modal is visible before selecting
    const avatarOption = page.locator('img[src*="/assets/avatars/"]').nth(8);
    await expect(avatarOption).toBeVisible();
    await avatarOption.click();
    await page.getByRole("button", { name: "Confirmer" }).click();

    // --- TEST CHANGE SPECIALTY ---

    await page.getByTestId("profile-edit-button").click();
    await page.getByTestId("edit-menu-specialty").click();

    const specialtyInput = page.getByTestId("specialty-select-input");
    await specialtyInput.fill("perturbateur");
    await page.keyboard.press("Enter");

    // Click confirm for the specialty change
    await page.getByTestId("modal-confirm-button").click();

    // Final verification of the specialty display
    const specialtyChip = page.getByTestId("profile-specialty-display");
    await expect(specialtyChip).toHaveText(/Perturbateur/i);

    await logoutUser(page);
  });
});
