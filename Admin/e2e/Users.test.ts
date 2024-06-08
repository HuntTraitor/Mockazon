import puppeteer, { Browser, Page } from 'puppeteer';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Admin List of Users Test', () => {
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

  test('Users List in Admin Home Page', async () => {
    // Sign in
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
    await sleep(1000);
    await page.waitForFunction(() => {
      const element = document.querySelector('body');
      // Can view one of the users
      return (
        element &&
        element.textContent &&
        element.textContent.includes('shopper') &&
        element.textContent.includes('Evan Metcalf')
      );
    });
  });

  test('Admin rejects a new user request', async() => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3001`
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
    await sleep(1000);
    
    await page.click('aria/Requests Tab');
    await page.waitForSelector('[aria-label^="reject-request-"]')
    await page.click('[aria-label^="reject-request-"]');
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3003`
    );
    await page.waitForSelector('aria/login-link');
    await page.click('aria/login-link');

    await page.type('[aria-label="email-input"] input', 'request@ucsc.edu');
    await page.type('[aria-label="password-input"] input', 'pass');

    await page.click('aria/submit-request');
    await page.waitForNavigation();
  });

  test('Admin approves a new request', async() => {
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3001`
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
    await sleep(1000);
    
    await page.click('aria/Requests Tab');
    await page.waitForSelector('[aria-label^="approve-request-"]')
    await page.click('[aria-label^="approve-request-"]')
    await page.goto(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3003`
    );
    await page.waitForSelector('aria/login-link');
    await page.click('aria/login-link');

    await page.type('[aria-label="email-input"] input', 'request2@ucsc.edu');
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
  })
});
