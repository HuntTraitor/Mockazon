import { screen } from '@testing-library/dom';
import puppeteer, { Browser, Page } from 'puppeteer';

describe('Vendor Signup', () => {
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

  test('Successful Signup', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3003/vendor/login`
    );

    await page.waitForSelector('[aria-label="name-input"] input');
    await page.type('[aria-label="name-input"] input', 'CSE187 Student');
    await page.type(
      '[aria-label="email-input"] input',
      'cse187student@vendor.com'
    );
    await page.type('[aria-label="password-input"] input', 'password');
    await page.type('[aria-label="repeatpassword-input"] input', 'password');

    await page.click('aria/submit-request');

    await page.waitForFunction(() => {
      const element = document.querySelector('body');
      return (
        element &&
        element.textContent &&
        element.textContent.includes('Successfully requested account!')
      );
    });
  });

  test('Unsuccessful Signup', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3003/vendor/login`
    );
    await page.waitForSelector('[aria-label="name-input"] input');
    await page.type('[aria-label="name-input"] input', 'CSE187 Student');
    await page.type(
      '[aria-label="email-input"] input',
      'cse187student@vendor.com'
    );
    await page.type('[aria-label="password-input"] input', 'a');
    await page.type('[aria-label="repeatpassword-input"] input', 'a');

    await page.click('aria/submit-request');

    await page.waitForFunction(() => {
      const element = document.querySelector('body');
      return (
        element &&
        element.textContent &&
        element.textContent.includes('Oops! Something went wrong')
      );
    });
  });
});
