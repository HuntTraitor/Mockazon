import { waitFor } from '@testing-library/dom';
import puppeteer, { Browser, Page } from 'puppeteer';

describe('Next.js App', () => {
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
    await page.goto('http://localhost:3001');
    const email = await page.$('aria/Email Address[role="textbox"]');
    const password = await page.$('aria/Password[role="textbox"]');
    if (email && password) {
      await email.type('elkrishn@ucsc.edu');
      await password.type('elk');
      await page.click('aria/login-button[role="button"]');

      await waitFor(() => {
        const element = document.querySelector('body');
        return (element &&
        element.textContent &&
        element.textContent.includes('Settings'));
      });
    }
  });

  test('Unsuccessful Login', async () => {
    await page.goto('http://localhost:3001');
    const email = await page.$('aria/Email Address[role="textbox"]');
    const password = await page.$('aria/Password[role="textbox"]');
    if (email && password) {
      await email.type('bob@ucsc.edu');
      await password.type('elkdfasdfadsf');
      await page.click('aria/login-button[role="button"]');
      let alertMessage = '';
      /* */
      const dialogPromise = new Promise<void>((resolve) => {
        page.on('dialog', async (dialog) => {
          alertMessage = dialog.message();
          await dialog.accept();
          resolve();
        });
      });
      await page.click('aria/login-button[role="button"]');
      await dialogPromise;
      expect(alertMessage).toEqual('Error logging in. Please try again.');
    }
  });
});

