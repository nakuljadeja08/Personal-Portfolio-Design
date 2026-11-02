import { expect, test } from "@playwright/test";

// Baselines are rendered per OS, so these only run where they were recorded. CI runs the smoke tests.
test.skip(Boolean(process.env.CI), "Screenshot baselines are local to one machine");
test.use({ contextOptions: { reducedMotion: "reduce" } });

const SECTIONS = ["skills", "transfer", "experience", "projects", "life", "contact"];

test("first viewport", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  // The portrait has to finish decoding, or it's a coin flip whether it's in the picture.
  await page.getByRole("img", { name: /Nakul in Madrid/ }).evaluate((image: HTMLImageElement) => image.decode());
  await expect(page).toHaveScreenshot("first-viewport.png", { maxDiffPixelRatio: 0.01 });
});

for (const id of SECTIONS) {
  test(`section ${id}`, async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    // These float over the page and land somewhere different each scroll. The first viewport covers them.
    await page.getByRole("button", { name: /ask/i }).evaluate((ask) => (ask.style.visibility = "hidden"));
    await page.addStyleTag({ content: 'nav[aria-label="Sections"] { visibility: hidden !important; }' });
    await expect(section).toHaveScreenshot(`${id}.png`, {
      maxDiffPixelRatio: 0.01,
      // Training numbers change every night, so they can't be part of a baseline.
      mask: [page.locator("#life article")],
    });
  });
}
