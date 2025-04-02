import { expect, test } from "@playwright/test";

test("home page has expected h1 and returns 200", async ({ page }) => {
	const response = await page.goto("/");
	expect(response?.status()).toBe(200);
	await expect(page.locator("h1")).toBeVisible();
});

test("line-up page returns 200", async ({ page }) => {
	const response = await page.goto("/kadro");
	expect(response?.status()).toBe(200);
});

test("erkut page returns 404", async ({ page }) => {
	const response = await page.goto("/erkut");
	expect(response?.status()).toBe(404);
});
