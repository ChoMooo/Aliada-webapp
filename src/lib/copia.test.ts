import { describe, it, expect, vi } from 'vitest';
vi.mock('../store', () => ({ getD: () => ({}), mut: () => {}, mergeData: (o: unknown) => o, useStore: { getState: () => ({ replace: () => {} }) } }));
vi.mock('./share', () => ({ downloadText: () => true }));
import { guardarEnDrive, leerDeDrive } from './copia';

const res = (body: unknown, ok = true, status = 200) => ({ ok, status, json: async () => body, text: async () => String(body) }) as unknown as Response;

describe('copia en Google Drive', () => {
  it('crea el archivo en el espacio privado si no existe', async () => {
    const f = vi.fn().mockResolvedValueOnce(res({ files: [] })).mockResolvedValueOnce(res({ id: 'nuevo' }));
    await guardarEnDrive('TK', '{"v":2}', f as unknown as typeof fetch);
    const [url, init] = f.mock.calls[1];
    expect(url).toContain('uploadType=multipart');
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer TK');
    expect(init.body).toContain('"parents":["appDataFolder"]');
    expect(init.body).toContain('{"v":2}');
  });
  it('actualiza el archivo si ya existe (no crea duplicados)', async () => {
    const f = vi.fn().mockResolvedValueOnce(res({ files: [{ id: 'abc', modifiedTime: 'x' }] })).mockResolvedValueOnce(res({}));
    await guardarEnDrive('TK', '{"v":2}', f as unknown as typeof fetch);
    expect(f.mock.calls[1][0]).toContain('/files/abc?uploadType=media');
    expect(f.mock.calls[1][1].method).toBe('PATCH');
  });
  it('avisa si Drive rechaza el pedido', async () => {
    const f = vi.fn().mockResolvedValueOnce(res({}, false, 401));
    await expect(guardarEnDrive('TK', '{}', f as unknown as typeof fetch)).rejects.toThrow('drive-401');
  });
  it('lee la copia guardada, o nada si no hay', async () => {
    const f = vi.fn().mockResolvedValueOnce(res({ files: [{ id: 'abc' }] })).mockResolvedValueOnce(res('{"v":2}'));
    expect(await leerDeDrive('TK', f as unknown as typeof fetch)).toBe('{"v":2}');
    const g = vi.fn().mockResolvedValueOnce(res({ files: [] }));
    expect(await leerDeDrive('TK', g as unknown as typeof fetch)).toBeNull();
  });
});
