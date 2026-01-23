// @ts-check
import { test, expect } from '@playwright/test';
import * as s from '../helpers/selectors.page'
import * as telegram from '../helpers/telegram.page'
import * as f from '../helpers/functions.page'
import "dotenv/config";

// define env vars
let percentThreshold = 25

// test.use({
//   viewport: { width: 1920, height: 1080 },
// });

test('amazon afil bot', async ({ page }) => {
  // launch amazon
  await page.goto('https://amazon.com');
  await expect(page).toHaveTitle(/Amazon/);
  await page.waitForTimeout(1000);

  // go to today's deals
  await page.locator(s.todaysDeals).waitFor({timeout: 10000});
  await page.locator(s.todaysDeals).click();
  await page.locator(s.department).waitFor({timeout: 10000})

  // go to electronics
  await page.locator(s.seeMore).click();
  await page.locator(s.electronics).click();
  await page.locator(s.percentOff(1)).waitFor({timeout: 10000})

  // get info for top 3 deals that are above 25%
  let counter = 1;
  let deals = [];

  while (await page.locator(s.percentOff(counter)).count() > 0) {
    // wait for product to load
    await page.locator(s.percentOff(counter)).waitFor({timeout: 10000})

    // initiate deals object
    let productInfo = {};

    // get discount and price
    productInfo = await f.getDiscountAndPrice(page, counter, productInfo);

    // add to deals if deal is greater than threshold
    if (productInfo.deal>= percentThreshold) {
      // assign item name
      productInfo.name = await page.$eval(s.itemName(counter), el => el.textContent);

      // click into product and extract info
      await page.locator(s.itemName(counter)).click();
      productInfo = await f.getProductInfo(page, productInfo);

      // create caption
      let caption = f.createCaption(productInfo);

      // post to telegram
      await telegram.sendPhoto(productInfo.imageURL, caption);
      await page.waitForTimeout(5000)

      // go back
      await page.goBack()

      await page.pause()

      // await page.pause();

      // deals.push(productInfo);

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
