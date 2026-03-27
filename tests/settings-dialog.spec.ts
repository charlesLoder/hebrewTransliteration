import { expect, test } from "@playwright/test";

test.describe("SettingsDialog - Schema Modification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => localStorage.clear());
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("select shows (user modified) after customizing a value", async ({ page }) => {
    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    const schemaSelect = page.getByTestId("schema-select");
    await expect(schemaSelect).toBeVisible({ timeout: 15000 });

    await page.getByRole("tab", { name: "Consonants" }).click();

    const alefInput = page.locator('input[aria-label="ALEF"]');
    await expect(alefInput).toBeVisible({ timeout: 10000 });
    await alefInput.fill("custom-alef");
    await alefInput.blur();

    await page.getByRole("tab", { name: "Schemas" }).click();

    await expect(schemaSelect).toContainText("(user modified)");
  });

  test("reset button is enabled after modification", async ({ page }) => {
    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    const schemaSelect = page.getByTestId("schema-select");
    await expect(schemaSelect).toBeVisible({ timeout: 15000 });

    await page.getByRole("tab", { name: "Consonants" }).click();

    const alefInput = page.locator('input[aria-label="ALEF"]');
    await expect(alefInput).toBeVisible({ timeout: 10000 });
    await alefInput.fill("modified");
    await alefInput.blur();

    await page.getByRole("tab", { name: "Schemas" }).click();

    const resetButton = page.getByTestId("reset-button");
    await expect(resetButton).toBeEnabled();
  });

  test("clicking reset reverts changes and disables button", async ({ page }) => {
    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    const schemaSelect = page.getByTestId("schema-select");
    await expect(schemaSelect).toBeVisible({ timeout: 15000 });

    await page.getByRole("tab", { name: "Consonants" }).click();

    const alefInput = page.locator('input[aria-label="ALEF"]');
    await expect(alefInput).toBeVisible({ timeout: 10000 });
    await alefInput.fill("modified");
    await alefInput.blur();

    await page.getByRole("tab", { name: "Schemas" }).click();

    const resetButton = page.getByTestId("reset-button");
    await expect(resetButton).toBeEnabled();
    await resetButton.click();

    await page.getByRole("tab", { name: "Consonants" }).click();

    await expect(alefInput).toHaveValue("ʾ");

    await page.getByRole("tab", { name: "Schemas" }).click();

    const resetButtonAfter = page.getByTestId("reset-button");
    await expect(resetButtonAfter).toBeDisabled();
  });

  test("SBL Academic resets to default schema when selected", async ({ page }) => {
    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    const schemaSelect = page.getByTestId("schema-select");
    await expect(schemaSelect).toBeVisible({ timeout: 15000 });

    await page.getByRole("tab", { name: "Consonants" }).click();

    const alefInput = page.locator('input[aria-label="ALEF"]');
    await expect(alefInput).toBeVisible({ timeout: 10000 });
    await alefInput.fill("modified");
    await alefInput.blur();

    await page.getByRole("tab", { name: "Schemas" }).click();

    await expect(schemaSelect).toBeVisible({ timeout: 10000 });
    await schemaSelect.selectOption("SBL Academic");

    await page.getByRole("tab", { name: "Consonants" }).click();

    await expect(alefInput).toHaveValue("ʾ");
  });

  test("after page reload, selected schema name persists", async ({ page }) => {
    async function validateSchemaValue(stepName: string, value: string = "SBL Academic") {
      await test.step(`Verification: ${stepName}`, async () => {
        await expect(schemaSelect).toHaveValue(value);
      });
    }

    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    const schemaSelect = page.getByTestId("schema-select");

    await validateSchemaValue("Initial Load");

    schemaSelect.selectOption("Tiberian");

    await validateSchemaValue("After select change", "Tiberian");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await settingsBtn.click();
    await expect(schemaSelect).toBeVisible({ timeout: 15000 });

    await validateSchemaValue("After Reload", "Tiberian");
  });

  test("after page reload, (user modified) suffix persists", async ({ page }) => {
    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    const schemaSelect = page.getByTestId("schema-select");
    await expect(schemaSelect).toBeVisible({ timeout: 15000 });

    schemaSelect.selectOption("Tiberian");

    await page.getByRole("tab", { name: "Consonants" }).click();

    const alefInput = page.locator('input[aria-label="ALEF"]');
    await expect(alefInput).toBeVisible({ timeout: 10000 });
    await alefInput.fill("custom-alef");
    await alefInput.blur();

    await page.getByRole("tab", { name: "Schemas" }).click();

    await expect(schemaSelect).toContainText("(user modified)");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await settingsBtn.click();
    await expect(schemaSelect).toBeVisible({ timeout: 15000 });

    await expect(schemaSelect).toContainText("Tiberian");
    await expect(schemaSelect).toContainText("(user modified)");
  });
});

