import { auth } from '$lib/server/auth.js';

export const GET = async (event) => {
	const { session } = auth.requireUser('/');

	await auth.invalidateSession(session.id);
	auth.deleteSessionTokenCookie(event);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
};
