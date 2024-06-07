import puppeteer, { Browser, Page } from 'puppeteer';
import { findByTextAndSelector } from '../helpers';

describe('Next.js App', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Navigate to home page', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3000`
    );
  });

  test('Clicking translate button', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3000`
    );
    await page.click('[aria-label="Language Text"]');
    await page.click('[aria-label="Translate to Spanish"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const selector = 'body';
    const expectedText = '¿Qué hay de nuevo?';
    await findByTextAndSelector(page, selector, expectedText);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('[aria-label="Language Text"]');
    await page.click('[aria-label="Translate to English"]');
    const expectedTextEnglish = "What's New";
    await findByTextAndSelector(page, 'body', expectedTextEnglish);
  });
});
