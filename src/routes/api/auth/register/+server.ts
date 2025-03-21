import { db } from '$lib/server/db/index.js';
import { json, redirect } from '@sveltejs/kit';
import { ArkErrors, type } from 'arktype';
import * as argon from 'argon2';
import { users } from '$lib/server/db/schema.js';
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

	const existingUser = await db.query.users.findFirst({
		where: {
			email: data.email
		},
		columns: {
			id: true
		}
	});

	if (existingUser) {
		return json(
			{
				error: 'email already in use'
			},
			{
				status: 400
			}
		);
	}

	try {
		const hashedPassword = await argon.hash(atob(data.password));
		const [newUser] = await db
			.insert(users)
			.values({
				email: data.email,
				hashedPassword
			})
			.returning({
				id: users.id,
				email: users.email
			});

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, newUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return json(newUser, {
			status: 201
		});
	} catch (err) {
		console.error(err);
		return json(
			{ error: 'Failed to create the user' },
			{
				status: 500
			}
		);
	}
};
