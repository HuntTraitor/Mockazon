import puppeteer, { Browser, Page } from 'puppeteer';
import { findByTextAndSelector } from './helpers';

describe('Shopping cart', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Adding a product to the shopping cart', async () => {
    await page.goto('http://localhost:3000/login');

    await page.click('a[aria-label="translate-spanish"]');

    const selector = '[aria-label="title"]';
    const expectedText = 'Bienvenido a mockazon';
    await findByTextAndSelector(page, selector, expectedText);

    await page.click('a[aria-label="translate-english"]');

    const expectedTextEnglish = 'Welcome to Mockazon';
    await findByTextAndSelector(page, selector, expectedTextEnglish);
  });
});
