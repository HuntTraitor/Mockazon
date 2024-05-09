import puppeteer, { Browser, Page } from 'puppeteer';

describe('Next.js App', () => {
  let browser: Browser;
  let page: Page;
  /**
   * Create a headless (not visible) instance of Chrome for each test
   * and open a new page (tab).
   */
  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: true,
    });
    page = await browser.newPage();
  });

  /**
   * Shotdown the API server then the Web server.
   */
  afterAll(async () => {
    await browser.close();
  });

  /**
   * Close the headless instance of Chrome as we no longer need it.
   */
  afterEach(async () => {
    await browser.close();
  });

  test('Successful Login', async () => {
    await page.goto('http://localhost:3001');
  });
});
