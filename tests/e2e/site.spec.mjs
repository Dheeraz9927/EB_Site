import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/auto-insurance/', '/home-insurance/', '/commercial-insurance/', '/privacy/', '/404.html'];

for (const path of pages) {
  test(`${path} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`)).toEqual([]);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('contact details link to phone and email', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('#contact');
  await expect(contact.locator('a[href="tel:+16479172693"]').first()).toBeVisible();
  await expect(contact.locator('a[href="mailto:aayush.khatri@unibrokers.ca"]').first()).toBeVisible();
  await expect(contact).toContainText('Monday to Friday, 9 am – 7 pm');
});

test('coverage tabs follow the ARIA tabs keyboard pattern', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(page.locator('#coverage-panel-home')).toBeVisible();
  await expect(page.locator('#coverage-panel-auto')).toBeHidden();
  await page.keyboard.press('End');
  await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
});

test('planner tracks readiness on screen and offers call and email, with no download', async ({ page }) => {
  let downloaded = false;
  page.on('download', () => { downloaded = true; });
  await page.goto('/');
  const trigger = page.locator('.closing [data-open-planner]');
  await trigger.click();
  const dialog = page.locator('#planner');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('My home').check();
  await dialog.getByLabel('My business').check();
  const items = dialog.locator('#checklist input[type="checkbox"]');
  await expect(items).toHaveCount(8);
  await items.nth(0).check();
  await items.nth(5).check();
  await expect(dialog.locator('#planner-progress')).toHaveText('2 of 8 ready');
  await expect(dialog.getByRole('link', { name: /Call \+1 647-917-2693/ })).toHaveAttribute('href', 'tel:+16479172693');
  const href = await dialog.locator('#planner-email').getAttribute('href');
  const url = new URL(href);
  expect(url.protocol).toBe('mailto:');
  expect(url.pathname).toBe('aayush.khatri@unibrokers.ca');
  expect(url.searchParams.get('subject')).toBe('Coverage conversation: Home insurance, Commercial insurance');
  const body = url.searchParams.get('body');
  expect(body).toContain('✓ Current policy and renewal date, if applicable');
  expect(body).toContain('✓ Business locations, equipment and property details');
  expect(body).not.toContain('Property details, renovations and occupancy');
  // Unticking an item removes it from the draft straight away.
  await items.nth(5).uncheck();
  const updated = new URL(await dialog.locator('#planner-email').getAttribute('href')).searchParams.get('body');
  expect(updated).not.toContain('Business locations, equipment and property details');
  await items.nth(5).check();
  // Ticks survive unchecking and rechecking a category while the page is open.
  await dialog.getByLabel('My home').uncheck();
  await dialog.getByLabel('My home').check();
  await expect(dialog.locator('#planner-progress')).toHaveText('2 of 8 ready');
  await expect(dialog.getByRole('button', { name: /save/i })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(downloaded).toBe(false);
});

test('coverage tab button preselects its category in the planner', async ({ page }) => {
  await page.goto('/');
  await page.locator('#coverage-panel-auto [data-open-planner="auto"]').click();
  await expect(page.locator('#planner').getByLabel('My car')).toBeChecked();
  await expect(page.locator('#planner').getByLabel('My home')).not.toBeChecked();
});

test('mobile menu opens, closes with Escape and restores focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Menu button only appears on small screens');
  await page.goto('/');
  const button = page.locator('.menu-button');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
});

test('coverage pages link back to the home page sections', async ({ page }) => {
  await page.goto('/home-insurance/');
  await expect(page).toHaveTitle(/Home, condo and tenant insurance/);
  await expect(page.locator('#nav a[href="/#team"]')).toHaveCount(1);
  await expect(page.locator('#contact')).toContainText('+1 647-917-2693');
  await page.locator('[data-open-planner="home"]').click();
  await expect(page.locator('#planner').getByLabel('My home')).toBeChecked();
});
