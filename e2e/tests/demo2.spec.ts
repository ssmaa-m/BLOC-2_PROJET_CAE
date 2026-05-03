import { test, expect } from "@playwright/test";
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

test("Demo: Sprint 2", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  test.setTimeout(3 * 300000);
  // check tournament info
  await expect(page.locator(".MuiBox-root.css-1bg6rai")).toBeVisible();
  await page.getByRole("link", { name: "Vinci Easter Cup 2026 7 / 8" }).click();
  await expect(page.getByTestId("tournament-banner-name")).toBeVisible();
  await expect(page.getByText("Jeudi 15 Avr. - Dimanche 25")).toBeVisible();
  await expect(
    page.getByTestId("tournament-banner-deadline").getByText("avr."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tournoi de Pâques ouvert à" }),
  ).toBeVisible();

  await expect(page.getByTestId("tournament-capacity-display")).toBeVisible();
  await page.getByTestId("nav-tournaments-tab").click();
  await page.getByText("À venirEn coursPassés").click();
  await page.getByRole("button", { name: "Passés" }).click();
  await page.getByRole("link", { name: "Spring Arena Cup 2025 7 / 8" }).click();
  // test create tournament
  await page.getByTestId("header-login-button").click();
  await page.getByTestId("login-email-input").click();
  await page.getByTestId("login-email-input").fill("tibo@mail.com");
  await page.getByTestId("login-password-input").click();
  await page.getByTestId("login-password-input").fill("Password1!");
  await page.getByTestId("login-submit-button").click();
  await page.getByTestId("admin-create-tournament-button").click();
  await page.getByRole("textbox", { name: "ex: Worlds" }).click();
  await page
    .getByRole("textbox", { name: "ex: Worlds" })
    .fill("Nebula Nexus Invitational");
  await page.getByRole("textbox", { name: "Décrivez votre tournoi" }).click();
  await page
    .getByRole("textbox", { name: "Décrivez votre tournoi" })
    .fill(
      "Tournoi expérimental dans l’arène Vinci où stratégie et coordination\nseront poussées à l’extrême, dans une ambiance futuriste inspirée des combats\ninterstellaires",
    );
  await page.getByRole("button", { name: "Suivant" }).click();
  //test date input
  const startInput = page.getByTestId("tournament-form-start-date");
  const endInput = page.getByTestId("tournament-form-end-date");
  const deadlineInput = page.getByTestId("tournament-form-deadline");

  await startInput.focus();
  await page.keyboard.press("Control+A");
  await startInput.fill("01/01/2026");

  await page.getByRole("button", { name: "Créer" }).click();
  await expect(page.getByTestId("ErrorOutlineIcon").first()).toBeVisible();

  await deadlineInput.focus();
  await page.keyboard.press("Control+A");
  await deadlineInput.fill("30/05/2026 00:00");

  await startInput.focus();
  await page.keyboard.press("Control+A");
  await startInput.fill("03/06/2026");

  await endInput.focus();
  await page.keyboard.press("Control+A");
  await endInput.fill("14/06/2026");

  await page.getByRole("button", { name: "Créer" }).click();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("heading", { name: "Mon Profil" }).click();
  await page.getByTestId("team-quit-button").click();
  await page.getByTestId("modal-confirm-button").click();
  await page.getByTestId("team-join-button").click();
  await page.getByTestId("join-team-autocomplete-input").click();
  await page.getByTestId("join-team-autocomplete-input").fill("te");
  await page.getByRole("option", { name: "TEAM_ALPHA" }).click();
  await page.getByTestId("modal-confirm-button").click();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("heading", { name: "Se Déconnecter" }).click();
  //test tournament modification and publish + registeration to tournament
  await page.getByTestId("header-login-button").click();
  await page.getByTestId("login-email-input").click();
  await page.getByTestId("login-email-input").fill("lea@mail.com");
  await page.getByTestId("login-password-input").click();
  await page.getByTestId("login-password-input").fill("Password1!");
  await page.getByTestId("login-submit-button").click();
  await expect(page.locator(".MuiBox-root.css-1bg6rai")).toBeVisible();
  await page.getByRole("link", { name: "Vinci Easter Cup 2026 7 / 8" }).click();
  await page.getByRole("link", { name: "logo Vinci Arena" }).click();
  await page.getByRole("link", { name: "Nebula Nexus Invitational 0" }).click();
  await page.getByTestId("tournament-edit-button").click();
  await page.getByRole("textbox", { name: "ex: Worlds" }).click();
  await page.getByRole("textbox", { name: "ex: Worlds" }).fill("Nebula Nexus");
  await page.getByRole("button", { name: "Détails" }).click();
  await page.getByRole("button").nth(5).click();
  await page.getByRole("button").nth(5).click();
  await page.getByRole("button").nth(5).click();
  await page.getByRole("button").nth(5).click();
  await page.getByRole("button", { name: "Modifier" }).click();
  await expect(page.getByTestId("tournament-banner-name")).toBeVisible();
  await page.getByTestId("tournament-primary-action-button").click();
  await page.getByTestId("modal-confirm-button").click();
  await expect(page.getByText("Inscriptions").first()).toBeVisible();
  await page.getByTestId("tournament-register-button").click();
  await page.getByTestId("modal-confirm-button").click();
  await expect(page.getByTestId("ErrorOutlineIcon")).toBeVisible();
  await page.getByTestId("notification-menu-button").click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Iron souhaite rejoindre" })
    .click();
  await page.locator(".MuiBackdrop-root").click();
  await page.getByTestId("join-request-accept-button").click();
  await page.getByTestId("nav-tournaments-tab").click();
  await page
    .getByRole("link", { name: "Nebula Nexus 0 / 12 Mer. 3 -" })
    .click();
  await page.getByTestId("tournament-register-button").click();
  await page.getByTestId("modal-confirm-button").click();
  await expect(page.getByRole("alert").getByRole("img")).toBeVisible();
  await page.getByRole("link", { name: "TEAM_ALPHA" }).click();
  await expect(
    page.getByRole("link", { name: "Nebula Nexus 1 / 12 Mer. 3 -" }),
  ).toBeVisible();
  await page.getByTestId("nav-tournaments-tab").click();
  await page.getByRole("link", { name: "Vinci Easter Cup 2026 7 / 8" }).click();
  await page.getByTestId("tournament-register-button").click();
  await page.getByTestId("modal-confirm-button").click();
  await expect(
    page.locator("span").filter({ hasText: "Inscriptions closes" }),
  ).toBeVisible();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("heading", { name: "Mon Profil" }).click();
  await page.getByTestId("team-view-button").click();
  await expect(
    page.getByRole("link", { name: "Vinci Easter Cup 2026 8 / 8" }),
  ).toBeVisible();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("heading", { name: "Se Déconnecter" }).click();
  // test full capacity tournament
  await page.getByTestId("header-login-button").click();
  await page.getByTestId("login-email-input").click();
  await page.getByTestId("login-email-input").fill("lisa@mail.com");
  await page.getByTestId("login-password-input").click();
  await page.getByTestId("login-password-input").fill("Password1!");
  await page.getByTestId("login-submit-button").click();
  await expect(
    page.getByRole("link", { name: "Vinci Easter Cup 2026 8 / 8" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Vinci Easter Cup 2026 8 / 8" }).click();
  await expect(page.getByTestId("tournament-capacity-display")).toBeVisible();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("heading", { name: "Se Déconnecter" }).click();
  //ban member test
  await page.getByTestId("header-login-button").click();
  await page.getByTestId("login-email-input").click();
  await page.getByTestId("login-email-input").fill("lea@mail.com");
  await page.getByTestId("login-password-input").click();
  await page.getByTestId("login-password-input").fill("Password1!");
  await page.getByTestId("login-submit-button").click();
  await page.getByTestId("admin-manage-members-button").click();
  await page
    .getByRole("textbox", { name: "Rechercher par tag ou email..." })
    .click();
  await page
    .getByRole("textbox", { name: "Rechercher par tag ou email..." })
    .fill("sto");
  await page.getByRole("button", { name: "Bannir" }).click();
  await page.getByRole("button", { name: "Bannir" }).click();
  await page.getByTestId("admin-filter-button").click();
  await page.getByTestId("filter-option-all").press("Escape");
  await page.getByTestId("admin-filter-button").press("Escape");
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("heading", { name: "Se Déconnecter" }).click();
  await page.getByTestId("header-login-button").click();
  await page.getByTestId("login-email-input").click();
  await page.getByTestId("login-email-input").fill("lisa@mail.com");
  await page.getByTestId("login-password-input").click();
  await page.getByTestId("login-password-input").fill("Password1!");
  await page.getByTestId("login-submit-button").click();
  await expect(page.getByTestId("ErrorOutlineIcon")).toBeVisible();
});
