import { Page } from 'puppeteer';
import {randomUUID} from "crypto";

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

export async function signUp(page: Page, name: string, password: string, email: string) {
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
