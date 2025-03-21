import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	users: {
		sessions: r.many.sessions({
			from: r.users.id,
			to: r.sessions.userId
		})
	},
	sessions: {
		user: r.one.users({
			from: r.sessions.userId,
			to: r.users.id,
			optional: false
		})
	},
	urls: {
		user: r.one.users({
			from: r.urls.userId,
			to: r.users.id,
			optional: true
		}),
		clicks: r.many.urlClicks({
			from: r.urls.slug,
			to: r.urlClicks.urlSlug,
		}),
	}
}));
