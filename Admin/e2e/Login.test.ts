import { waitFor } from '@testing-library/dom';
import puppeteer, { Browser, Page } from 'puppeteer';

describe('Admin Login Tests', () => {
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
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3001/admin`
    );
    await page.type('aria/Email Address[role="textbox"]', 'htratar@ucsc.edu');
    await page.type('aria/Password[role="textbox"]', 'pass');
    await page.click('aria/login-button[role="button"]');
    await page.waitForFunction(() => {
      const element = document.querySelector('body');
      return (
        element && element.textContent && element.textContent.includes('Role')
      );
    });
    await page.click('aria/sign-out[role="button"]');
  });

  test('Unsuccessful Login', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3001/admin`
    );

    await page.type('aria/Email Address[role="textbox"]', 'htratar@ucsc.edu');
    await page.type('aria/Password[role="textbox"]', 'asdfakdjfadf');
    let alertMessage = '';
    const dialogPromise = new Promise<void>(resolve => {
      page.on('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
        resolve();
      });
    });
    await page.click('aria/login-button[role="button"]');
    await dialogPromise;
    expect(alertMessage).toEqual('Error logging in. Please try again.');
  });
});
