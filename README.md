# TypeScript Starter Kit

Template repository for TypeScript applications. Mostly focuses on back-end code, with the ability to plug in whichever front-end framework you prefer.

## Features

- Development in [TypeScript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Local environment setup with [Docker](https://www.docker.com/)
- Unit testing with [Vitest](https://vitest.dev/)
- Caching with [Redis](https://redis.io/) caching
- Data persistence with [PostgreSQL](https://www.postgresql.org/)
- ORM and migrations with [Drizzle](https://orm.drizzle.team/)
- Hexagonal dependency injection context

## Local development setup

1. Install [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/)
1. Install [Visual Studio Code](https://code.visualstudio.com/)
1. Clone this repository and open it in Visual Studio Code
1. Install recommended extensions when prompted
1. Setup local environment: `cp .env.example .env`
1. Start Docker: `docker-compose up -d`
1. Install dependencies: `npm install`
1. Setup database: `npm run migrate`
1. Start development server: `npm run dev`

## `package.json` scripts

Scripts are organized as parent and child commands, separated by `:` (e.g. `test` and `test:unit`). Parent commands utilize `npm-run-all` to run all child commands in parallel or sequentially. Parent commands are listed here:

- `build`: Build the project. This template uses `tsc` to compile TypeScript files to JavaScript. Depending on your project, you might replace this with a different build tool.
- `start`: Start the project using the compiled JavaScript files.
- `dev`: Start the project in development mode. This template watches for changes in the TypeScript files and restarts the server when a change is detected.
- `test`: Run tests. This template uses [Vitest](https://vitest.dev/).
- `check`: Perform code checks (linting, formatting, type checking).
- `clean`: Delete auto-generated files. In this template, it deletes the `dist` and `node_modules` directories.
- `migrate`: Reset database; generate and run migrations. This template uses [Drizzle](https://orm.drizzle.team/).

## Directory structure

- `.github/`: GitHub Actions workflows.
- `.vscode/`: Visual Studio Code settings and recommended extensions.
- `src/`: Contains all the source code for the application itself. Scripts, configurations, etc. that don't directly interact with the application should be put somewhere else.
  - `db/`: Contains all database-related code for the application.
  - `modules/`: Contains generic, non-application-specific modules that can be used across different parts of the codebase.
    - `cache/`: Cache interface and implementatios in Redis and in-memory.
    - `hexagonal/`: Hexagonal architecture implementation.
  - `logic/`: Contains the business logic of the application.
