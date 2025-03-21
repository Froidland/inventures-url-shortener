import ky from 'ky';
import type { TCreateUrlResponseData, TRegisterResponseData } from './types';

export const api = Object.freeze({
	client: ky.create({
		credentials: 'include',
		retry: 3
	}),
	createUrl: async (destination: string, slug?: string) => {
		const data = await api.client
			.post('/api/urls', {
				json: {
					destination,
					slug: slug || null
				}
			})
			.json<TCreateUrlResponseData>();

		return {
			...data,
			expiresAt: new Date(data.expiresAt)
		};
	},
	login: async (email: string, password: string) => {
		const encodedPassword = btoa(password);

		return await api.client.post('/api/auth/login', {
			json: {
				email,
				password: encodedPassword
			}
		});
	},
	register: async (email: string, password: string) => {
		const encodedPassword = btoa(password);

		return await api.client
			.post('/api/auth/register', {
				json: {
					email,
					password: encodedPassword
				}
			})
			.json<TRegisterResponseData>();
	}
});

export type TApi = typeof api;
