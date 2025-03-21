import { db } from '$lib/server/db/index.js';
import { urlClicks, urls } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const dbUrls = await db
		.select({
			slug: urls.slug,
			destination: urls.destination,
			createdAt: urls.createdAt,
			expiresAt: urls.expiresAt,
			clicks:
				sql<number>`(select count(*) from ${urlClicks} where ${urlClicks.urlSlug} = ${urls.slug})::int`.as(
					'clicks'
				)
		})
		.from(urls)
		.where(eq(urls.userId, locals.user.id));

	return {
		urls: dbUrls
	};
};
