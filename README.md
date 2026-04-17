# Futbol Lineup Builder

A modern, premium football match and lineup management application. Built for speed, aesthetics, and ease of use.

## 🚀 App Features

- **Dynamic Lineup Builder**: Create and customize football team lineups with an intuitive drag-and-drop-like interface.
- **Match Management**: Save, track, and manage your football matches and teams.
- **Instant Sharing**: Export your custom lineups as high-quality images (PNG) to share with your friends or teammate.
- **Premium Design**: A stunning, modern UI built with sleek dark modes, vibrant accents, and smooth animations.
- **Mobile First**: Fully responsive design optimized for seamless use on smartphones and tablets.
- **Reliable Persistence**: Uses a combination of server-side SQLite (Drizzle ORM) and client-side browser storage (Svelte Persisted Store).

## 🛠️ Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) & [SvelteKit 2](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/)
- **Database / ORM**: [Drizzle ORM](https://orm.drizzle.team/) with [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- **State Management**: [Svelte Runes](https://svelte.dev/blog/runes) & [Svelte Persisted Store](https://github.com/joshua-berry/svelte-persisted-store)
- **Icons**: [Lucide Svelte](https://lucide.dev/)
- **Image Generation**: [html-to-image](https://github.com/tsayen/html-to-image)
- **Deployment**: Docker & Docker Compose

## 💻 Development

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Database Setup**:
   Initialize your local SQLite database with Drizzle:

   ```bash
   npm run db:push
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🐳 Deployment

The application is containerized and ready for deployment using Docker.

```bash
docker compose up -d --build
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
