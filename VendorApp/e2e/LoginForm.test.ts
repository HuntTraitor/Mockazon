import { screen } from '@testing-library/dom';
import puppeteer, { Browser, Page } from 'puppeteer';

describe('Vendor Login', () => {
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

  test('Successful Login', async () => {
    await page.goto('http://localhost:3003/login');
    await page.click('aria/login-link[role="link"]');
    const email = await page.$('aria/email-input[role=input]');
    const password = await page.$('aria/password-input[role=input]');

    if (email && password) {
      await email.type('victor@books.com');
      await password.type('victorvendor');

      await page.click('aria/submit-request[role="button"]');
      await page.waitForFunction(() => {
        const element = document.querySelector('body');
        return (
          element &&
          element.textContent &&
          element.textContent.includes('API Keys')
        );
      });
    }
  });

  test('Unsuccessful Login', async () => {
    await page.goto('http://localhost:3003/login');
    await page.click('aria/login-link[role="link"]');
    const email = await page.$('aria/email-input[role=input]');
    const password = await page.$('aria/password-input[role=input]');

    if (email && password) {
      await email.type('asdfasdfasdf@books.com');
      await password.type('a');

      await page.click('aria/submit-request[role="button"]');
      await page.waitForFunction(() => {
        const element = document.querySelector('body');
        return (
          element &&
          element.textContent &&
          element.textContent.includes('Login Unsuccessful, please try again!')
        );
      });
    }
  });
});
