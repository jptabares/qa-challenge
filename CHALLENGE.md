# EstateSpace QA Engineer Automation Challenge (Playwright)
Hi! Thank you for your interest in [EstateSpace][g3website].

As part of our evaluation process, we ask candidates to complete a short, open‑ended take‑home challenge. There is no single correct solution. Instead, we want to understand your **testing judgment**, **automation strategy**, and how you reason about real‑world UI and API trade‑offs.

We recognize that any take‑home challenge represents an investment of your time. Please keep the scope reasonable and focus on strong fundamentals rather than completeness. If you are unsuccessful, you are free to reuse the code you developed for this challenge in any way you like.

If you are successful, we will use this work as a starting point for deeper technical discussion during follow‑up interviews.

# The Challenge
EstateSpace builds product experiences that consume REST‑based services and present data across web and mobile clients. We value **clarity**, **resilience**, **observability**, and **maintainable test suites**.

Your task is to implement automated tests using **Playwright** for a simple React‑based **Todo** application.

## Application Overview
The application has the following characteristics:

- Users can add a todo via a text input and an **Add** button
- Todos are loaded and saved via a REST API at:

```
/api/todos
```

- The application runs locally at:

```
http://localhost:3000
```

## Minimum Challenge Requirements
### 1. Setup & Baseline Test
- Install and configure **Playwright Test**
- Add a script to `package.json` to run tests via:

```
npx playwright test
```

- Implement one basic test that:
  - Opens the application home page
  - Verifies that the title **"Todo List"** is visible

### 2. Core User Journeys
Implement automated tests for the following flows.

#### A. Add a New Todo
- Enter **"Buy milk"** into the todo input
- Click the **Add** button
- Assert that the new todo appears in the list

#### B. Validation Behavior
- Attempt to add a todo with no text
- Click the **Add** button
- Assert that:
  - A validation message is displayed
  - No new todo is added

---

### 3. API & Asynchronous Behavior
Implement at least one test that explicitly validates async behavior.

- When adding a todo, wait for the **POST `/api/todos`** request to complete using:
  - `page.waitForResponse`, or
  - `page.waitForRequest`
- Verify that the UI updates **only after** a successful API response

You may mock API behavior using `page.route` to simulate:

- Successful loading of an initial todo list
- A server error (e.g. HTTP 500) when adding a todo, and assert that an error state is displayed

## Where to Concentrate Your Effort
After meeting the minimum requirements, choose **one or two** areas below to explore further.

### A. Test Architecture & Maintainab
- Test organization and readability
- Use of helpers, fixtures, or abstractions
- Clear separation between UI behavior and API concerns

### B. Resilience & Edge Cases
- Graceful handling of failures
- Avoiding flaky tests
- Explicit waiting strategies
- Error and empty states

### C. Cross‑Browser or Visual Coverage
Examples:
- Running tests across **Chromium** and **WebKit**
- Simple visual assertions using `toHaveScreenshot`
- Component testing with Playwright (optional)

## Prerequisites
1. A basic understanding of source code control, [git][git-scm] is required.
2. You must make your code available via a [GitHub][github] account.
3. You should be familiar with consuming data APIs.

## Getting Started
1. Fork this [repository][repository].
2. Clone the fork to your local machine.
3. Start coding.
4. Commit changes to your fork as you see fit.
5. Try to limit time investment to 30-60 mins max for the initial “get it to work approach”. 

## Submission
When you are comfortable with your results, please email your fork to
[support@estatespace.com](mailto:support@estatespace.com). Please keep your emails short and to the point.

- Share the git repo link that contains your code and readme with steps to execute
- A short **README** describing:
  - How to run the React application
  - How to execute Playwright tests and view the HTML report
- Your Playwright configuration file
- Your test files (e.g. `tests/todo.spec.ts`)
- You are free to use a throwaway GitHub account.
- Any specific notes or further information you would like to add about your submittal, should be included in the GitHub project.

## Evaluation Criteria
We will evaluate:
- Correctness and completeness of the minimum requirements
- Test reliability and async handling
- API mocking and error coverage
- Code structure and readability
- Pragmatic use of Playwright features
- Clarity of written communication
- Nice to have:
  - Step-by-step commits : Start coding and make sure to commit logically. As soon
    as things are working, push a commit. It also enables coming back if you mess
    up anything going forward. 
  - Killer readme

We recognize there are many ways to approach automated testing. Please do not feel you must implement everything. Use your strengths to your advantage and document where and why you focused your effort.

Creativity, sound judgment, and a clear testing philosophy matter more than exhaustive coverage.

Please do not overthink think this or get too wrapped up in making a bullet proof application. This is a basic
challenge. Spending significant amounts of time ensuring production level quality is not required. Rather,
we would like to see your architectural choices and approach to coding over production ready, visually
appealing features.

### License
This project is [MIT licensed][mitlicense].

[g3website]:https://www.griffingroupglobal.com
[git-scm]:https://git-scm.com/
[github]:https://github.com/
[nodejs]:https://nodejs.org/en/
[TDD]:https://en.wikipedia.org/wiki/Test-driven_development
[ES6]:http://www.ecma-international.org/ecma-262/6.0/
[eslint]:https://eslint.org/
[airbnb-eslint]:https://www.npmjs.com/package/eslint-config-airbnb
[mocha]:https://mochajs.org/
[repository]:https://github.com/GriffinGroupGlobal/qa-challenge
[mitlicense]:https://en.wikipedia.org/wiki/MIT_License
[commonmark]:https://spec.commonmark.org/]
[docker]:https://www.docker.com/
[kubernetes]:https://kubernetes.io/
[reactnative]:https://reactnative.dev/
