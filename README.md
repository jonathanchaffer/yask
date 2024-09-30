# YASK (Yet Another Starter Kit)

Template repository for TypeScript applications. Mostly focuses on back-end code, with the ability to plug in whichever front-end framework you prefer.

## Features

- Caching with [Redis](https://redis.io/)
- Linting with [ESLint](https://eslint.org/)
- Unit testing with [Vitest](https://vitest.dev/)
- Formatting with [Prettier](https://prettier.io/)
- Development in [TypeScript](https://www.typescriptlang.org/)
- Pre-push checks with [Husky](https://typicode.github.io/husky/)
- ORM and migrations with [Drizzle](https://orm.drizzle.team/)
- Data persistence with [PostgreSQL](https://www.postgresql.org/)
- Local environment setup with [Docker](https://www.docker.com/)
- Hexagonal dependency injection context
- Continuous integration with [GitHub Actions](https://github.com/features/actions)
- Import restrictions with [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser)
- Random test data generation with [blueprints](src/db/blueprints/index.ts)
- Type-safe environment variable access with [Zod](https://zod.dev/)

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
- `test`: Run tests.
- `check`: Perform code checks (linting, formatting, type checking, etc).
- `fix`: Fix auto-fixable issues (linting, formatting).
- `clean`: Delete auto-generated files.
- `migrate`: Reset database; generate and run migrations.

## Directory structure

- [`src/`](src/): The source code for the application itself. Scripts, configurations, etc. that don't directly interact with the application should be put somewhere else.
  - [`app/`](src/app/): Code specific to your particular application. The template code here will likely be replaced with your own code, but the structure will remain the same.
    - [`context/`](src/app/context/): Dependency injection context(s) that define the ports and adapters for your application.
    - [`repositories/`](src/app/repositories/): Persistence-level "repositories" that retrieve and/or mutate database entities.
    - [`services/`](src/app/services): Data and logic "services" that serve as an abstraction between repositories and the front-end.
    - [`stores/`](src/app/stores/): Cache "stores" that help manage cached data in a type-safe way.
  - [`db/`](src/db/): Database schema, migrations, and helpers.
    - [`drizzle/`](src/db/drizzle/): Drizzle schema definition, migrations, and helpers.
    - [`blueprints/`](src/db/blueprints/): Helpers for generating test data in the database.
  - [`modules/`](src/modules/): Generic, non-application-specific utilities. Even though these are non-app-specific, you're free to customize and/or add to them to fit your needs, but keep them decoupled from application-specific logic.
    - [`cache/`](src/modules/cache/): Cache interface and implementations.
    - [`hexagonal/`](src/modules/hexagonal/): Hexagonal architecture implementation.
  - [`env.ts`](src/env.ts): Defines the expected shape of `process.env` and validates it at runtime so it can be accessed with type safety.
- [`dist/`](dist/): Compiled JavaScript files. This directory is generated by the `build` script and is not committed to the repository.
- [`node_modules/`](node_modules/): Node.js dependencies. This directory is generated by `npm install` and is not committed to the repository.
- [`.github/`](.github/): GitHub Actions workflows.
- [`.husky/`](.husky/): Husky configuration.
- [`.vscode/`](.vscode/): Visual Studio Code settings and recommended extensions.
