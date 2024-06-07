import puppeteer, { Browser, Page } from 'puppeteer';
import {
  addFiveItemsToCart,
  checkoutAndSeeSuccessPage,
  getRandomEmail,
  signUp,
} from '../helpers';

describe('Next.js App', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    // console.log(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('True is true', () => {
    expect(true).toBe(true);
  });

  test('Adding five items to cart', async () => {
    await signUp(page, 'Test User', 'password', getRandomEmail());
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3000`
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
    await addFiveItemsToCart(page);

    // await checkoutAndSeeSuccessPage(page);
  });
});
