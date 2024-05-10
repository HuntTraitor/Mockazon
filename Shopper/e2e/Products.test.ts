import puppeteer, { Browser, Page } from 'puppeteer';
import { findByTextAndSelector } from './helpers';

describe('Next.js App', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Clicking translate button', async () => {
    await page.goto('http://localhost:3000/products');

    await page.click('a[aria-label*="translate-spanish"]');

    const selector = '[aria-label*="delivery"]';
    await page.waitForSelector(selector);
    const expectedTextEnglish = 'Entregar a';
    await findByTextAndSelector(page, selector, expectedTextEnglish);

    await page.click('a[aria-label*="translate"]');

    const expectedText = 'Deliver to';
    await findByTextAndSelector(page, selector, expectedText);
  });
});
