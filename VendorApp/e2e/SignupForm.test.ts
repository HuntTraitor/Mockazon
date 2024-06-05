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
    await page.goto('http://localhost:3003/login');
    const name = await page.$('aria/name-input[role=input]');
    const email = await page.$('aria/email-input[role=input]');
    const password = await page.$('aria/password-input[role=input]');
    const repeatPassword = await page.$(
      'aria/repeatpassword-input[role=input]'
    );

    if (name && email && password && repeatPassword) {
      await name.type('CSE187 Student');
      await email.type('cse187student@vendor.com');
      await password.type('password');
      await repeatPassword.type('password');

      await page.click('aria/submit-request');

      await page.waitForFunction(() => {
        const element = document.querySelector('body');
        return (
          element &&
          element.textContent &&
          element.textContent.includes('Successfully requested account!')
        );
      });
    }
  });

  test('Unsuccessful Signup', async () => {
    await page.goto('http://localhost:3003/login');
    const name = await page.$('aria/name-input[role=input]');
    const email = await page.$('aria/email-input[role=input]');
    const password = await page.$('aria/password-input[role=input]');
    const repeatPassword = await page.$(
      'aria/repeatpassword-input[role=input]'
    );

    if (name && email && password && repeatPassword) {
      await name.type('CSE187 Student');
      await email.type('cse187student@vendor.com');
      // Must be at least 6 characters
      await password.type('n');
      await repeatPassword.type('n');

      await page.click('aria/submit-request');

      await page.waitForFunction(() => {
        const element = document.querySelector('body');
        return (
          element &&
          element.textContent &&
          element.textContent.includes('Oops! Something went wrong, please try again')
        );
      });
    }
  });
});
