import { Page, expect } from "@playwright/test";

export async function loginUser(
  page: Page,
  email: string,
  password: string,
  rememberMe: boolean = false,
  tag: string,
) {
  await page.goto("http://localhost:5173/auth/login");
  await page.getByTestId("login-email-input").fill(email);
  await page.getByTestId("login-password-input").fill(password);

  if (rememberMe) {
    await page.getByTestId("login-remember-me-checkbox").check();
  }

  await page.getByTestId("login-submit-button").click();
  await expect(page).toHaveURL("http://localhost:5173/");
  await expect(page.getByText(tag)).toBeVisible();
}
export async function logoutUser(page: Page) {
  await page.getByTestId("user-menu-button").click();
  await page.getByTestId("user-menu-logout").click();
  await expect(page.getByTestId("header-login-button")).toBeVisible();
}

export async function gotoProfilePage(page: Page) {
  await page.getByTestId("user-menu-button").click();
  await page.getByTestId("user-menu-profile").click();
  await expect(page).toHaveURL(/.*user/);
}

export async function sendJoinRequest(page: Page, team: string) {
  await page.getByTestId("team-join-button").click();
  await page.getByTestId("join-team-autocomplete-input").fill(team);
  await page.getByRole("option", { name: team }).click();
  await page.getByTestId("modal-confirm-button").click();
  //verify snackbar
  await expect(page.getByText("Demande effectuée avec succès !")).toBeVisible();
}
