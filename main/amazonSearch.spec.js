// @ts-check
import { test, expect } from '@playwright/test';
import * as s from '../helpers/selectors.page'
import * as telegram from '../helpers/telegram.page'
import * as f from '../helpers/functions.page'
import { hasPosted, markPosted } from "../lib/dedupe.js";
import "dotenv/config";

// define env vars
let percentThreshold = 25;
let priceThreshold = 100;
let maxDealsPosted = 1;

test.use({
  viewport: { width: 1280, height: 800 },
});

test('amazon afil bot', async ({ page }) => {
  // launch amazon
  await page.goto('https://amazon.com');
  await expect(page).toHaveTitle(/Amazon/);
  await page.waitForTimeout(5000);
  
  // search deals
  await page.locator(s.searchField).waitFor({timeout: 10000});
  await page.locator(s.searchField).fill("deals");
  await page.keyboard.press("Enter");

  // go to today's deals
  await page.locator(s.department).waitFor({timeout: 10000})

  // go to electronics
  await page.locator(s.seeMore).click();
  await page.locator(s.electronics).click();
  await page.locator(s.percentOff(1)).waitFor({timeout: 10000})

  // get info for top 3 deals that are above 25%
  let counter = 1;
  let dealsPosted = 0;

  while (dealsPosted != maxDealsPosted) {
    console.log(counter)
    //check if page needs to be scrolled down
    if (await page.locator(s.percentOff(counter)).count() == 0) {
      await page.keyboard.press("PageDown");
      await page.waitForTimeout(7000)
      // reset counter to 6
      counter -= 5;
    }
    try {
      // wait for product to load
      await page.locator(s.percentOff(counter)).waitFor({timeout: 10000})

      // initiate deals object
      let productInfo = {};

      // get discount and price
      productInfo = await f.getDiscountAndPrice(page, counter, productInfo);

      // add to deals if deal is greater than threshold
      if (productInfo.deal >= percentThreshold && productInfo.dealPrice >= priceThreshold) {
        // assign item name
        productInfo.name = await page.$eval(s.itemName(counter), el => el.textContent);
        productInfo.asin = await page.$eval(s.productAsin(counter), el => el.getAttribute('data-asin'));
        console.log(productInfo.asin)

        // check if this asin has already been posted
        if (await hasPosted(productInfo.asin)) {
          console.log("Skipping already posted:", productInfo.asin);
          continue;
        }
        
        // click into product and extract info
        await page.locator(s.itemName(counter)).click();
        productInfo = await f.getProductInfo(page, productInfo);
        console.log(productInfo)

        // create caption
        let caption = f.createCaption(productInfo);

        // post to telegram
        const result = await telegram.sendPhoto(productInfo.imageURL, caption); // should return API result
        const messageId = result?.message_id ?? null;

        await markPosted({
          asin: productInfo.asin,
          priceText: `$${productInfo.dealPrice}`,
          url: productInfo.affiliateLink,
          telegramMessageId: messageId,
          itemName: productInfo.name,
        });

        console.log("Posted and recorded:", productInfo.asin);
        dealsPosted++;
        // await telegram.sendPhoto(productInfo.imageURL, caption);
        await page.waitForTimeout(5000);

        // go back
        await page.goBack({waitUntil: "domcontentloaded"});
      } else {
        console.log(`Skipping because percent (${productInfo.deal}%) and/or price ($${productInfo.dealPrice}) threshold(s) were not met.`)
      }
    } catch(e) {
      console.log(e);
      process.exit(1);
      throw e;
    } finally {
      console.log(`Deals posted so far: ${dealsPosted}`)
      // if n deals have been found, break
      if (dealsPosted == maxDealsPosted) {
        break;
      }
      //count
      counter++;
    }
  }
});
