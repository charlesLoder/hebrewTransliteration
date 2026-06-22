import { expect, test } from "@playwright/test";

test.describe("/remove", () => {
  test("on_compolete: toggle enables editor, persists after reload, can be disabled", async ({
    page,
  }) => {
    await page.goto("/remove", { waitUntil: "networkidle" });

    const settingsBtn = page.getByTestId("settings-button");
    await settingsBtn.click();

    await page.getByRole("tab", { name: "On Complete" }).click();

    await page.getByTestId("enable-on-complete").click();

    await expect(page.getByTestId("on-complete-editor")).toBeVisible();

    const cm = page.getByTestId("on-complete-editor").locator(".cm-content");

    await cm.click();

    const cbText = "(result, context) => { return result.trim(); }";
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type(cbText);

    // svelte-codemirror-editor debounces value updates by 300ms (handle_change).
    // The debounce must fire and update Svelte state before save reads form.callback_code.
    // This wait is necessary because programmatic CodeMirror edits bypass the normal
    // input event flow that would otherwise trigger the binding synchronously.
    // See: https://github.com/nicholasio/svelte-codemirror-editor
    await page.waitForTimeout(500);

    await page.reload({ waitUntil: "networkidle" });

    await page.getByTestId("settings-button").click();

    await page.getByRole("tab", { name: "On Complete" }).click();

    await expect(page.getByTestId("on-complete-editor")).toBeVisible({ timeout: 5000 });

    const cm2 = page.getByTestId("on-complete-editor").locator(".cm-content");
    await expect(cm2).toContainText("result.trim()");

    await page.getByTestId("enable-on-complete").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("on-complete-editor")).not.toBeVisible();
  });
});
