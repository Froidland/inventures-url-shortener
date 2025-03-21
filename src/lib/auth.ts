import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './server/db';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export function requireLogin(redirectTo: `/${string}` = '/login') {
	const event = getRequestEvent();

	if (!event.locals.user || !event.locals.session) {
		redirect(302, redirectTo);
	}

	return {
		user: event.locals.user,
		session: event.locals.session
	};
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true
	}),
	emailAndPassword: {
		enabled: true
	}
});
