import { env } from '$env/dynamic/private'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'

const sqlite = new Database(env.DATABASE_URL || 'local.db')
export const db = drizzle(sqlite, { schema })

// Run migrations on startup
if (env.NODE_ENV === 'production' || env.DB_MIGRATE === 'true') {
  migrate(db, { migrationsFolder: 'drizzle' })
}
