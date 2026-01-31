import { Locator, Page } from "../fixtures/playwright";
import { GlobalComponent } from "../components";
import { ACTION_TIMEOUT } from "../utils/timeouts";

export class TodoPage extends GlobalComponent {
    readonly title: Locator = this.page.getByRole('heading', { name: 'Todo List' }); 
    readonly todoInput: Locator = this.page.locator('[testid="new-todo-input"], input[placeholder="Add a new todo..."]');
    readonly addButton: Locator = this.page.getByRole('button', { name: 'Add' });
    readonly todoList: Locator = this.page.locator('[testid="todo-list"], ul, .todo-list');
    readonly validationMessage: Locator = this.page.locator('[testid="validation-message"], .validation-message');
    readonly errorMessage: Locator = this.page.locator('[testid="error-message"], .error-message');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto('/');
    }

    async addTodoItem(item: string) {
        await this.todoInput.fill(item);
        await this.addButton.click();
    }

    async addTodoItemAndWaitForApi(item: string, timeout = ACTION_TIMEOUT) {
        const response = this.page.waitForResponse(
            response => response.url().includes('/api/todos')
                && response.request().method() === 'POST'
                && response.status() >= 200
                && response.status() < 300,
            { timeout }
        );
        await this.addTodoItem(item);
        return response;
    }

    getTodoItem(text: string): Locator {
        return this.todoList.locator('li, .todo-item').filter({ hasText: text }).first();
    }

    async getTodoCount(): Promise<number> {
        const items = this.todoList.locator('li, .todo-item');
        return items.count();
    }

}