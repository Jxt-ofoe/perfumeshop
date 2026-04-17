import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Fallback to a dummy in-memory URL if running at build time without env vars.
// The actual queries will fail if executed during build without env, but it avoids
// the initial instantiation crash from `@libsql/client` validating the URL.
const url = process.env.TURSO_DATABASE_URL || 'file:memory.db';

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
