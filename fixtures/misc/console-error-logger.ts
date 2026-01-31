import { test as base,  Page } from "@playwright/test";
import logger from "../../utils/logger";

async function consoleErrorLogger({ page }: { page: Page}, use: (arg: void) => Promise<void>) {
    const getCurrentHost = () => {
        try {
            const u = page.url();
            if (u && u.startsWith('http')) {
                return new URL(u).host;
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    }

    page.on('console', msg => {
        // Only log actual errors, not warnings or info messages
        if (msg.type() !== 'error') {
            return;
        }

        const text = msg.text();
        const loc = msg.location?.();

        // Ignore React DevTools recommendation message
        if (text.includes('Download the React DevTools')) {
            return;
        }

        if(text.includes('Failed to load resource')) {
            const currentHost = getCurrentHost();
            if(loc?.url) {
                try {
                    const targetHost = new URL(loc.url).host;
                    if(currentHost && targetHost && currentHost !== targetHost) {
                        return; // ignore cross-origin errors
                    }
                } catch (e) {
                    return; // ignore malformed URLs
                }
            }
        }

        let message = `[BROWSER] Console Error ${text}`;
        if (loc) {
            message += ` at ${loc.url}:${loc.lineNumber}:${loc.columnNumber}`;
        }

        logger.error(message);
    });

    await use();
}

export const test = base.extend<{ _consoleErrorLoger: void }>({
    _consoleErrorLoger: [consoleErrorLogger, { scope: 'test', auto: true, box: true, title: 'Console Error Logger' }],
});