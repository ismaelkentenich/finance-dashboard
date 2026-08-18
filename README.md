<div align="center">

# 💸 FinFlow — Finance Dashboard

### A modern personal finance dashboard built with Next.js, React and TypeScript.

A frontend-focused project for exploring financial data through interactive dashboards, transaction management, data visualization, accessible interactions, internationalization, and polished UI experiences.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📖 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Frontend Highlights](#-frontend-highlights)
- [🎯 Project Goals](#-project-goals)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Frontend Architecture](#️-frontend-architecture)
- [📂 Project Structure](#-project-structure)
- [🔄 Data Flow](#-data-flow)
- [📊 Financial Dashboard](#-financial-dashboard)
- [🔎 Transaction Filtering](#-transaction-filtering)
- [📝 Forms & Validation](#-forms--validation)
- [📈 Data Visualization](#-data-visualization)
- [🎬 Motion & Microinteractions](#-motion--microinteractions)
- [🌎 Internationalization](#-internationalization)
- [♿ Accessibility](#-accessibility)
- [🛡️ Runtime Data Safety](#️-runtime-data-safety)
- [🧪 Testing Strategy](#-testing-strategy)
- [🎨 Component Development](#-component-development)
- [🧹 Code Quality](#-code-quality)
- [🚀 Getting Started](#-getting-started)
- [📜 Available Scripts](#-available-scripts)
- [🐳 Docker](#-docker)
- [👤 Author](#-author)

---

## 🎯 Overview

**FinFlow** is a modern personal finance dashboard built as a frontend engineering project with **Next.js, React, and TypeScript**.

The application focuses on delivering a polished financial management experience through interactive dashboards, transaction filtering, data visualization, responsive layouts, accessible interactions, internationalization, and subtle motion.

Beyond the interface itself, the project explores production-oriented frontend practices such as **component composition, server-state management, runtime validation, reusable hooks, form architecture, accessibility testing, Storybook-driven component development, and automated quality checks**.

> The transaction API included in the project is a lightweight mock layer used to support frontend development and demonstrate realistic asynchronous data flows. Backend architecture and persistent storage are intentionally outside the project's scope.

---

## ✨ Frontend Highlights

### 📊 Interactive Financial Dashboard

The dashboard transforms transaction data into an accessible financial overview containing:

- Current balance
- Total income
- Total expenses
- Savings rate
- Period-over-period comparisons
- Financial evolution charts
- Expense distribution by category
- Recent transaction history

Dashboard widgets consume the same financial state and filtering rules, keeping the information presented throughout the interface synchronized.

---

### 🧩 Component-Driven Architecture

The interface is divided into focused feature components and reusable UI primitives.

Application behavior is progressively extracted into:

- Hooks
- Context providers
- Services
- Schemas
- Utilities
- Domain calculations

This keeps React components primarily responsible for **presentation, composition, and user interaction** rather than concentrating application logic inside the UI layer.

---

### 🔄 Server State with TanStack Query

Remote transaction state is managed with **TanStack Query**, separating asynchronous server state from local interface state.

The application handles:

- Initial loading
- Background refetching
- Error states
- Cache management
- Mutations
- Query invalidation
- UI synchronization after mutations

This avoids manually coordinating request lifecycle state throughout individual React components.

---

### 📝 Type-Safe Forms

Transaction forms combine:

```text
React Hook Form
       +
      Zod
       +
   TypeScript
```

to provide:

- Declarative validation
- Typed form values
- Localized validation messages
- Accessible validation feedback
- Loading states
- Error handling
- Focus management
- Mutation feedback

When form validation fails, keyboard focus can be directed to the first invalid field, improving both usability and accessibility.

---

### 📈 Financial Data Visualization

Financial information is visualized using **Recharts** through reusable chart components.

Charts consume normalized financial data derived from the same transaction collection used throughout the dashboard.

This keeps visualizations consistent with:

- Summary cards
- Filters
- Category breakdowns
- Transaction lists
- Financial calculations

---

### 🎬 Motion & Microinteractions

**Framer Motion** and CSS animations are used to make dynamic interface changes feel intentional rather than abrupt.

Motion enhances interactions such as dynamic content changes and component transitions while respecting the operating system's reduced-motion preference:

```css
@media (prefers-reduced-motion: reduce) {
  /* Reduced animation behavior */
}
```

This allows animations to enhance the experience without becoming an accessibility barrier.

---

### 🌎 Internationalized Experience

The interface supports:

- 🇧🇷 Portuguese — `pt-BR`
- 🇺🇸 English — `en-US`

Localization extends beyond visible text and includes areas such as:

- Interface labels
- Validation messages
- Error feedback
- Notifications
- Accessible labels
- Dates
- Currency values
- Financial formatting

---

### ♿ Accessibility by Design

Accessibility is incorporated into component behavior and interaction patterns.

The project includes:

- Semantic HTML landmarks
- Keyboard navigation
- Skip-to-content navigation
- Accessible modal behavior
- Focus management
- `aria-live` feedback
- Accessible form validation
- Localized accessible labels
- Reduced-motion support
- Automated accessibility tests
- Storybook accessibility tooling

---

### 🧪 Frontend Testing Infrastructure

The project includes reusable testing infrastructure instead of configuring providers and mocks independently inside every test.

Shared utilities provide:

- Custom `render`
- Custom `renderHook`
- Application providers
- Query clients
- Domain fixtures
- Common mocks
- Navigation mocks
- Accessibility matchers

This reduces test duplication while keeping individual tests focused on application behavior.

---

## 🎯 Project Goals

FinFlow was created as a frontend engineering project focused on building a realistic dashboard experience while applying modern React development practices.

The project explores:

- Scalable React component composition
- Strong TypeScript modeling
- Separation between UI and application logic
- Server-state management
- Form architecture and validation
- Financial data transformation
- Data visualization
- Responsive interface design
- Accessible interactions
- Internationalization
- Motion and microinteractions
- Component-driven development
- Automated frontend testing
- Runtime data validation
- Production-oriented developer tooling

The backend is intentionally outside the scope of the project.

A lightweight mock API is included only to provide realistic asynchronous behavior for frontend flows such as:

```text
Loading
   ↓
Fetching
   ↓
Success / Error
   ↓
Mutation
   ↓
Cache Invalidation
   ↓
Background Refetch
   ↓
UI Synchronization
```

---

## 🧰 Tech Stack

### Core Frontend

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| **Next.js 16**   | Application framework and App Router    |
| **React 19**     | Component-based UI architecture         |
| **TypeScript 5** | Static typing and application contracts |
| **CSS Modules**  | Component-scoped styling                |

### State & Data

| Technology         | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| **TanStack Query** | Server-state management, caching and mutations |
| **React Context**  | Shared client-side application state           |
| **Zod**            | Schema validation and runtime data validation  |

### Forms

| Technology              | Purpose                             |
| ----------------------- | ----------------------------------- |
| **React Hook Form**     | Form state and validation lifecycle |
| **Zod**                 | Declarative form schemas            |
| **@hookform/resolvers** | React Hook Form and Zod integration |

### UI & Visualization

| Technology        | Purpose                                 |
| ----------------- | --------------------------------------- |
| **Recharts**      | Financial charts and data visualization |
| **Framer Motion** | Animations and UI transitions           |
| **Lucide React**  | Interface iconography                   |

### Testing

| Technology                | Purpose                         |
| ------------------------- | ------------------------------- |
| **Vitest**                | Unit and integration testing    |
| **Testing Library**       | User-oriented React testing     |
| **vitest-axe / axe-core** | Automated accessibility testing |
| **Playwright**            | Browser testing infrastructure  |

### Development & Quality

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| **Storybook**   | Isolated component development |
| **ESLint**      | Static code analysis           |
| **Prettier**    | Code formatting                |
| **Husky**       | Git hooks                      |
| **lint-staged** | Pre-commit validation          |

### Deployment

| Technology         | Purpose                                     |
| ------------------ | ------------------------------------------- |
| **Docker**         | Production containerization                 |
| **Docker Compose** | Container orchestration for local execution |

---

## 🏗️ Frontend Architecture

FinFlow separates presentation, application state, domain calculations, validation, and data access into dedicated responsibilities.

```text
                         FinFlow
                            │
              ┌─────────────┴─────────────┐
              │                           │
          App Router                  Providers
              │                           │
              ▼                           ▼
        Pages / Layouts        Query / Locale / Settings
              │                           │
              └─────────────┬─────────────┘
                            ▼
                    Feature Components
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        UI Primitives     Hooks        Contexts
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                  Application Services
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Financial Domain               Data Access
       & Calculations               TanStack Query
```

### UI Layer

React components are responsible primarily for:

- Rendering
- Composition
- Interaction
- Accessibility
- Visual states

### Application Layer

Hooks and contexts coordinate application behavior such as:

- Dashboard state
- Filtering
- Locale
- Settings
- Modal state
- Data orchestration

### Domain Layer

Financial utilities and services are responsible for operations such as:

- Aggregation
- Filtering
- Financial summaries
- Category calculations
- Period comparisons

This keeps financial calculations independent from individual React components.

### Data Layer

TanStack Query and frontend services coordinate asynchronous transaction data.

The underlying mock API exists only as a development data source and is not treated as part of the project's core architecture.

---

## 📂 Project Structure

```text
.
├── public/
│
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── transactions/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── error.tsx
│   │   │
│   │   └── api/
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── constants/
│   ├── contexts/
│   ├── hooks/
│   ├── locales/
│   ├── schemas/
│   ├── services/
│   │   ├── api/
│   │   ├── financial/
│   │   └── telemetry/
│   │
│   ├── test/
│   │   └── utils/
│   │
│   ├── types/
│   └── utils/
│
├── Dockerfile
├── docker-compose.yml
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### `src/app`

Contains the Next.js App Router structure, including pages, layouts, loading states, route-level error boundaries, and the lightweight mock data layer used during development.

### `src/components/dashboard`

Contains finance-specific components responsible for composing the dashboard experience.

Examples include:

- Financial summaries
- Charts
- Filters
- Category breakdowns
- Transaction tables
- Transaction forms
- Dashboard widgets

### `src/components/ui`

Contains reusable interface primitives shared across features.

Keeping these components separate from domain-specific dashboard components helps maintain a clear distinction between **generic UI** and **financial features**.

### `src/contexts`

Contains application-wide React contexts for shared client state such as:

- Locale
- Settings
- Modal behavior

### `src/hooks`

Contains reusable hooks responsible for application orchestration and reusable stateful behavior.

### `src/locales`

Contains localized interface content used by the internationalization layer.

### `src/schemas`

Contains Zod schemas used for:

- Form validation
- Runtime data validation
- Application contracts

### `src/services/financial`

Contains financial calculations and data transformations independently from the React rendering layer.

### `src/services/api`

Contains the frontend data-access boundary.

Components do not need to know how transaction data is retrieved or validated.

### `src/services/telemetry`

Provides an abstraction for reporting unexpected runtime failures and contract violations.

### `src/test`

Contains reusable testing infrastructure, fixtures, providers, mocks, and helpers.

---

## 🔄 Data Flow

The dashboard follows a predictable unidirectional data flow.

```text
                    Dashboard
                        │
                        ▼
               Application Hooks
                        │
                        ▼
                 TanStack Query
                        │
                        ▼
                Frontend Service
                        │
                        ▼
              Runtime Validation
                        │
                        ▼
                Transaction Data
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
      Financial       Charts     Transaction UI
      Summaries
```

The mock API sits behind the frontend service boundary and simply provides asynchronous data during development.

### Transaction Creation Flow

```text
User
 │
 ▼
Transaction Form
 │
 ▼
React Hook Form
 │
 ▼
Zod Validation
 │
 ▼
Mutation
 │
 ▼
Frontend Service
 │
 ▼
Successful Response
 │
 ▼
Query Invalidation
 │
 ▼
Background Refetch
 │
 ▼
Updated Dashboard
```

This allows the interface to exercise realistic server-state behavior without making backend implementation part of the project's objective.

---

## 📊 Financial Dashboard

The main dashboard consolidates financial information into a single responsive interface.

It presents metrics such as:

- Balance
- Income
- Expenses
- Savings rate
- Period comparisons
- Financial evolution
- Spending by category
- Recent transactions

The dashboard coordinates multiple independent widgets while keeping their underlying data synchronized.

---

## 🔎 Transaction Filtering

Transactions can be explored using filters such as:

- Period
- Transaction type
- Category

Filtering affects the financial information displayed throughout the dashboard rather than operating only on the transaction table.

This keeps:

```text
Filters
   │
   ├── Summary
   ├── Charts
   ├── Categories
   └── Transactions
```

consistent with the selected financial context.

---

## 📝 Forms & Validation

Transaction forms are implemented with **React Hook Form** and **Zod**.

```text
User Input
    │
    ▼
React Hook Form
    │
    ▼
Zod Schema
    │
 ┌──┴───────────┐
 │              │
Valid         Invalid
 │              │
 ▼              ▼
Mutation     Error Feedback
                │
                ▼
           Focus Management
```

The implementation focuses on:

- Strong typing
- Declarative schemas
- Accessible feedback
- Localized messages
- Clear loading states
- Error handling
- Keyboard usability

---

## 📈 Data Visualization

**Recharts** is used to transform financial data into interactive visual representations.

Charts are kept separate from financial calculations.

Instead of embedding financial business logic directly inside visualization components:

```text
Transactions
     │
     ▼
Financial Calculation
     │
     ▼
Normalized Chart Data
     │
     ▼
Recharts Component
```

This makes chart components easier to understand, test, and maintain.

---

## 🎬 Motion & Microinteractions

Motion is used as interaction feedback rather than decoration.

**Framer Motion** supports dynamic interface transitions while CSS handles lightweight visual effects where appropriate.

Animations are designed around:

- State changes
- Dynamic content
- Filtering
- Modal interactions
- Content entering or leaving the interface
- Reordering

Motion behavior also respects:

```css
prefers-reduced-motion
```

so users who request reduced animation are not forced to experience unnecessary movement.

---

## 🌎 Internationalization

FinFlow currently supports:

```text
pt-BR
en-US
```

The locale layer handles user-facing application content while native browser internationalization APIs are used for locale-sensitive values.

For example:

```ts
Intl.NumberFormat(...)
```

and:

```ts
Intl.DateTimeFormat(...)
```

allow financial values and dates to adapt to the selected locale.

Localization applies to more than visible interface text.

It also covers areas such as:

- Form validation
- Notifications
- Errors
- Accessible names
- Buttons
- Dynamic feedback

---

## ♿ Accessibility

Accessibility is treated as an architectural requirement of the UI.

### Semantic Structure

The application uses semantic HTML and landmarks to provide meaningful document structure.

A skip-to-content mechanism allows keyboard users to bypass repeated navigation.

### Keyboard Interaction

Interactive elements are designed to remain usable without a pointer device.

This is particularly important for:

- Forms
- Modals
- Navigation
- Filters
- Dynamic controls

### Accessible Forms

Invalid fields expose appropriate accessibility information.

For example:

```html
<input aria-invalid="true" aria-describedby="transaction-description-error" />
```

Associated validation messages provide additional context for assistive technologies.

### Focus Management

When validation fails, focus can move to the first invalid field instead of forcing keyboard users to manually locate the error.

Modal interactions also account for focus behavior.

### Dynamic Feedback

Asynchronous states use semantic live regions where appropriate.

Examples include:

```html
<div role="status" aria-live="polite">Updating transactions...</div>
```

and urgent errors can use:

```html
<div role="alert">Unable to load transactions.</div>
```

### Reduced Motion

Animation behavior respects the user's system-level reduced-motion preference.

### Automated Accessibility Testing

Accessibility is also included in the automated testing workflow using:

- `axe-core`
- `vitest-axe`
- Storybook accessibility tooling

---

## 🛡️ Runtime Data Safety

TypeScript provides compile-time safety, but external data does not automatically satisfy TypeScript interfaces at runtime.

FinFlow therefore validates data entering the frontend boundary.

```text
External Data
     │
     ▼
   unknown
     │
     ▼
 Zod Schema
     │
 ┌───┴────┐
 │        │
Valid   Invalid
 │        │
 ▼        ▼
Typed   Error +
Data    Telemetry
```

Conceptually:

```ts
const rawData: unknown = await response.json();

const result = schema.safeParse(rawData);

if (!result.success) {
  throw new Error("Invalid data contract");
}

return result.data;
```

This prevents malformed data from silently propagating into:

- Hooks
- Components
- Charts
- Financial calculations
- Application state

Runtime validation is therefore treated as a **frontend reliability boundary**, not as backend architecture.

---

## 🧪 Testing Strategy

FinFlow uses **Vitest** and **Testing Library** to test application behavior from the user's perspective.

The testing strategy covers multiple frontend layers.

```text
             Frontend Tests
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
  Components     Hooks      Services
       │           │           │
       ▼           ▼           ▼
 Interaction     State       Domain
Accessibility   Behavior     Logic
Localization   Filtering   Validation
```

### Component Tests

Component tests focus on observable behavior such as:

- Rendering
- User interactions
- Keyboard behavior
- Loading states
- Error states
- Accessibility
- Localization

### Hook Tests

Hooks are tested independently when their behavior warrants isolation.

Examples include:

- Data orchestration
- Filtering
- State synchronization

### Service Tests

Frontend services are tested independently from UI components.

This includes:

- Financial calculations
- Data transformations
- Runtime validation
- Error handling

### Shared Test Utilities

The project provides reusable testing infrastructure instead of recreating application providers inside every test.

```text
src/test/
├── setup.ts
├── types.ts
└── utils/
    ├── fixtures.ts
    ├── index.ts
    ├── mocks.ts
    ├── providers.tsx
    └── render.tsx
```

This infrastructure provides reusable:

- Providers
- Query clients
- Fixtures
- Mocks
- Custom render functions
- Hook render utilities

---

## 🎨 Component Development

Reusable UI components can be developed and inspected independently through **Storybook**.

Start Storybook with:

```bash
npm run storybook
```

Then open:

```text
http://localhost:6006
```

Storybook provides an isolated environment for working on UI states without navigating through the complete application.

It is particularly useful for:

- Visual component development
- Component documentation
- State exploration
- Accessibility analysis
- Regression prevention

Build the static Storybook application with:

```bash
npm run build-storybook
```

---

## 🧹 Code Quality

FinFlow includes automated tooling to maintain consistency and catch regressions early.

```text
                 Source Code
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
       ESLint      Prettier    TypeScript
          │           │           │
          └───────────┼───────────┘
                      ▼
                    Tests
                      │
                      ▼
                Git Quality Gate
```

### ESLint

Static analysis helps detect problematic patterns and maintain consistent coding practices.

```bash
npm run lint
```

### Prettier

Formatting is automated using:

```bash
npm run format
```

### TypeScript

Static type checking can be executed independently:

```bash
npm run typecheck
```

### Git Hooks

**Husky** and **lint-staged** integrate quality checks into the Git workflow.

For staged TypeScript files, the project can automatically run checks such as:

```text
eslint --fix
      ↓
prettier --write
      ↓
vitest related --run
```

This helps catch issues before they enter the repository history.

---

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are available:

- **Node.js 20+**
- **npm**
- **Git**

Docker is optional for local development.

### Clone the Repository

```bash
git clone https://github.com/ismaelkentenich/finance-dashboard.git
cd finance-dashboard
```

### Install Dependencies

```bash
npm ci
```

### Start Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

---

### Production Build

```bash
npm run build
```

Creates an optimized production build.

Start the production server with:

```bash
npm start
```

---

### Type Checking

```bash
npm run typecheck
```

Runs TypeScript static analysis without emitting output.

---

### Linting

```bash
npm run lint
```

Runs ESLint across the project.

---

### Formatting

```bash
npm run format
```

Formats the codebase using Prettier.

---

### Testing

Run the complete test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage information:

```bash
npm run test:coverage
```

---

### Storybook

Start the Storybook development environment:

```bash
npm run storybook
```

Build Storybook:

```bash
npm run build-storybook
```

---

## 🐳 Docker

FinFlow includes a production-oriented Docker configuration for running the Next.js frontend inside a container.

### Build the Image

```bash
docker build -t finance-dashboard .
```

### Run the Container

```bash
docker run -p 3000:3000 finance-dashboard
```

Open:

```text
http://localhost:3000
```

### Docker Compose

The project can also be started with:

```bash
docker compose up --build
```

### Multi-Stage Build

The Dockerfile uses a multi-stage strategy conceptually structured as:

```text
Node.js Base
     │
     ▼
Dependencies
     │
     ▼
Next.js Build
     │
     ▼
Production Runner
```

Only the artifacts required to execute the production application are copied into the final runtime image.

### Next.js Standalone Output

The production configuration uses Next.js standalone output, allowing the container to execute the generated standalone server without shipping the complete development environment.

The production container also runs using a dedicated non-root user.

---

## 🧠 Engineering Highlights

FinFlow demonstrates several frontend engineering practices in a single application:

- **Next.js App Router architecture**
- **React 19 component composition**
- **Strong TypeScript boundaries**
- **Feature-oriented component organization**
- **Reusable UI primitives**
- **Server-state management with TanStack Query**
- **React Hook Form + Zod form architecture**
- **Runtime data validation**
- **Financial domain calculations separated from UI**
- **Reusable application hooks**
- **React Context for shared client state**
- **Interactive financial visualization with Recharts**
- **Motion and microinteractions with Framer Motion**
- **Reduced-motion support**
- **Internationalization with `pt-BR` and `en-US`**
- **Accessible form validation**
- **Keyboard and focus management**
- **Automated accessibility testing**
- **Route-level error handling**
- **Telemetry abstraction for unexpected runtime failures**
- **Reusable testing infrastructure**
- **Component-driven development with Storybook**
- **Automated code quality checks**
- **Pre-commit quality gates**
- **Production-oriented Docker builds**

---

## 📦 Main Dependencies

```json
{
  "@hookform/resolvers": "^5.8.0",
  "@tanstack/react-query": "^5.101.4",
  "framer-motion": "^13.1.0",
  "lucide-react": "^1.31.0",
  "next": "16.3.1",
  "react": "19.2.8",
  "react-dom": "19.2.8",
  "react-hook-form": "^7.85.0",
  "recharts": "^3.10.1",
  "zod": "^4.4.3"
}
```

---

## 💡 About the Mock API

FinFlow is a **frontend project**.

The API routes included in the repository exist only to provide a realistic asynchronous environment for frontend development.

They allow the interface to demonstrate behaviors such as:

- Loading states
- Error states
- Data fetching
- Mutations
- Cache invalidation
- Background refetching
- Runtime contract validation
- UI synchronization

They should not be interpreted as the project's intended backend architecture.

A production backend, authentication strategy, database, persistent storage, and infrastructure architecture are deliberately outside the scope of this repository.

This keeps the project focused on what it is designed to demonstrate:

> **Modern frontend engineering with React, Next.js and TypeScript.**

---

## 👤 Author

**Ismael Andrade**

GitHub: `@ismaelkentenich`

---

<div align="center">

## 💸 FinFlow

**Understand your money. Control your flow.**

Built with **Next.js • React • TypeScript**

</div>
