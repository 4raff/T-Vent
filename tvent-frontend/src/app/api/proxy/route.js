import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const { endpoint, method = 'GET', body = null, skipAuth = false, token: tokenFromBody } = await req.json();

        const cookieToken = cookies().get('auth')?.value;
        const token = tokenFromBody || cookieToken;

        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        if (!skipAuth && token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${process.env.TVEBT_BACKEND_API_URL}/${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
            cache: 'no-store',
        });

        let data;
        try {
            data = await res.json();
        } catch {
            data = { message: 'Invalid JSON response from backend' };
        }

        return Response.json(data, { status: res.status });
    } catch (err) {
        console.error('Proxy error:', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}