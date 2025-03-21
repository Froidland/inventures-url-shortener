import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const betterAuthHandler: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth });
};

const localsAuthHandler: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	event.locals.session = session?.session;
	event.locals.user = session?.user;

	const response = await resolve(event);

	return response;
};

export const handle = sequence(betterAuthHandler, localsAuthHandler);
