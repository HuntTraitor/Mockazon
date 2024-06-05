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
    // console.log(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Adding five items to cart and then checking out', async () => {
    await signUp(page, 'Test User', 'password', getRandomEmail());
    await page.goto('http://localhost:3000');
    await addFiveItemsToCart(page);
    await checkoutAndSeeSuccessPage(page);
  });
});
