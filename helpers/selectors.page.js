export const todaysDeals = "//a[contains(@href,'deals')]"
export const department = "//span[text()='Department']"

export function percentOff(counter) {
    return `(//span[contains(text(),'% off')])[${String(counter)}]`
}

export function itemName(counter) {
    return `((//span[contains(text(),'% off')])[${String(counter)}]/ancestor::div[contains(@data-testid,'product-card')]//p//span)[last()]`
}