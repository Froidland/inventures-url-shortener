import { sql } from 'drizzle-orm';
import { index, pgTable } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const users = pgTable(
	'users',
	(t) => ({
		id: t
			.text()
			.$default(() => ulid())
			.primaryKey(),
		email: t.text().notNull().unique(),
		hashedPassword: t.text().notNull(),
		createdAt: t
			.timestamp({
				withTimezone: true,
				mode: 'date'
			})
			.notNull()
			.defaultNow(),
		updatedAt: t
			.timestamp({
				withTimezone: true,
				mode: 'date'
			})
			.$onUpdate(() => new Date())
	}),
	(self) => [index('users_email_idx').on(self.email)]
);

export const sessions = pgTable('sessions', (t) => ({
	id: t.text().primaryKey(),
	userId: t
		.text()
		.notNull()
		.references(() => users.id),
	expiresAt: t.timestamp({ withTimezone: true, mode: 'date' }).notNull()
}));

export const urls = pgTable(
	'urls',
	(t) => ({
		slug: t.text().primaryKey(),
		destination: t.text().notNull(),
		userId: t.text().references(() => users.id, {
			onDelete: 'set null'
		}),
		createdAt: t.timestamp({ mode: 'date' }).notNull().defaultNow(),
		expiresAt: t
			.timestamp({ mode: 'date' })
			.notNull()
			.default(sql`now() + interval '3 days'`)
	}),
	(t) => [index('url_to_user_id_index').on(t.userId)]
);

export const urlClicks = pgTable('url_clicks', (t) => ({
	id: t.bigint({ mode: 'bigint' }).generatedAlwaysAsIdentity().primaryKey(),
	urlSlug: t.text().references(() => urls.slug, {
		onDelete: 'restrict'
	}),
	ip: t.text(),
	country: t.text(),
	city: t.text(),
	createdAt: t.timestamp({ mode: 'date' }).notNull().defaultNow()
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;
