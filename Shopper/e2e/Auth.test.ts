import puppeteer, { Browser, Page } from 'puppeteer';
import { randomUUID } from 'crypto';

const randomEmail = `${randomUUID()}@test.com`;

describe('Auth', () => {
  // set timeout to 10 seconds
  jest.setTimeout(20000);
  let browser: Browser;
  let page: Page;

  /* https://stackoverflow.com/questions/58887985/how-to-test-an-alert-displaying-using-jest-puppeteer */
  const dialogHandler = jest.fn(dialog => dialog.dismiss());

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    page.on('dialog', dialogHandler);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    dialogHandler.mockClear();
  });

  test('Fails to log in with invalid credentials', async () => {
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('form');

    await page.type('div[aria-label="Email"] input', randomEmail);
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
    await page.goto('http://localhost:3000/signup');
    await page.waitForSelector('form');

    await page.type('div[aria-label="Name"] input', 'Test User');
    await page.type('div[aria-label="Email"] input', randomEmail);
    await page.type('div[aria-label="Password"] input', 'password');
    await page.type('div[aria-label="Re-enter password"] input', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('Fails to create duplicate account', async () => {
    await page.goto('http://localhost:3000/signup');
    await page.waitForSelector('form');

    await page.type('div[aria-label="Name"] input', 'Test User');
    await page.type('div[aria-label="Email"] input', randomEmail);
    await page.type('div[aria-label="Password"] input', 'password');
    await page.type('div[aria-label="Re-enter password"] input', 'password');
    await page.click('button[type="submit"]');

    // wait half a second
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(dialogHandler).toHaveBeenCalled();
  });

  test('Logs in with valid credentials', async () => {
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('form');

    await page.type('div[aria-label="Email"] input', randomEmail);
    await page.type('div[aria-label="Password"] input', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    expect(page.url()).toBe('http://localhost:3000/');
    expect(dialogHandler).not.toHaveBeenCalled();
  });

  // FIXME: E2E tests for google oauth, shouldn't implement?
});
