import { screen } from '@testing-library/dom';
import puppeteer, { Browser, Page } from 'puppeteer';

// https://chatgpt.com/c/12e7b086-00e5-4d2c-94ab-7f07426eb8f4
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Vendor API Keys', () => {
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

  test('Keys Visible', async () => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3003/login`
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
        element.textContent.includes('API Key ID')
      );
    });
    await sleep(1000);
    const initKeyCount = await page.evaluate(() => {
      const element = document.querySelector('[aria-label="key-count"]');
      return element ? element.textContent : null;
    });
    await page.click('aria/add-key');
    await sleep(1000);
    const currKeyCount = await page.evaluate(() => {
      const element = document.querySelector('[aria-label="key-count"]');
      return element ? element.textContent : null;
    });
    expect(initKeyCount).not.toEqual(currKeyCount);
  });
});
