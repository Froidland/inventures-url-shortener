export function getRequestIP(request: Request, fallback: string | null = null) {
	return (
		request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || fallback
	);
}

export function getRequestCountry(request: Request) {
	return request.headers.get('cf-ipcountry') || request.headers.get('geoip-country') || null;
}

export function getRequestCity(request: Request) {
	return request.headers.get('cf-ipcity') || request.headers.get('geoip-city') || null;
}
