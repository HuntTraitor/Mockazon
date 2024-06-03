import puppeteer, { Browser, Page } from 'puppeteer';

describe('Next.js App', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });

  afterAll(async () => {
    // await browser.close();
  });

  test('Navigate to home page', async () => {
    await page.goto('http://localhost:3000');
  });

  // test('Clicking translate button', async () => {
  //   await page.goto('http://localhost:3000/products');

  //   await page.waitForSelector('a[aria-label^="product-link"]');
  //   await page.click('a[aria-label*="product-link"]');
  //   await page.waitForNavigation();

  //   await page.waitForSelector('a[aria-label*="translate-spanish"]');
  //   await page.click('a[aria-label*="translate-spanish"]');
  //   const selector = '[aria-label*="buy new"]';
  //   await page.waitForSelector(selector);
  //   const expectedTextEnglish = 'Comprar nuevo';
  //   await findByTextAndSelector(page, selector, expectedTextEnglish);

  //   await page.click('a[aria-label*="translate"]');

  //   const expectedText = 'Buy new';
  //   await findByTextAndSelector(page, selector, expectedText);
  // });
});
