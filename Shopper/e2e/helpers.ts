import { Page } from 'puppeteer';
import { randomUUID } from 'crypto';

export async function findByTextAndSelector(
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

export async function signUp(
  page: Page,
  name: string,
  password: string,
  email: string
) {
  await page.goto('http://localhost:3000/signup');
  await page.waitForSelector('form');

  await page.type('div[aria-label="Name"] input', name);
  await page.type('div[aria-label="Email"] input', email);
  await page.type('div[aria-label="Password"] input', password);
  await page.type('div[aria-label="Re-enter password"] input', password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
}

export function getRandomEmail() {
  return `${randomUUID()}@test.com`;
}

export async function addFiveItemsToCart(page: Page) {
  await page.waitForSelector('[aria-label^="Search Mockazon"]');
  await page.type('[aria-label^="Search Mockazon"]', 'Huel');
  await page.click('[aria-label^="Search Button"]');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.waitForSelector('[aria-label^="Add to cart button"]');
  await page.click('[aria-label^="Add to cart button"]');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.waitForSelector('[aria-label^="search-product"]');
  await page.click('[aria-label^="search-product"]');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.waitForSelector('[aria-label^="Quantity Selector"]');
  await page.click('[aria-label^="Quantity Selector"]');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.waitForSelector('[aria-label^="Add to cart button"]');
  await page.click('[aria-label^="Add to cart button"]');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.waitForSelector('[aria-label^="Cart Button"]');
  await page.click('[aria-label^="Cart Button"]');
  // await page.waitForNavigation();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.waitForSelector('[aria-label^="Quantity Selector for"]');
  await new Promise(resolve => setTimeout(resolve, 1000));

  const selectedValue = await page.evaluate(() => {
    const selectElement = document.querySelector(
      '[aria-label^="Quantity Selector for"]'
    ) as HTMLSelectElement;
    return selectElement.value;
  });
  expect(selectedValue).toBe('5');
}

export async function checkoutAndSeeSuccessPage(page: Page) {
  await page.click('[aria-label="Proceed to Checkout"]');
  await page.waitForSelector('#email');
  await page.type('#email', getRandomEmail());
  await page.type('input[aria-label="Card number"]', '4242424242424242');
  await page.type('input[aria-label="Expiration"]', '03/33');
  await page.type('input[aria-label="CVC"]', '333');
  await page.type('#billingName', 'John Madden');
  await page.type('input[aria-label="ZIP"]', '95060');
  await page.type('input[aria-label="Phone number"]', '8053414820');
  await page.click('[data-testid="hosted-payment-submit-button"]');
  await page.waitForNavigation();
  await page.waitForSelector('[aria-label="Payment Successful"]');
}
