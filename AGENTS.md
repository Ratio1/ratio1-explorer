# Repository Guidelines

## Project Structure & Module Organization
Routes live in `app/` (e.g., `app/stats`, `app/accounts`); server-only logic stays under `app/server-components/**`. Shared UI components go in `components/`, domain helpers in `lib/`, and blockchain metadata in `blockchain/` with matching types in `typedefs/`. Static assets reside in `public/`, design tokens in `styles/`, and automation scripts in `scripts/`.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Start the UI via `npm run dev` (mainnet defaults) or `npm run dev:{network}` to load the corresponding `.env.production.*` file through `dotenv-cli`. Build bundles with `npm run build` or `npm run build:{network}`; `npm run build:all` compiles every target. Run `npm run lint` before commits.

## Coding Style & Naming Conventions
TypeScript is the baseline. ESLint (`eslint.config.mjs`) and Prettier (`prettier-plugin-tailwindcss`) manage formatting—use `npm run lint` or `npx prettier --check .` instead of manual edits. Follow Prettier defaults (two-space indentation, semicolons, single quotes). Components, hooks, and contexts use `PascalCase`; utilities and functions use `camelCase`. Keep route folders lower-case.

## Testing Guidelines
Automated tests are not yet checked in, so linting plus manual validation gate releases. When you add tests, colocate specs as `*.test.tsx` or `*.spec.ts` near the feature (or in a local `__tests__/` folder) and lean on React Testing Library for UI behaviour. Mock blockchain calls with helpers from `lib/api`. Document manual verification in PRs until an automated suite lands.

## Commit & Pull Request Guidelines
Commits follow a Conventional Commits style (`fix:`, `hotfix:`, `cleanup:`); keep subjects under 70 characters and add scopes when useful (`feat(accounts): add filters`). Before opening a PR, ensure `npm run lint` passes and builds succeed when relevant. PRs should explain intent, link issues with `Closes #id`, list affected routes/APIs, attach UI screenshots, and record manual checks or follow-ups.

## Security & Configuration Tips
Never commit secrets; `.env.production.*` values should come from secure storage. Use the provided Dockerfiles for reproducible devnet/testnet/mainnet setups. Prefer scripts in `scripts/` when seeding or syncing blockchain data so production services stay clean, and remove temporary credentials after debugging.
