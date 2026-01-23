import * as s from '../helpers/selectors.page'

/**
 * @param {import('@playwright/test').Page} page
 */

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
        const match = discountPrice.match(/Deal Price:\s*(.*)/);
        if (match) {
            productInfo.dealPrice = match ? match[1] : null;
        }
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
    productInfo.shortDesc = await page.$eval(s.productShortDesc, el => el.textContent.trim());

    // get image url
    productInfo.imageURL = await page.locator(s.mainImage).getAttribute('data-old-hires');

    // get asin
    productInfo.asin = await page.locator(s.asin).getAttribute('value');

    return productInfo;
}

export function createCaption(productInfo) {
    let caption = `<b>${productInfo.name}</b>
${productInfo.dealPrice} — ${String(productInfo.deal)}% off (currently)

${productInfo.shortDesc}

<i>https://www.amazon.com/dp/${productInfo.asin}?tag=buywisealerts-20</i>
`.trim();

    return caption;
}