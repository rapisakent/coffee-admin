import { readFile, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Mock REST API backed by one JSON file ("mock/db.json") — runs inside `vite dev` and `vite preview`.
 *
 *   GET    /api/:name        whole collection (array) or document (object)
 *   POST   /api/:name        append { id, ... } to a collection        -> 201
 *   PATCH  /api/:name/:id    merge fields into one record               -> 200
 *   DELETE /api/:name/:id    drop one record                            -> 204
 *   PUT    /api/:name        merge fields into a document (object)      -> 200
 *
 * ponytail: single-process file DB for local work. Swap for the real backend by pointing
 * VITE_API_URL at it (see src/api/http.ts); this file can then be deleted.
 */
const PREFIX = '/api/';
const MAX_BODY = 1_000_000;

type Db = Record<string, unknown>;
type Json = Record<string, unknown>;

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

const isRecord = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);

async function readBody(req: IncomingMessage): Promise<Json> {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY) throw new HttpError(413, 'Payload quá lớn.');
    chunks.push(chunk as Buffer);
  }
  try {
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (isRecord(body)) return body;
  } catch {
    // fall through to the 400 below
  }
  throw new HttpError(400, 'Body phải là một JSON object.');
}

function send(res: ServerResponse, status: number, body?: unknown) {
  res.statusCode = status;
  if (body === undefined) return res.end();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

// Every write is also appended to this collection (GET only for clients).
const ACTIVITY = 'activity';
const ACTOR = 'Quản trị viên'; // no auth in the mock: the signed-in user is fixed

function logActivity(db: Db, module: string, action: 'create' | 'update' | 'delete', target: string) {
  const log = Array.isArray(db[ACTIVITY]) ? (db[ACTIVITY] as Json[]) : [];
  const next = log.reduce((max, e) => Math.max(max, Number(String(e.id).slice(3)) || 0), 0) + 1;
  const entry = { id: `NK-${String(next).padStart(4, '0')}`, at: new Date().toISOString(), module, action, target, actor: ACTOR };
  db[ACTIVITY] = [entry, ...log];
}

export function mockApi(file = 'mock/db.json'): Plugin {
  let path = resolve(file);
  // Writes run one at a time so concurrent requests cannot interleave read-modify-write.
  let queue: Promise<unknown> = Promise.resolve();
  const exclusive = <T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  };

  const load = async (): Promise<Db> => JSON.parse(await readFile(path, 'utf8')) as Db;
  const collection = (db: Db, name: string) => {
    const value = Object.hasOwn(db, name) ? db[name] : undefined;
    if (value === undefined) throw new HttpError(404, `Không có "${name}".`);
    return value;
  };
  const list = (db: Db, name: string): Json[] => {
    const value = collection(db, name);
    if (!Array.isArray(value)) throw new HttpError(405, `"${name}" không phải collection.`);
    return value as Json[];
  };

  async function handle(req: IncomingMessage, res: ServerResponse) {
    const [name = '', rawId, ...rest] = new URL(req.url ?? '', 'http://x').pathname.slice(PREFIX.length).split('/');
    if (!name || rest.length) throw new HttpError(404, 'Đường dẫn không hợp lệ.');
    const id = rawId === undefined ? undefined : decodeURIComponent(rawId);
    const method = req.method ?? 'GET';
    if (name === ACTIVITY && method !== 'GET') throw new HttpError(405, 'Nhật ký chỉ đọc.');

    if (method === 'GET' && id === undefined) return send(res, 200, collection(await load(), name));

    if (method === 'PUT' && id === undefined) {
      const patch = await readBody(req);
      return exclusive(async () => {
        const db = await load();
        const doc = collection(db, name);
        if (!isRecord(doc)) throw new HttpError(405, `"${name}" không phải document.`);
        db[name] = { ...doc, ...patch };
        logActivity(db, name, 'update', name);
        await writeFile(path, JSON.stringify(db, null, 2) + '\n');
        send(res, 200, db[name]);
      });
    }

    if (method === 'POST' && id === undefined) {
      const item = await readBody(req);
      const newId = item.id;
      if (typeof newId !== 'string' || !newId) throw new HttpError(400, 'Thiếu "id".');
      return exclusive(async () => {
        const db = await load();
        const items = list(db, name);
        if (items.some((i) => i.id === newId)) throw new HttpError(409, `"${newId}" đã tồn tại.`);
        db[name] = [item, ...items];
        logActivity(db, name, 'create', newId);
        await writeFile(path, JSON.stringify(db, null, 2) + '\n');
        send(res, 201, item);
      });
    }

    if ((method === 'PATCH' || method === 'DELETE') && id !== undefined) {
      const patch = method === 'PATCH' ? await readBody(req) : undefined;
      return exclusive(async () => {
        const db = await load();
        const items = list(db, name);
        const index = items.findIndex((i) => i.id === id);
        if (index < 0) throw new HttpError(404, `Không thấy "${id}".`);
        const updated = patch ? { ...items[index], ...patch, id } : undefined;
        db[name] = updated ? items.map((i, n) => (n === index ? updated : i)) : items.filter((_, n) => n !== index);
        logActivity(db, name, updated ? 'update' : 'delete', id);
        await writeFile(path, JSON.stringify(db, null, 2) + '\n');
        send(res, updated ? 200 : 204, updated);
      });
    }

    throw new HttpError(405, 'Method không được hỗ trợ.');
  }

  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.startsWith(PREFIX)) return next();
    handle(req, res).catch((e: unknown) => {
      const status = e instanceof HttpError ? e.status : 500;
      send(res, status, { message: e instanceof Error ? e.message : 'Lỗi máy chủ.' });
    });
  };

  return {
    name: 'coffee-mock-api',
    configResolved: (config) => {
      path = resolve(config.root, file);
    },
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}
