export const todaysDeals = "//a[contains(@href,'deals')]"
export const department = "//span[text()='Department']"
export const electronics = "//span[text()='Electronics']"
export const seeMore = "//button[contains(@class,'SeeMoreButton') and contains(@aria-labelledby,'departments-label')]"
export const productTitle = "//span[@id='productTitle']"
export const productShortDesc = "(//div[contains(@id,'featurebullets')]//span)[1]"
export const mainImage = "(//span[contains(@data-action,'main-image')]//img)[1]"
export const asin = "//input[@id='ASIN']"
export const searchField = "//input[@role='searchbox']"

export function percentOff(counter) {
    return `(//span[contains(text(),'% off')])[${String(counter)}]`
}

export function dealPrice(counter) {
    return `(//span[contains(@class,'offscreen') and contains(text(),'Deal Price:')])[${String(counter)}]`
}

export function itemName(counter) {
    return `((//span[contains(text(),'% off')])[${String(counter)}]/ancestor::div[contains(@data-testid,'product-card')]//p//span)[last()]`
}