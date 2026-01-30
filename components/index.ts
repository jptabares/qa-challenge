import { expect } from "../fixtures/expect";
import { FrameLocator, Locator, Page } from "../fixtures/playwright";

export class Component <T = Locator> {
    constructor(public readonly root: T) {}

    get page() {
        return (this.root as Locator).page();
    }

    get componentName() {
        if(typeof (this as any)["name"] === "string") {
            return (this as any)["name"];
        }
        return this.constructor.name || "Component";
    }

    async expectToBeVisible(timeout?: number) {
        await expect.soft(this.root as Locator, `${this.componentName} root should be visible`).toBeVisible({ timeout });
    }

    async expectToBeHidden(timeout?: number) {
        await expect.soft(this.root as Locator, `${this.componentName} root should be hidden`).toBeHidden({ timeout });
    }

    async verifyScreenShot({ maxDiffPixelRatio = 0.01 } : { maxDiffPixelRatio: number}) {
        await expect(this.root as Locator, `${this.componentName} screenshot`).toHaveScreenshot({ maxDiffPixelRatio });
    }
}

export class Frame extends Component<FrameLocator> {
	get page(): Page {
		return this.root.owner().page();
	}
}

export class GlobalComponent extends Component<Page> {
	get page(): Page {
		return this.root;
	}

	public async back() {
		await this.page.goBack();
	}
}