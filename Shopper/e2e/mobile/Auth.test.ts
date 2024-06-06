import puppeteer, { Browser, Page } from 'puppeteer';
import { getRandomEmail, signUp } from '../helpers';

const email = getRandomEmail();
describe('Auth', () => {
  let browser: Browser;
  let page: Page;

  /* https://stackoverflow.com/questions/58887985/how-to-test-an-alert-displaying-using-jest-puppeteer */
  const dialogHandler = jest.fn(dialog => dialog.dismiss());

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    page.on('dialog', dialogHandler);
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    );
    await page.setViewport({ width: 375, height: 667 });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    dialogHandler.mockClear();
  });

  test('Fails to log in with invalid credentials', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3000/login`
    );
    await page.waitForSelector('form');

    await page.type('div[aria-label="Email"] input', email);
    await page.type('div[aria-label="Password"] input', 'password');
    await page.click('button[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(dialogHandler).toHaveBeenCalled();
  });

  test('Fails to create account with missing fields', async () => {
    await page.waitForSelector('form');

    await page.click('button[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(dialogHandler).toHaveBeenCalled();
  });

  test('Creates a new account', async () => {
    await signUp(page, 'Test User', 'password', email);
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('Fails to create duplicate account', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3000/signup`
    );
    await page.waitForSelector('form');

    await page.type('div[aria-label="Name"] input', 'Test User');
    await page.type('div[aria-label="Email"] input', email);
    await page.type('div[aria-label="Password"] input', 'password');
    await page.type('div[aria-label="Re-enter password"] input', 'password');
    await page.click('button[type="submit"]');

    // wait half a second
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(dialogHandler).toHaveBeenCalled();
  });

  test('Logs in with valid credentials', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3000/login`
    );
    await page.waitForSelector('form');

    await page.type('div[aria-label="Email"] input', email);
    await page.type('div[aria-label="Password"] input', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    expect(page.url()).toBe(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3000/`
    );
    expect(dialogHandler).not.toHaveBeenCalled();
  });
});
