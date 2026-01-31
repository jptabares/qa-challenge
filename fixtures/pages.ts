import { test as base } from './playwright';
import { TodoPage } from '../pages/todo.page';

type PageTestFixtures = {
    todoPage: TodoPage;
}

export const test = base.extend<PageTestFixtures>({
    todoPage: async ({ page }, use) => {
        const todoPage = new TodoPage(page);
        await use(todoPage);
    },
});