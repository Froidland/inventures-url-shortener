import { db } from '$lib/server/db/index.js';
import { json, redirect } from '@sveltejs/kit';
import { ArkErrors, type } from 'arktype';
import * as argon from 'argon2';
import { auth } from '$lib/server/auth.js';

const PostSchema = type({
	email: 'string.email',
	password: 'string'
});
type TPostSchema = typeof PostSchema.infer;
export const POST = async (event) => {
	if (event.locals.user) {
		redirect(302, '/');
	}

	let data: TPostSchema | ArkErrors;
	try {
		const json = await event.request.json();
		data = PostSchema(json);
	} catch (err) {
		console.error(err);
		return json(
			{ error: 'invalid json' },
			{
				status: 400
			}
		);
	}

	if (data instanceof ArkErrors) {
		return json(
			{
				error: data.summary
			},
			{
				status: 400
			}
		);
	}

	const user = await db.query.users.findFirst({
		where: {
			email: data.email
		},
		columns: {
			id: true,
			email: true,
			hashedPassword: true
		}
	});

	if (!user) {
		return json(
			{
				error: 'invalid email or password'
			},
			{
				status: 400
			}
		);
	}

	const passwordMatch = await argon.verify(user.hashedPassword, atob(data.password));
	if (!passwordMatch) {
		return json(
			{
				error: 'invalid email or password'
			},
			{
				status: 400
			}
		);
	}

	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, user.id);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 200
	});
};
