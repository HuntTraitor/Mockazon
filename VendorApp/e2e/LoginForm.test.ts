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
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3003/vendor/login`
    );

    await page.waitForSelector('aria/login-link');
    await page.click('aria/login-link');

    await page.type('[aria-label="email-input"] input', 'htratar@ucsc.edu');
    await page.type('[aria-label="password-input"] input', 'pass');

    await page.click('aria/submit-request');
    await page.waitForNavigation();
    await page.waitForFunction(() => {
      const element = document.querySelector('body');
      return (
        element &&
        element.textContent &&
        element.textContent.includes('API Keys')
      );
    });
  });

  test('Unsuccessful Login', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3003/vendor/login`
    );

    await page.waitForSelector('aria/login-link');
    await page.click('aria/login-link');

    await page.type(
      '[aria-label="email-input"] input',
      'victorlasdfsadlkfasldkf@books.com'
    );
    await page.type('[aria-label="password-input"] input', 'asdfaslkfdjasdojf');

    await page.click('aria/submit-request');

    await page.waitForFunction(() => {
      const element = document.querySelector('body');
      return (
        element &&
        element.textContent &&
        element.textContent.includes('Login Unsuccessful, please try again!')
      );
    });
  });
});
