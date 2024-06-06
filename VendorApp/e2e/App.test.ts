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
    await page.goto(`http://${process.env.MICROSERVICE_URL || 'localhost'}:3003`);
  });
});
