import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.ORCA_POSTGRES_URL);

export const orcaDb = drizzle(queryClient);