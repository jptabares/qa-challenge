import { test as base, Page, Locator, expect, PageAssertionsToHaveScreenshotOptions } from "../playwright";

export type ScreenshotOptions = {
    screenshotOptions?: Partial<PageAssertionsToHaveScreenshotOptions>
};

export type ScreenshotTestFixture = {
    checkScreenshot: (scope?: Page | Locator) => Promise<void>;
}

export const test = base.extend<ScreenshotOptions & ScreenshotTestFixture>({
    screenshotOptions: [{ maxDiffPixelRatio: 0.02, animations: 'disabled', caret: 'hide' }, { option: true }],

    checkScreenshot: async ({page, screenshotOptions}, use) => {
        await use(async (scope?: Page | Locator) => {
            await expect(scope ?? page).toHaveScreenshot(screenshotOptions)
        })
    }
});       