import { test } from 'node:test';
import assert from 'node:assert/strict';
import { urlAnalisis } from '../src/analisis-url.js';

test('URL del dashboard: HTTPS y tema; nunca credenciales ni parametros privados', () => {
  const url = new URL(urlAnalisis('https://agrovalle.example.invalid', 'dark'));
  assert.equal(url.searchParams.get('embed'), 'true');
  assert.equal(url.searchParams.get('embed_options'), 'dark_theme');
  for (const base of ['', 'javascript:alert(1)', 'http://remoto.example', 'https://user:pass@example.com', 'https://example.com?token=privado', 'https://example.com/#privado']) {
    assert.equal(urlAnalisis(base, 'light'), null);
  }
  assert.ok(urlAnalisis('http://127.0.0.1:8501', 'light').includes('light_theme'));
});
