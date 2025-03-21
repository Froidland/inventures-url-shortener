import type { TApi } from './client';

export type TCreateUrlResponseData = {
	slug: string;
	destination: string;
	expiresAt: string;
};
export type TCreateUrlData = Awaited<ReturnType<TApi['createUrl']>>;

export type TRegisterResponseData = {
	id: string;
	email: string;
};
