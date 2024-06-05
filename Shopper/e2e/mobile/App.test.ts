import puppeteer, { Browser, Page } from 'puppeteer';

describe('Next.js App', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    );
    await page.setViewport({ width: 375, height: 667 });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Navigate to home page', async () => {
    await page.goto('http://localhost:3000');
  });

  // test('Clicking translate button', async () => {
  //   await page.goto('http://localhost:3000/login');

  //   await page.click('a[aria-label="translate-spanish"]');

  //   const selector = '[aria-label="title"]';
  //   const expectedText = 'Bienvenido a mockazon';
  //   await findByTextAndSelector(page, selector, expectedText);

  //   await page.click('a[aria-label="translate-english"]');

  //   const expectedTextEnglish = 'Welcome to Mockazon';
  //   await findByTextAndSelector(page, selector, expectedTextEnglish);
  // });
});
