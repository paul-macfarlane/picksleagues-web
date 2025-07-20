# PicksLeagues Web

This is the frontend for the PicksLeagues application, a platform for participating in sports pick'em leagues.

This project was bootstrapped with Vite and uses React, TypeScript, TanStack Router, TanStack Query, and Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Development Standards

All development should follow the guidelines outlined in the [**Development Standards Document (`STANDARDS.md`)**](./STANDARDS.md). This document includes conventions for directory structure, data fetching, state management, and more.

Please review it before contributing to the project.

## Task Management with `backlog.md`

This project uses [`backlog.md`](https://github.com/backlog-md/backlog-cli) for task management. All tasks are defined in the `backlog/tasks` directory.

### Common Commands

Here are a few common commands to get you started. You can also use the `npm` scripts below.

- **List all tasks:**

  ```bash
  backlog task list --plain
  ```

- **View a task's details:**

  ```bash
  backlog task <task-id> --plain
  ```

- **Create a new task:**

  ```bash
  backlog task create "Your task title"
  ```

- **Edit a task:**
  ```bash
  backlog task edit <task-id> --ac "New acceptance criteria"
  ```

For more information, please refer to the official `backlog.md` documentation or the guidelines in `.cursor-rules/backlog.md`.

### Web Interface

`backlog.md` also provides a web interface to visualize and manage tasks. To launch it, run:

```bash
npm run backlog:ui
```
