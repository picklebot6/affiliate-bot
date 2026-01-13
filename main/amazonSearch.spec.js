// @ts-check
import { test, expect } from '@playwright/test';
import * as s from '../helpers/selectors.page'

// define env vars
let percentThreshold = 25

test('amazon afil bot', async ({ page }) => {
  // launch amazon
  await page.goto('https://amazon.com');
  await expect(page).toHaveTitle(/Amazon/);
  await page.waitForTimeout(5000)

  // go to today's deals
  await page.locator(s.todaysDeals).waitFor();
  await page.locator(s.todaysDeals).click();
  await page.locator(s.department).waitFor({timeout: 10000})

  // get info for top 3 deals that are above 25%
  let counter = 1;
  let deals = []

  while (await page.locator(s.percentOff(counter)).count() > 0) {
    // initiate deals object
    let productInfo = {}
    // find current deal
    let percentText = await page.$eval(s.percentOff(counter), el => el.textContent)
    console.log(percentText)
    // extract just number
    if (percentText) {
      const match = percentText.match(/(\d+)%\s*off/i);
      if (match) {
        productInfo.deal = match ? Number(match[1]) : null;
      }
    }

    // add to deals if deal is greater than threshold
    if (productInfo["deal"] >= percentThreshold) {
      // assign item name
      productInfo.name = await page.$eval(s.itemName(counter), el => el.textContent)
      deals.push(productInfo)
    }

    counter++

    // if 3 deals have been found, break
    if (deals.length >= 3) {
      break;
    }


  }

  console.log(deals)



  await page.pause()

});
