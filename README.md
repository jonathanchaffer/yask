# TypeScript Starter Kit

Template repository for TypeScript applications. Mostly focuses on back-end code, with the ability to plug in whichever front-end framework you prefer.

## Features

- Development in [TypeScript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Local environment setup with [Docker](https://www.docker.com/)
- Unit testing with [Vitest](https://vitest.dev/)
- Caching with [Redis](https://redis.io/)

## Local development setup

1. Install dependencies: `npm install`
2. Start Docker: `docker-compose up -d`
3. Start development server: `npm run dev`

## `package.json` scripts

Scripts are organized as parent and child commands, separated by `:` (e.g. `test` and `test:unit`). Parent commands utilize `npm-run-all` to run all child commands in parallel or sequentially. Parent commands are listed here:

- `build`: Build the project. This template uses `tsc` to compile TypeScript files to JavaScript. Depending on your project, you might replace this with a different build tool.
- `start`: Start the project using the compiled JavaScript files.
- `dev`: Start the project in development mode. This template watches for changes in the TypeScript files and restarts the server when a change is detected.
- `test`: Run tests. This template uses [Vitest](https://vitest.dev/).
- `check`: Perform code checks (linting, formatting, type checking).
- `clean`: Delete auto-generated files. In this template, it deletes the `dist` and `node_modules` directories.
