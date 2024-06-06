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
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    );
    await page.setViewport({ width: 375, height: 667 });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Adding five items to cart and then checking out', async () => {
    await signUp(page, 'Test User', 'password', getRandomEmail());
    await page.goto(`http://${process.env.MICROSERVICE_URL || 'localhost'}:3000`);
    await addFiveItemsToCart(page, true);
    await checkoutAndSeeSuccessPage(page);
  });
});
