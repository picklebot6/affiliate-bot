import * as s from '../helpers/selectors.page'

/**
 * @param {import('@playwright/test').Page} page
 */

function extractAsinFromUrl(url) {
    if (!url) return null;
  
    const start = url.indexOf("/dp/");
    if (start === -1) return null;
  
    const asinStart = start + 4; // length of "/dp/"
    const end = url.indexOf("?", asinStart);
  
    const asin = end !== -1
      ? url.slice(asinStart, end)
      : url.slice(asinStart);
  
    return asin.toUpperCase();
  }

export async function getDiscountAndPrice(page, counter, productInfo) {
    // find current deal
    let percentText = await page.$eval(s.percentOff(counter), el => el.textContent);
    // extract just number
    if (percentText) {
        const match = percentText.match(/(\d+)%\s*off/i);
        if (match) {
            productInfo.deal = match ? Number(match[1]) : null;
        }
    }

    // get discounted price
    let discountPrice = await page.$eval(s.dealPrice(counter), el => el.textContent);
    if (discountPrice) {
        const match = discountPrice.match(
        /Deal Price:\s*\$((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{2})?)/
        );
          
        if (match) {
        productInfo.dealPrice = Number(match[1].replace(/,/g, ''));
        };
    }

    return productInfo
}

export async function getProductInfo(page, productInfo) {
    await page.locator(s.productTitle).waitFor({timeout:10000})
    // get product name
    let name = await page.$eval(s.productTitle, el => el.textContent);
    let nameSplit = name.split(',');
    let shortName = nameSplit[0].trim();

    // add to dict
    productInfo.name = shortName
    // get short description
    try {
        let desc = await page.$eval(s.productShortDesc, el => el.textContent.trim());
        // remove everything after the first sentence
        let split = desc.split(". ");
        productInfo.shortDesc = split[0]+".";
    } catch (e) {
        productInfo.shortDesc = ""
    }

    // get image url
    productInfo.imageURL = await page.locator(s.mainImage).getAttribute('data-old-hires');

    // get asin
    try {
        productInfo.asin = extractAsinFromUrl(page.url());
    } catch(e) {
        productInfo.asin = await page.locator(s.asin).getAttribute('value');
    }

    // set affiliate link
    productInfo.affiliateLink = `https://www.amazon.com/dp/${productInfo.asin}?tag=buywisealerts-20`

    return productInfo;
}

export function escapeTelegramHTML(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function createCaption(productInfo) {
  const name = escapeTelegramHTML(productInfo.name);
  const desc = escapeTelegramHTML(productInfo.shortDesc);
  const link = escapeTelegramHTML(productInfo.affiliateLink);

  return `
<b>📦 ${name}</b>

💰 <b>$${productInfo.dealPrice.toFixed(2)}</b> — <i>${productInfo.deal}% off (currently)</i>

🔥 ${desc}

🔗 <i>${link}</i>
`.trim();
}