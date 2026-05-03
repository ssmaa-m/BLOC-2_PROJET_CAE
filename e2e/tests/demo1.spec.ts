import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import {
  gotoProfilePage,
  loginUser,
  logoutUser,
  sendJoinRequest,
} from "./utils/auth-utils";
test.beforeAll(async () => {
  console.log("\n\x1b[1m\x1b[41m\x1b[37m ATTENTION \x1b[0m");
  console.log(
    "\x1b[31mThis test requires a fresh database state to run correctly.\x1b[0m",
  );
  console.log(
    "\x1b[31mPlease ensure you have restarted the backend if you have made any modifications\x1b[0m",
  );
  console.log("\x1b[31mor executed any other E2E tests.\x1b[0m\n");
});

test.describe("Client Demonstration", () => {
  interface UserInfo {
    tag: string;
    specialty?: string;
    email: string;
    password: string;
    team?: string;
  }
  // Data for the scenario
  const invalidEmail = "lea@mail.com";
  const validEmail = faker.internet.email();
  const vectorr: UserInfo = {
    tag: "Vectorr",
    specialty: "Catalyseur",
    email: invalidEmail,
    password: "Password123*",
    team: "TEAM_ALPHA",
  };

  const lynx: UserInfo = {
    tag: "Lynx",
    email: "lea@mail.com",
    password: "Password1!",
  };

  const iron: UserInfo = {
    tag: "Iron",
    email: "tibo@mail.com",
    password: "Password1!",
  };

  test("Demo: Sprint 1", async ({ page, context }) => {
    //Custom timeout
    test.setTimeout(3 * 300000);

    await page.goto("http://localhost:5173/");

    //register new member
    //go to register page
    await page.getByRole("button", { name: "S'Inscrire" }).click();

    // fill infos
    await page.getByTestId("register-email-input").fill(vectorr.email);
    await page.getByTestId("register-tag-input").fill(vectorr.tag);

    let specialtyInput = page.getByTestId("register-specialty-input");
    await specialtyInput.fill(vectorr.specialty!.slice(0, 5));
    await page.getByRole("option", { name: vectorr.specialty }).click();

    await page.getByTestId("register-submit-step-1").click();

    await page.getByPlaceholder("Mot de passe").first().fill(vectorr.password);
    await page
      .getByPlaceholder("Confirmer le mot de passe")
      .fill(vectorr.password);
    await page.getByTestId("register-submit-step-2").click();

    await page.locator(".profile-picture-placeholder").click();
    //select avatar n° 12
    let avatarOption = page.locator('img[src*="/assets/avatars/"]').nth(12);
    await expect(avatarOption).toBeVisible();
    await avatarOption.click();
    await page.getByRole("button", { name: "Confirmer" }).click();

    //attempt registration with invalid email
    const [response] = await Promise.all([
      // We listen for the POST request to your registration endpoint
      page.waitForResponse(
        (res) => res.url().includes("/register") && res.status() === 409,
      ),
      // The action that triggers the 409
      page.getByTestId("register-submit-step-3").click(),
    ]);

    // verify error snackbar appeared + no navigation
    await expect(page.getByText(/email déjà utilisé/i)).toBeVisible({
      timeout: 10000,
    });
    await expect(page).toHaveURL(/.*register/);

    //change email to valid one
    //return to step 1
    await page.getByTestId("return-step-3").click();
    await page.getByTestId("return-step-2").click();

    //correct email
    const emailInput = page.getByTestId("register-email-input");
    await emailInput.clear();
    vectorr.email = validEmail;
    await emailInput.fill(vectorr.email);

    // validate
    await page.getByTestId("register-submit-step-1").click();
    await page.getByTestId("register-submit-step-2").click();
    await page.getByTestId("register-submit-step-3").click();

    // check navigation to login page
    await expect(page).toHaveURL(/.*login/);

    await loginUser(page, vectorr.email, vectorr.password, true, vectorr.tag);

    //go to profile page
    await gotoProfilePage(page);
    // send join request
    await sendJoinRequest(page, vectorr.team!);

    await logoutUser(page);

    // login as lynx
    await loginUser(page, lynx.email, lynx.password, true, lynx.tag);

    //TEST NOTIFICATIONS
    // open menu
    await page.getByTestId("notification-menu-button").click();

    // Click "Voir Tout"
    const seeAllButton = page.getByTestId("notification-view-all-button");
    await expect(seeAllButton).toBeVisible();
    await seeAllButton.click();

    await expect(page).toHaveURL(/.*notifications/);

    // find row containing user tag and team requested
    const notificationRow = page
      .getByRole("listitem")
      .filter({
        hasText: new RegExp(`(?=.*${vectorr.tag})(?=.*${vectorr.team})`, "i"),
      })
      .first();

    await expect(notificationRow).toBeVisible({ timeout: 10000 });

    // Mark as Read
    const markAsReadBtn = notificationRow.getByTestId(
      "notification-mark-as-read",
    );
    await markAsReadBtn.click();

    // verify mark-as-read button is hidden after click
    await expect(markAsReadBtn).toBeHidden();
    // click notification
    await notificationRow.click();
    await expect(page).toHaveURL(/.*teams/);
    await expect(page.getByText(vectorr.team!)).toBeVisible();

    // TEST ACCEPT REQUEST
    const vectorrRequest = page.getByTestId(`join-request-item-${vectorr.tag}`);
    await expect(vectorrRequest).toBeVisible({ timeout: 10000 });
    await vectorrRequest.getByTestId("join-request-accept-button").click();
    await expect(vectorrRequest).toBeHidden();

    // TEST PROMOTE MANAGER
    await await page.getByTestId("team-promote-button").click();
    await expect(page.getByTestId("manager-selection-input")).toBeVisible();
    await page.getByTestId("manager-selection-input").fill(vectorr.tag);
    await page.getByTestId(`manager-option-${vectorr.tag}`).click();
    await page.getByTestId("modal-confirm-button").click();

    await logoutUser(page);

    // TEST LOGIN WITH WRONG PASSWORD
    await page.goto("http://localhost:5173/auth/login");
    await page.getByTestId("login-email-input").fill(vectorr.email);
    await page.getByTestId("login-password-input").fill("wrong password");
    await page.getByTestId("login-submit-button").click();
    await expect(page).toHaveURL("http://localhost:5173/auth/login");
    await expect(page.getByText("Identifiants invalides")).toBeVisible();

    await loginUser(page, vectorr.email, vectorr.password, true, vectorr.tag);

    //TEST TEAM JOIN/LEAVE
    await gotoProfilePage(page);
    // check vectorr is in team_alpha now
    await expect(page.getByText(vectorr.team!).first()).toBeVisible();
    // leave team
    await page.getByTestId("team-quit-button").click();
    await page.getByTestId("modal-confirm-button").click();
    //check no longer in team alpha
    await expect(page.getByText(vectorr.team!)).toHaveCount(0);
    //send request to team_omega
    vectorr.team = "TEAM_OMEGA";
    await sendJoinRequest(page, vectorr.team);

    await logoutUser(page);

    // TEST REFUSE JOIN REQUEST
    await loginUser(page, iron.email, iron.password, true, iron.tag);
    await gotoProfilePage(page);
    await page.getByTestId("team-view-button").click();
    //reject
    await page.getByTestId("join-request-deny-button").click();
    // fill rejection reason
    const reasonInput = page.getByTestId("reject-reason-input");
    await expect(reasonInput).toBeVisible();
    const refusalReason = "Désolé, l'équipe est déjà complète.";
    await reasonInput.fill(refusalReason);
    await page.getByTestId("modal-confirm-button").click();
    await expect(
      page.getByTestId(`join-request-item-${vectorr.tag}`),
    ).toBeHidden();

    // TEST UNAVAILIBILITIES
    await gotoProfilePage(page);
    const invalidStart1 = "01/01/2026";
    const invalidEnd1 = "10/01/2026";
    const invalidStart2 = "01/04/2026";
    const invalidEnd2 = "05/04/2026";
    const validStart = "03/04/2027";
    const validEnd = "10/04/2027";
    // open modal
    await page.getByTestId("add-unavailability-button").click();
    const startInput = page.getByTestId("unavailability-start-date");
    const endInput = page.getByTestId("unavailability-end-date");
    await expect(startInput).toBeVisible();

    //Attempt 1: both dates in the past
    await startInput.focus();
    await page.keyboard.press("Control+A");
    await startInput.fill(invalidStart1);
    await endInput.focus();
    await page.keyboard.press("Control+A");
    await endInput.fill(invalidEnd1);
    await page.getByTestId("modal-confirm-button").click();
    //check error is being shown and that the modal isnt closed after "submit"
    await expect(page.getByTestId("ErrorOutlineIcon")).toBeVisible();

    //Attempt 2: start date in the past
    await startInput.focus();
    await page.keyboard.press("Control+A");
    await startInput.fill(invalidStart2);
    await endInput.focus();
    await page.keyboard.press("Control+A");
    await endInput.fill(invalidEnd2);
    await page.getByTestId("modal-confirm-button").click();
    //check error is being shown and that the modal isnt closed after "submit"
    await expect(page.getByTestId("ErrorOutlineIcon")).toBeVisible();

    //Attempt 3: valid dates both in the future
    await startInput.focus();
    await page.keyboard.press("Control+A");
    await startInput.fill(validStart);
    await endInput.focus();
    await page.keyboard.press("Control+A");
    await endInput.fill(validEnd);
    await page.getByTestId("modal-confirm-button").click();

    //check modal is closed and the user page has an unvailibility on display
    await expect(startInput).toBeHidden();
    await expect(page.getByTestId("no-unavailabilities-message")).toBeHidden();

    // quit team
    await page.getByTestId("team-quit-button").click();
    await page.getByTestId("modal-confirm-button").click();

    // TEST MEMBER MANAGEMENT

    //open modal
    await page.getByTestId("admin-manage-members-button").click();

    // check lynx is visible
    const lynxRow = page.getByTestId(`admin-user-row-${lynx.tag}`);
    await expect(lynxRow).toBeVisible();
    // check lynx is admin
    const lynxSwitch = lynxRow
      .getByTestId("admin-status-switch")
      .locator("input");
    await expect(lynxSwitch).toBeChecked();
    //remove admin role
    await lynxSwitch.click();
    await expect(lynxSwitch).not.toBeChecked();

    //check own admin button is disabled
    const ironRow = page.getByTestId(`admin-user-row-${iron.tag}`);
    await expect(
      ironRow.getByTestId("admin-status-switch").locator("input"),
    ).toBeDisabled();

    // give vectorr admin role
    const vectorSwitch = page
      .getByTestId(`admin-user-row-${vectorr.tag}`)
      .getByTestId("admin-status-switch")
      .locator("input");
    await vectorSwitch.click();
    await expect(vectorSwitch).toBeChecked();
    await page.keyboard.press("Escape");

    // CREATE NEW TEAM
    await gotoProfilePage(page);
    await page.getByTestId("team-create-button").click();
    iron.team = "TEAM_BETA";
    await page.getByTestId("create-team-input").fill(iron.team);
    await page.getByTestId("modal-confirm-button").click();
    await expect(page.getByText(iron.team).first()).toBeVisible();
    await logoutUser(page);

    // check vectorr has admin button
    await loginUser(page, vectorr.email, vectorr.password, true, vectorr.tag);
    await expect(
      page.getByTestId("admin-create-tournament-button"),
    ).toBeVisible();
    // check notifications to see rejection
    await page.goto("http://localhost:5173/notifications");
    await expect(page.getByText(refusalReason).first()).toBeVisible();
    //check not a part of team
    await gotoProfilePage(page);
    await expect(page.getByTestId("user-team-chip")).toBeHidden();

    // TEST CHANGE PROFILE INFO
    // change image
    await page.getByTestId("profile-avatar-clickable").click();
    avatarOption = page.locator('img[src*="/assets/avatars/"]').nth(8);
    await expect(avatarOption).toBeVisible();
    await avatarOption.click();
    await page.getByRole("button", { name: "Confirmer" }).click();

    //change specialty
    await page.getByTestId("profile-edit-button").click();
    await page.getByTestId("edit-menu-specialty").click();
    specialtyInput = page.getByTestId("specialty-select-input");
    await specialtyInput.fill("perturbateur");
    await page.keyboard.press("Enter");
    await page.getByTestId("modal-confirm-button").click();
    // check specialty change
    const specialtyChip = page.getByTestId("profile-specialty-display");
    await expect(specialtyChip).toHaveText(/Perturbateur/i);
    await page.close();
  });
});
