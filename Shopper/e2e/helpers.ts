import { Page } from 'puppeteer';

async function findByTextAndSelector(
  page: Page,
  selector: string,
  expectedText: string
) {
  await page.waitForSelector(selector);
  await page.waitForFunction(
    (selector, expectedText) => {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        return element.textContent.includes(expectedText);
      }
      return false;
    },
    {},
    selector,
    expectedText
  );
}

export { findByTextAndSelector };
