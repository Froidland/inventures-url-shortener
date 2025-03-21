import { sql } from 'drizzle-orm';
import { index, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	email: t.text().notNull().unique(),
	emailVerified: t.boolean().notNull(),
	image: t.text(),
	createdAt: t.timestamp().notNull(),
	updatedAt: t.timestamp().notNull()
}));

export const sessions = pgTable('sessions', (t) => ({
	id: t.text().primaryKey(),
	expiresAt: t.timestamp().notNull(),
	token: t.text().notNull().unique(),
	createdAt: t.timestamp().notNull(),
	updatedAt: t.timestamp().notNull(),
	ipAddress: t.text(),
	userAgent: t.text(),
	userId: t
		.text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
}));

export const accounts = pgTable('accounts', (t) => ({
	id: t.text().primaryKey(),
	accountId: t.text().notNull(),
	providerId: t.text().notNull(),
	userId: t
		.text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accessToken: t.text(),
	refreshToken: t.text(),
	idToken: t.text(),
	accessTokenExpiresAt: t.timestamp(),
	refreshTokenExpiresAt: t.timestamp(),
	scope: t.text(),
	password: t.text(),
	createdAt: t.timestamp().notNull(),
	updatedAt: t.timestamp().notNull()
}));

export const verifications = pgTable('verifications', (t) => ({
	id: t.text().primaryKey(),
	identifier: t.text().notNull(),
	value: t.text().notNull(),
	expiresAt: t.timestamp().notNull(),
	createdAt: t.timestamp(),
	updatedAt: t.timestamp()
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
