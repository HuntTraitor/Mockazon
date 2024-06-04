import puppeteer, { Browser, Page } from 'puppeteer';
// import { getRandomEmail, signUp } from '../helpers';

describe('Next.js App', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    console.log(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('True is true', () => {
    expect(true).toBe(true);
  });

  // test("Navigate to home page and clicks on a what's new item", async () => {
  //   await signUp(page, 'Test User', 'password', getRandomEmail());
  //   await page.goto('http://localhost:3000');
  //   await page.waitForSelector('[aria-label^="Search Mockazon"]');
  //   await page.type('[aria-label^="Search Mockazon"]', 'Huel');
  //   await page.click('[aria-label^="Search Button"]');
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   await page.waitForSelector('[aria-label^="Add to cart button"]');
  //   await page.click('[aria-label^="Add to cart button"]');
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   await page.waitForSelector('[aria-label^="search-product"]');
  //   await page.click('[aria-label^="search-product"]');
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   await page.waitForSelector('[aria-label^="Quantity Selector"]');
  //   await page.click('[aria-label^="Quantity Selector"]');
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   await page.keyboard.press('ArrowDown');
  //   await page.keyboard.press('ArrowDown');
  //   await page.keyboard.press('ArrowDown');
  //   await page.keyboard.press('Enter');
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   await page.waitForSelector('[aria-label^="Add to cart button"]');
  //   await page.click('[aria-label^="Add to cart button"]');
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   await page.waitForSelector('[aria-label^="Cart Button"]');
  //   await page.click('[aria-label^="Cart Button"]');
  //   await page.waitForNavigation();
  //
  //   await page.waitForSelector('[aria-label^="Quantity Selector for"]');
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   const selectedValue = await page.evaluate(() => {
  //     const selectElement = document.querySelector(
  //       '[aria-label^="Quantity Selector for"]'
  //     ) as HTMLSelectElement;
  //     return selectElement.value;
  //   });
  //   expect(selectedValue).toBe('5');
  // });
});
