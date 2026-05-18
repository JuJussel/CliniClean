import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const orcaClient = postgres(process.env.ORCA_POSTGRES_URL);

export const orcaDb = drizzle(orcaClient);