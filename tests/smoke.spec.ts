import { expect, test, type Page } from "@playwright/test";

const SECTIONS = ["about", "experience", "projects", "transfer", "cabinet", "life", "contact"];
const RESUMES = ["Nakul_Jadeja_Resume_Fintech.pdf", "Nakul_Jadeja_Resume_General.pdf"];

function watchForErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

test("every section renders with no console errors", async ({ page }) => {
  const errors = watchForErrors(page);
  await page.goto("/");
  for (const id of SECTIONS) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("the page never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("the résumés download", async ({ request }) => {
  for (const file of RESUMES) {
    const response = await request.get(`/resumes/${file}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  }
});

test("the command box answers, misses, and flips the résumé picker", async ({ page }) => {
  await page.goto("/");
  // The button only responds once React has hydrated, which takes a moment under a loaded test run.
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /ask/i }).click();
  const input = page.getByRole("textbox", { name: "Ask my pipeline" });
  await input.fill("constructor");
  await input.press("Enter");
  await expect(page.getByText("No rows matched. Try help.")).toBeVisible();
  await input.fill("fintech");
  await input.press("Enter");
  await expect(page.getByText(/Python rules decide what gets through/)).toBeVisible();
  await expect(page.getByRole("radio", { name: /fintech/i })).toBeChecked();
});

test("the transfer window signs three players, then closes", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const section = page.locator("#transfer");
  const problem = (name: RegExp) => section.getByRole("button", { name });
  const resume = section.getByRole("link", { name: /résumé/i });
  await expect(resume).toHaveCount(0);

  await problem(/Deploys take forever/).click();
  await expect(section.getByText("82%")).toBeVisible();
  await expect(resume).toHaveAttribute("href", /General/);

  await problem(/letting AI near the money/).click();
  await expect(resume).toHaveAttribute("href", /Fintech/);
  // The contact section's picker follows, so the two résumé choices agree.
  await expect(page.getByRole("radio", { name: /fintech/i })).toBeChecked();

  await problem(/Operations run on guesswork/).click();
  await expect(section.getByText("Open slot")).toHaveCount(0);

  // A fourth pick does nothing but explain itself, and dropping a player reopens the slot.
  await problem(/Nobody opens our reports/).click({ force: true });
  // Scoped to the team sheet, because the full kit list below the picker names Power BI too.
  await expect(section.locator("ol").getByText("Power BI")).toHaveCount(0);
  await expect(section.getByText(/Budget's gone/)).toBeVisible();
  await problem(/Deploys take forever/).click();
  await expect(section.getByText("Open slot")).toHaveCount(1);
  await expect(section.getByText(/Budget's gone/)).toHaveCount(0);
});

test("the trophy cabinet links out to verify, and hides empty shelves", async ({ page }) => {
  await page.goto("/#cabinet");
  const section = page.locator("#cabinet");
  await expect(section.getByRole("link", { name: /Verify IBM Data Engineering/ })).toHaveAttribute(
    "href",
    /coursera\.org\/verify\/professional-cert\//,
  );
  await expect(section.getByText("Co-curricular")).toHaveCount(0);
});

test("the match card stays hidden without a key, and the API still says 200", async ({ page, request }) => {
  const response = await request.get("/api/matchday");
  expect(response.status()).toBe(200);
  await page.goto("/#life");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Next match")).toHaveCount(0);
});

test("a fixture from the API shows up as a card", async ({ page }) => {
  await page.route("**/api/matchday", (route) =>
    route.fulfill({
      json: {
        match: {
          home: "Real Madrid",
          away: "Test FC",
          competition: "Test League",
          kickoff: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          venue: null,
          state: "upcoming",
          score: null,
        },
      },
    }),
  );
  await page.goto("/#life");
  await expect(page.getByText("Test FC")).toBeVisible();
  await expect(page.getByText(/T−\d+d/)).toBeVisible();
});

const CASE_STUDIES = ["valorant-copilot", "orblex-industries", "rocathon-search"];

test("every project card opens its case study, with no errors and no sideways scroll", async ({ page }) => {
  const errors = watchForErrors(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const links = page.locator("#projects").getByRole("link", { name: /case study/ });
  await expect(links).toHaveCount(CASE_STUDIES.length);
  for (const slug of CASE_STUDIES) {
    await page.goto(`/projects/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "How it works" })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  }
  expect(errors).toEqual([]);
});

test("an unknown case study is a 404", async ({ request }) => {
  const response = await request.get("/projects/not-a-project");
  expect(response.status()).toBe(404);
});

test("the sample page doesn't exist in production", async ({ request }) => {
  const response = await request.get("/dev/off-the-pitch");
  expect(response.status()).toBe(404);
  expect(await response.text()).not.toContain("Sample FC");
});

test("the animation engine loads and sections fade in", async ({ page }) => {
  await page.goto("/");
  const firstCard = page.locator("#projects article").first();
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard).toHaveCSS("opacity", "1");
  await expect(firstCard.locator(".nl-score")).toHaveText(/\S/);
});

test("section links land on their section, even ones not laid out yet", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  if (testInfo.project.name === "phone") {
    await page.getByRole("button", { name: /Open section menu/ }).click();
  }
  await page.getByRole("link", { name: "Off the pitch" }).click();
  await expect
    .poll(() => page.locator("#life").evaluate((section) => Math.round(section.getBoundingClientRect().top)))
    .toBeLessThan(200);
  await expect(page.locator("#life h2")).toBeInViewport();
});

test("the scorebug says About at the top of the page", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator('nav[aria-label="Sections"] [aria-current="true"]')).toHaveText("About");
});

test("the custom cursor turns on for a mouse only",async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.mouse.move(300, 300);
  await page.mouse.move(320, 320);
  const expected = testInfo.project.name === "phone" ? 0 : 1;
  await expect(page.locator("html.nl-cursor")).toHaveCount(expected);
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("nothing starts hidden, and the custom cursor stays off", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.mouse.move(300, 300);
    await expect(page.locator("html")).not.toHaveClass(/nl-cursor/);
    // No scrolling first: everything has to be there without an entrance animation.
    // Radio inputs are invisible on purpose, laid over the résumé picker's labels.
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("main *:not(input)")]
        .filter((element) => getComputedStyle(element).opacity === "0")
        .map((element) => element.tagName + "." + element.className),
    );
    expect(hidden).toEqual([]);
  });

  test("the ticker and the pulse stand still", async ({ page }) => {
    await page.goto("/");
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === "running")
        .map((animation) => (animation as CSSAnimation).animationName ?? "transition"),
    );
    expect(running).toEqual([]);
  });
});
