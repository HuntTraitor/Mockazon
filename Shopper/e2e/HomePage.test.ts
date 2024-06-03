import puppeteer, { Browser, Page } from 'puppeteer';
import { getRandomEmail, signUp } from './helpers';

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

  test("Navigate to home page and clicks on a what's new item", async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[aria-label^="What\'s New-"]');
    await page.click('[aria-label^="What\'s New-"]');
    await page.waitForNavigation();
  });

  test("Navigate to home page and clicks right arrow on what's new then clicks on a what's new item", async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-testid="ArrowForwardIosIcon"]');
    await page.click('[data-testid="ArrowForwardIosIcon"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('[aria-label^="What\'s New-"]');
    await page.click('[aria-label^="What\'s New-"]');
    await page.waitForNavigation();
  });

  test('Navigate to home page and clicks on more products', async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[aria-label^="More Products-"]');
    await page.click('[aria-label^="More Products-"]');
    await page.waitForNavigation();
  });

  test('Navigate to home page and add a more products item to cart', async () => {
    await signUp(page, 'Test User', 'password', getRandomEmail());
    await page.waitForSelector('[aria-label^="Add to cart button"]');
    await page.click('[aria-label^="Add to cart button"]');
  });

  test('Navigate to home page and clicks next page on more products then clicks on a product', async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-testid="NavigateNextIcon"]');
    await page.click('[data-testid="NavigateNextIcon"]');
    // wait a second
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('[aria-label^="More Products-"]');
    await page.click('[aria-label^="More Products-"]');
    await page.waitForNavigation();
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
