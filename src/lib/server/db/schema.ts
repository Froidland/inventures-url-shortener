import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', (t) => ({
	id: t.bigint({ mode: 'bigint' }).generatedAlwaysAsIdentity().primaryKey(),
	age: t.integer()
}));
