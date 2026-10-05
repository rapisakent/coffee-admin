import axios, { isAxiosError } from 'axios';

/** The only place that talks to the network. Point VITE_API_URL at a real backend to replace the mock. */
const client = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined) ?? '/api',
  timeout: 15_000,
});

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

export async function http<T>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, body?: unknown): Promise<T> {
  try {
    const res = await client.request<T>({ method, url: path, data: body });
    return res.status === 204 ? (undefined as T) : res.data;
  } catch (e) {
    if (!isAxiosError<{ message?: string }>(e)) throw e;
    if (!e.response) throw new ApiError(0, 'Không kết nối được máy chủ.');
    throw new ApiError(e.response.status, e.response.data?.message ?? `Lỗi ${e.response.status}`);
  }
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Đã có lỗi xảy ra.');
