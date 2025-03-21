import { db } from '$lib/server/db/index.js';
import { urls } from '$lib/server/db/schema.js';
import { generateRandomString, type RandomReader } from '@oslojs/crypto/random';
import { json } from '@sveltejs/kit';
import { ArkErrors, type } from 'arktype';

const SLUG_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const random: RandomReader = {
	read(bytes) {
		crypto.getRandomValues(bytes);
	}
};
function generateSlug(length = 8) {
	return generateRandomString(random, SLUG_ALPHABET, length);
}

const PostSchema = type({
	slug: 'string.alphanumeric <= 32 | null',
	destination: 'string.url'
});
type TPostSchema = typeof PostSchema.infer;
export const POST = async ({ request, locals }) => {
	let data: TPostSchema | ArkErrors;
	try {
		const json = await request.json();
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
			{ error: data.summary },
			{
				status: 400
			}
		);
	}

	const { slug, destination } = data;

	if (slug && !locals.user) {
		return json(
			{
				error: 'You must be logged in to create a URL with a custom slug'
			},
			{
				status: 401
			}
		);
	}

	try {
		const [url] = await db
			.insert(urls)
			.values({
				slug: slug || generateSlug(),
				destination,
				userId: locals.user?.id
			})
			.returning({
				slug: urls.slug,
				destination: urls.destination,
				expiresAt: urls.expiresAt
			});

		return json(url, {
			status: 201
		});
	} catch (err) {
		console.error(err);
		return json(
			{ error: 'Failed to create the URL' },
			{
				status: 500
			}
		);
	}
};
