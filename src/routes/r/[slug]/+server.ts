import { cache } from '$lib/server/cache.js';
import { db } from '$lib/server/db/index.js';
import { urlClicks } from '$lib/server/db/schema.js';
import { getRequestCity, getRequestCountry, getRequestIP } from '$lib/server/utils/requests';
import { error } from '@sveltejs/kit';

export const GET = async ({ params, request, getClientAddress }) => {
	const { slug } = params;

	const url = await cache.getOrSet({
		key: slug,
		factory: async ({ skip }) => {
			const dbUrl = await db.query.urls.findFirst({
				where: {
					slug: slug
				},
				columns: {
					destination: true,
					expiresAt: true
				}
			});

			if (!dbUrl) {
				return skip();
			}

			return dbUrl;
		}
	});

	if (!url) {
		error(404, "Couldn't find the URL");
	}

	if (url.expiresAt < new Date()) {
		error(410, 'This URL has expired');
	}

	// Fire and forget in order to not block the request
	db.insert(urlClicks)
		.values({
			urlSlug: slug,
			ip: getRequestIP(request, getClientAddress()),
			country: getRequestCountry(request),
			city: getRequestCity(request)
		})
		.catch(console.error);

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.destination
		}
	});
};
