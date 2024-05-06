import puppeteer, { Browser, Page } from 'puppeteer';

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

  test('Navigate to home page', async () => {
    await page.goto('http://localhost:3000');
  });

  test('Clicking translate button', async () => {
    await page.goto('http://localhost:3000');

    await page.click('a[aria-label="translate"]');

    const selector = '[aria-label="title"]';
    const expectedText = 'Bienvenido a mockazon';

    await page.waitForSelector(selector);
    await page.waitForFunction(
      (selector, expectedText) => {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
          return element.textContent.includes(expectedText);
        }
        return false;
      },
      {},
      selector,
      expectedText
    );

    await page.click('a[aria-label="translate"]');

    const expectedTextEnglish = 'Welcome to Mockazon';

    await page.waitForSelector(selector);
    await page.waitForFunction(
      (selector, expectedTextEnglish) => {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
          return element.textContent.includes(expectedTextEnglish);
        }
        return false;
      },
      {},
      selector,
      expectedTextEnglish
    );
  });
});
