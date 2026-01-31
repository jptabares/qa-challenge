import { test } from '../fixtures/test';
import { expect } from '../fixtures/expect';

test.describe('Todo App', () => {

    test.describe('Setup & Baseline', () => {

        test('should display the "Todo List" title', async ({ todoPage }) => {
            await todoPage.goto();
            await expect(todoPage.title).toBeVisible();
        });

    });

    test.describe('Core User Journeys', () => {
        test('A. should add a new todo "Buy milk"', async ({ todoPage }) => {
            await todoPage.goto();

            await todoPage.addTodoItem('Buy milk');

            await expect(todoPage.getTodoItem('Buy milk')).toBeVisible();
        });

        test('B. should show validation when adding empty todo', async ({ todoPage }) => {
            await todoPage.goto();

            const initialCount = await todoPage.getTodoCount();

            await todoPage.addTodoItem('');

            await expect(todoPage.validationMessage).toBeVisible();

            const finalCount = await todoPage.getTodoCount();
            expect(finalCount).toBe(initialCount);
        });
    })

    test.describe(' API & Async Behavior', () => {
        test('should wait for POST /api/todos and update UI after response', async ({ todoPage }) => {
            await todoPage.goto();

            const response = await todoPage.addTodoItemAndWaitForApi('Test API todo');

            expect(response.status()).toBe(200);
            await expect(todoPage.getTodoItem('Test API todo')).toBeVisible();
        });

        test('should load initial todos from mocked API', async ({ page, todoPage }) => {
            const mockTodos = [
                { id: 1, text: 'Mocked Todo 1', completed: false },
                { id: 2, text: 'Mocked Todo 2', completed: true },
            ];

            await page.route('**/api/todos', async (route) => {
                if (route.request().method() === 'GET') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify(mockTodos),
                    });
                } else {
                    await route.continue();
                }
            });

            await todoPage.goto();

            await expect(todoPage.getTodoItem('Mocked Todo 1')).toBeVisible();
            await expect(todoPage.getTodoItem('Mocked Todo 2')).toBeVisible();
        });

        test('should display error state when POST /api/todos returns 500', async ({ page, todoPage }) => {
            await page.route('**/api/todos', async (route) => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 500,
                        contentType: 'application/json',
                        body: JSON.stringify({ error: 'Internal Server Error' }),
                    });
                } else {
                    await route.continue();
                }
            });

            await todoPage.goto();

            await todoPage.addTodoItem('This should fail');

            await expect(todoPage.errorMessage).toBeVisible();
            await expect(todoPage.getTodoItem('This should fail')).not.toBeVisible();
        });

        test('should handle slow network response gracefully', async ({ page, todoPage }) => {
            await page.route('**/api/todos', async (route) => {
                if (route.request().method() === 'POST') {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ id: 99, text: 'Slow todo', completed: false }),
                    });
                } else {
                    await route.continue();
                }
            });

            await todoPage.goto();

            const response = await todoPage.addTodoItemAndWaitForApi('Slow todo');

            expect(response.status()).toBe(200);
            await expect(todoPage.getTodoItem('Slow todo')).toBeVisible();
        });
    });

    test.describe('Edge Cases & Resilience', () => {

        test('should handle whitespace-only input as invalid', async ({ todoPage }) => {
            await todoPage.goto();

            const initialCount = await todoPage.getTodoCount();

            await todoPage.addTodoItem('   ');

            const finalCount = await todoPage.getTodoCount();
            expect(finalCount).toBe(initialCount);
        });

        test('should handle special characters in todo text', async ({ todoPage }) => {
            await todoPage.goto();

            const specialText = 'Todo with <script>alert("xss")</script> & "quotes"';
            await todoPage.addTodoItem(specialText);

            await expect(todoPage.getTodoItem(specialText)).toBeVisible();
        });

        test('should handle empty todo list state', async ({ page, todoPage }) => {
            await page.route('**/api/todos', async (route) => {
                if (route.request().method() === 'GET') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify([]),
                    });
                } else {
                    await route.continue();
                }
            });

            await todoPage.goto();

            const count = await todoPage.getTodoCount();
            expect(count).toBe(0);
        });
    });
});