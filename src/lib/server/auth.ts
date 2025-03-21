import { redirect, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { encodeBase64url } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import { sessions, users, type Session } from './db/schema';
import { getRequestEvent } from '$app/server';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const auth = Object.freeze({
	SESSION_COOKIE_NAME: 'auth-session',
	generateSessionToken: () => {
		const bytes = crypto.getRandomValues(new Uint8Array(18));
		const token = encodeBase64url(bytes);
		return token;
	},
	createSession: async (token: string, userId: string) => {
		const session: Session = {
			id: token,
			userId,
			expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
		};
		await db.insert(sessions).values(session);
		return session;
	},
	validateSessionToken: async (token: string) => {
		const [result] = await db
			.select({
				user: { id: users.id, email: users.email },
				session: sessions
			})
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(eq(sessions.id, token));

		if (!result) {
			return { session: null, user: null };
		}
		const { session, user } = result;

		const sessionExpired = Date.now() >= session.expiresAt.getTime();
		if (sessionExpired) {
			await db.delete(sessions).where(eq(sessions.id, session.id));
			return { session: null, user: null };
		}

		const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
		if (renewSession) {
			session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
			await db
				.update(sessions)
				.set({ expiresAt: session.expiresAt })
				.where(eq(sessions.id, session.id));
		}

		return { session, user };
	},
	invalidateSession: async (sessionId: string) => {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
	},
	setSessionTokenCookie: (event: RequestEvent, token: string, expiresAt: Date) => {
		event.cookies.set(auth.SESSION_COOKIE_NAME, token, {
			expires: expiresAt,
			path: '/',
			secure: true,
			httpOnly: true
		});
	},
	deleteSessionTokenCookie: (event: RequestEvent) => {
		event.cookies.delete(auth.SESSION_COOKIE_NAME, {
			path: '/'
		});
	},
	requireUser: (redirectTo: `/${string}` = '/login') => {
		const event = getRequestEvent();

		if (!event.locals.user || !event.locals.session) {
			redirect(302, redirectTo);
		}

		return {
			user: event.locals.user,
			session: event.locals.session
		};
	}
});

export type SessionValidationResult = Awaited<ReturnType<typeof auth.validateSessionToken>>;