test.describe("SettingsDialog - Additional Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("edit button opens feature editor without crashing after localStorage round-trip", async ({
    page,
  }) => {
    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    await page.getByRole("tab", { name: "Additional Features" }).click();

    const featureCards = page.locator('[data-testid="edit-feature-button"]');
    const count = await featureCards.count();
    expect(count).toBeGreaterThan(0);

    await featureCards.first().click();

    await expect(page.getByTestId("feature-type-select")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("hebrew-match-input")).toBeVisible({ timeout: 5000 });
  });

  test("callback arrow function syntax preserved after localStorage round-trip", async ({
    page,
  }) => {
    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    await page.getByRole("tab", { name: "Additional Features" }).click();

    await page.locator('[data-testid="edit-feature-button"]').first().click();

    await expect(page.getByTestId("callback-editor")).toBeVisible({ timeout: 5000 });

    const callbackEditor = page.locator('[data-testid="callback-editor"]');
    const callbackCodeBefore = await callbackEditor.locator(".cm-content").textContent();

    expect(callbackCodeBefore).toContain("=>");
    expect(callbackCodeBefore).toContain("syllable");

    await page.keyboard.press("Escape");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await settingsBtn.click();

    await page.getByRole("tab", { name: "Additional Features" }).click();

    await page.locator('[data-testid="edit-feature-button"]').first().click();

    await expect(page.getByTestId("callback-editor")).toBeVisible({ timeout: 5000 });

    const callbackCodeAfter = await callbackEditor.locator(".cm-content").textContent();

    expect(callbackCodeAfter).toContain("=>");
    expect(callbackCodeAfter).toContain("syllable");
    expect(callbackCodeAfter).toBe(callbackCodeBefore);
  });

  test("modified callback executes correctly after localStorage round-trip", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    const openAdditionalFeatures = async () => {
      await page.getByTestId("settings-button").click();
      await page.getByRole("tab", { name: "Additional Features" }).click();
    };

    const openFeatureEditor = async (state: "add" | "edit") => {
      await openAdditionalFeatures();
      if (state === "add") {
        await page.getByTestId("add-feature-button").click();
      } else {
        // get the last editor, simulating the feature added before reload
        await page
          .getByTestId(/additional-feature-\d/)
          .last()
          .getByTestId("edit-feature-button")
          .click();
      }
      const editor = page.getByTestId("additional-feature-editor");
      await expect(editor).toBeVisible({ timeout: 1000 });
      await expect(editor).toHaveAttribute("data-formstate", state);
      return editor;
    };

    // add a new feature to ensure test works regardless of schema used
    const featureEditor = await openFeatureEditor("add");

    await featureEditor.getByTestId("feature-type-select").selectOption("cluster");
    await featureEditor.getByTestId("hebrew-match-input").fill("א");

    const callBackOption = featureEditor.locator(`button[data-value="callback"]`);
    await callBackOption.click();
    await expect(featureEditor.getByTestId("callback-editor")).toBeVisible({ timeout: 5000 });

    const callBackText =
      "(cluster, hebrew) => { return cluster.text.length > 0 ? 'PROCESSED' : cluster.text; }";

    // find the CodeMirror editor
    const codeMirror = featureEditor.locator(".cm-content");

    // make the editor active
    await codeMirror.click();

    // simulate a user entering a new function
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type(callBackText);

    // svelte-codemirror-editor debounces value updates by 300ms (handle_change).
    // The debounce must fire and update Svelte state before save reads form.callback_code.
    // This wait is necessary because programmatic CodeMirror edits bypass the normal
    // input event flow that would otherwise trigger the binding synchronously.
    // See: https://github.com/nicholasio/svelte-codemirror-editor
    await page.waitForTimeout(500);

    await featureEditor.getByTestId("save-button").click();

    await page.reload();
    await page.waitForLoadState("networkidle");

    const secondFeatureEditor = await openFeatureEditor("edit");
    await expect(secondFeatureEditor.locator(".cm-content")).toHaveText(callBackText);
  });

  test("regex features display correctly after localStorage round-trip", async ({ page }) => {
    async function verifyRegexText(stepName: string) {
      await test.step(`Verification: ${stepName}`, async () => {
        const settingsBtn = page.getByTestId("settings-button");
        await settingsBtn.click();
        await page.getByRole("tab", { name: "Additional Features" }).click();

        const hebrew = page.getByTestId("additional-feature-hebrew-0");

        expect(hebrew).not.toHaveText("[object Object]");
        expect(hebrew).not.toHaveText("object");

        expect(hebrew).toHaveText("/[\\u{05B4}\\u{05BB}]/u");
      });
    }

    await verifyRegexText("Initial Load");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await verifyRegexText("After Reload");

    await page.reload();
    await page.waitForLoadState("networkidle");

    // a bug was happening where an extra "\" was being added
    await verifyRegexText("2nd Reload");
  });
});
