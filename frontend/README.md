# 🏆 Tournament Manager — Frontend

A modern, dark-themed tournament management application built with **React**, **TypeScript**, and **Material UI**. Create tournaments, manage teams, handle registrations, track matches, and coordinate members — all through a polished, modal-driven interface.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture & Patterns](#architecture--patterns)
- [Custom Hooks](#custom-hooks)
- [Theming](#theming)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [API Proxy](#api-proxy)
- [License](#license)

---

## Tech Stack

| Category          | Technology                                                    |
| ----------------- | ------------------------------------------------------------- |
| **Framework**     | [React 18](https://react.dev/)                                |
| **Language**      | [TypeScript 5](https://www.typescriptlang.org/)               |
| **Build Tool**    | [Vite 5](https://vitejs.dev/)                                 |
| **UI Library**    | [MUI (Material UI) 6](https://mui.com/)                       |
| **Icons**         | [Gravity UI Icons](https://gravity-ui.com/icons)              |
| **Date Handling** | [Day.js](https://day.js.org/) + MUI X Date Pickers            |
| **Routing**       | [React Router 6](https://reactrouter.com/)                    |
| **Testing**       | [Vitest](https://vitest.dev/) + React Testing Library + jsdom |
| **Linting**       | ESLint (Google config) + Prettier                             |

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A running backend server on `http://localhost:3000` (see [API Proxy](#api-proxy))

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`** by default.

---

## Available Scripts

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start the Vite dev server with HMR             |
| `npm run build`    | Type-check with `tsc` and build for production |
| `npm run preview`  | Preview the production build locally           |
| `npm run test`     | Run unit tests with Vitest (watch mode)        |
| `npm run coverage` | Run tests and generate a coverage report       |
| `npm run lint`     | Run ESLint across the codebase                 |
| `npm run format`   | Format all files with Prettier                 |
| `npm run check`    | Run Prettier, ESLint, and Vitest sequentially  |

---

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Shared, reusable UI components
│   ├── Header/          #   App header with navigation & admin modals
│   ├── MatchItem/       #   Match card component
│   ├── TournamentItem/  #   Tournament card component
│   ├── SearchBar.tsx    #   Reusable search input
│   ├── Tabs.tsx         #   Tab navigation component
│   └── ...
├── contexts/            # React Context providers
│   ├── ModalContext      #   Global modal state management
│   ├── SnackbarContext   #   Toast notification system
│   ├── UserContext       #   Authentication & user session
│   ├── NotificationContext # Real-time notifications
│   └── TournamentModalContext
├── hooks/               # Custom React hooks
│   ├── useApi            #   API call wrapper with optimistic updates
│   ├── useModal          #   Access the global modal
│   ├── useSnackbar       #   Trigger snackbar notifications
│   ├── useTournaments    #   Tournament CRUD operations
│   ├── useTeams          #   Team CRUD operations
│   ├── useMembers        #   Member management
│   └── ...
├── modals/              # Standalone modal components
│   └── TournamentModal/ #   Create/edit tournament modal
├── pages/               # Route-level page components
│   ├── HomePage/        #   Tournament listing with filters
│   ├── TournamentPage/  #   Tournament detail view (matches, teams)
│   ├── TeamsPage/       #   Team listing with search
│   ├── TeamPage/        #   Team detail view (members, join requests)
│   ├── ProfilePage/     #   User profile & settings
│   ├── RegisterPage/    #   User registration
│   ├── LoginPage.tsx    #   User login
│   └── NotificationsPage.tsx
├── tests/               # Unit tests
├── utils/               # Utility functions
│   ├── tournamentUtils  #   Tournament filtering & grouping
│   ├── matchUtils       #   Match data transformations
│   ├── date             #   Date formatting helpers
│   ├── session          #   Session/token management
│   └── passwordRules    #   Password validation rules
├── types.ts             # Shared TypeScript type definitions
├── themes.tsx           # MUI theme configuration
├── App.tsx              # Root application layout
└── main.tsx             # Application entry point & router setup
```

---

## Architecture & Patterns

### Modal-Driven Actions

The app follows a **modal-first pattern** for all user interactions (create, update, delete, confirm). A global `ModalContext` renders a single `<Dialog>` at the root, and any component can trigger it:

```tsx
const { openModal } = useModal();

openModal({
  title: 'Delete Tournament',
  subtitle: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  confirmColor: 'error',
  children: <p>Are you sure?</p>,
  onConfirm: (close) => {
    // perform action, then close()
  },
});
```

A companion `ModalControllerContext` allows modal _content_ components to control the modal's loading state, disabled state, and error messages from within.

### Snackbar Notifications

User feedback is handled via `SnackbarContext` — a global toast system with configurable severity, duration, and position:

```tsx
const { showSnackbar } = useSnackbar();

showSnackbar({ message: 'Tournament created!', severity: 'success' });
```

### API Layer (`useApi`)

All data mutations and queries go through the `useApi` hook, which provides:

- **Optimistic UI updates** — UI reflects changes instantly via `onOptimism`
- **Automatic rollback** — reverts state on failure via `onRollback`
- **Loading / error state** — tracked automatically
- **Stable references** — safe to use in `useEffect` dependencies

```tsx
const { loading, execute } = useApi(
  (data) =>
    fetch('/api/tournaments', { method: 'POST', body: JSON.stringify(data) }),
  {
    onOptimism: (data) => {
      /* instant UI update */
    },
    onSuccess: (result) => {
      /* confirm with server data */
    },
    onRollback: () => {
      /* revert on failure */
    },
    onError: (err) => showSnackbar({ message: err.message, severity: 'error' }),
  },
);
```

### Context Provider Hierarchy

Providers are layered in `main.tsx` to ensure correct dependency ordering:

```
LocalizationProvider → ThemeProvider → SnackbarProvider → ModalContextProvider → UserContextProvider → RouterProvider
```

---

## Custom Hooks

| Hook                  | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `useApi`              | Generic async operation wrapper with optimistic UI          |
| `useModal`            | Open/close the global confirmation modal                    |
| `useModalController`  | Control modal state (loading, disabled, error) from content |
| `useSnackbar`         | Show toast notifications                                    |
| `useUser`             | Access authenticated user context                           |
| `useTournaments`      | Tournament CRUD, filtering, and grouping                    |
| `useTournamentModal`  | Tournament-specific modal state                             |
| `useTeams`            | Team CRUD and search                                        |
| `useMembers`          | Member management (promote, ban, etc.)                      |
| `useJoinRequests`     | Team join request handling                                  |
| `useNotifications`    | Notification fetching and read state                        |
| `useUnavailabilities` | User availability/unavailability management                 |
| `useSpecialties`      | Fetch user specialties                                      |
| `useProfilePictures`  | Fetch available profile pictures                            |
| `useMenuDisclosure`   | Anchor-based menu open/close state                          |
| `useScrollIndicator`  | Track scroll position for fade indicators                   |

---

## Theming

The application uses a fully **custom dark theme** defined in `themes.tsx`, featuring:

- **Surface elevation system** — 5 levels (`s0`–`s4`) for layered depth
- **Custom color palette** — primary blue (`#0088F6`), semantic colors for success/warning/error
- **Typography** — Google Sans / Roboto font stack
- **Heavily styled MUI components** — Buttons, Chips, Dialogs, TextFields, Autocomplete, Tabs, Skeletons, etc. are all customized to match the design system
- **Custom breakpoints** — includes a `desktop` breakpoint at `72rem`
- **Gravity UI icons** — integrated as default icons for MUI components (Autocomplete clear/popup, Chip delete, etc.)

---

## Testing

Tests are written with **Vitest** and **React Testing Library**, running in a `jsdom` environment.

```bash
# Run tests in watch mode
npm run test

# Run tests with coverage
npm run coverage
```

Test files live in `src/tests/` and cover:

- Custom hooks (`useApi`, `useTeams`, `useTournaments`, `useMembers`, etc.)
- Context providers (`ModalContext`, `SnackbarContext`, `UserContext`, `NotificationContext`)
- Component behavior (`CreateTeamModalContent`)

---

## Code Quality

| Tool                    | Config File      | Purpose                                                         |
| ----------------------- | ---------------- | --------------------------------------------------------------- |
| **ESLint**              | `.eslintrc.cjs`  | Linting with Google + TypeScript + React rules                  |
| **Prettier**            | `.prettierrc`    | Code formatting (single quotes, trailing commas, 80 char width) |
| **TypeScript**          | `tsconfig.json`  | Strict type checking                                            |
| **vite-plugin-checker** | `vite.config.ts` | Real-time TypeScript checking during dev                        |

---

## API Proxy

In development, the Vite dev server proxies all `/api` requests to `http://localhost:3000`:

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

Ensure your backend is running on port **3000** before starting the frontend.

---

## License

This project is part of a school curriculum (CAE). All rights reserved.
