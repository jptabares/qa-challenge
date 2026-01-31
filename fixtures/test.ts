import { mergeTests } from "./playwright";


import { test as pagesTest } from "./pages";
import { test as screenshotTest } from "./misc/screenshot";
import { test as createErrorLogger } from "./misc/console-error-logger";


export const test = mergeTests(
    pagesTest,
    screenshotTest,
    createErrorLogger
);