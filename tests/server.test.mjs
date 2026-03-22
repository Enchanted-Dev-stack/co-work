import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createAppServer } from '../server.js';

async function withServer(run) {
  process.env.NODE_ENV = 'test';
  const server = createAppServer();
  server.listen(0);
  await once(server, 'listening');

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

test('GET /api/health returns foundation health payload', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.status, 'ok');
    assert.equal(payload.service, 'co-work');
    assert.equal(payload.metrics.groupCount, 3);
  });
});

test('GET /api/blueprint returns workspace blueprint data', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/blueprint`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.workspace.name, 'Acme Startup');
    assert.equal(payload.roadmap.length, 3);
    assert.match(payload.principles[0], /Workspace > Group > Module/);
  });
});

test('GET / renders the landing page', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(baseUrl);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /Co-Work is now scaffolded/);
    assert.match(html, /Engineering/);
    assert.match(html, /\/api\/health/);
  });
});
