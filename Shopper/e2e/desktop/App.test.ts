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
