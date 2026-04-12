# futbol.erkut.dev

A minimalist football management application built with SvelteKit and Drizzle ORM.

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: SQLite (via `better-sqlite3`)
- **Styling**: TailwindCSS & DaisyUI v5
- **Linting**: `@antfu/eslint-config`
- **Deployment**: Docker Compose (Coolify ready)

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up the database:
   ```bash
   npm run db:push
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured for deployment with Docker Compose.

```bash
docker compose up -d
```

## License

MIT
