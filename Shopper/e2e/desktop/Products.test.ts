import puppeteer, { Browser, Page } from 'puppeteer';

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
    await page.goto(`http://${process.env.MICROSERVICE_URL || 'localhost'}:3000`);
  });

  // test('Clicking translate button', async () => {
  //   await page.goto('http://localhost:3000/products');

  //   await page.click('a[aria-label*="translate-spanish"]');

  //   const selector = '[aria-label*="delivery"]';
  //   await page.waitForSelector(selector);
  //   const expectedTextEnglish = 'Entregar a';
  //   await findByTextAndSelector(page, selector, expectedTextEnglish);

  //   await page.click('a[aria-label*="translate"]');

  //   const expectedText = 'Deliver to';
  //   await findByTextAndSelector(page, selector, expectedText);
  // });
});
