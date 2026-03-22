import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLandingMetrics, principles, roadmap, sampleWorkspace } from './lib/product-plan.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(__dirname, 'public');

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function pageTemplate() {
  const metrics = getLandingMetrics();
  const groupCards = sampleWorkspace.groups
    .map(
      (group) => `
        <article class="card module">
          <span class="badge">${group.visibility}</span>
          <h3>${group.name}</h3>
          <p>Initial module mix for this group:</p>
          <ul>${group.modules.map((module) => `<li><strong>${module}</strong></li>`).join('')}</ul>
        </article>
      `,
    )
    .join('');

  const roadmapCards = roadmap
    .map(
      (phase) => `
        <div class="timeline-item">
          <small>${phase.phase}</small>
          <strong>${phase.goal}</strong>
          <ul>${phase.outcomes.map((outcome) => `<li>${outcome}</li>`).join('')}</ul>
        </div>
      `,
    )
    .join('');

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Co-Work</title>
      <meta name="description" content="Startup team collaboration workspace with groups, tasks, issues, and expenses." />
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <main>
        <section class="hero">
          <div class="card">
            <div class="badge">Progressive build started</div>
            <h1>Co-Work is now scaffolded as a startup team collaboration platform.</h1>
            <p>
              This first implementation slice sets up the product direction, a real landing page, and smoke-testable APIs.
              Next we can add persistent auth, workspace/group creation, and the first Kanban workflow.
            </p>
            <div class="pill-row">
              <span class="pill">Accounts</span>
              <span class="pill">Workspaces</span>
              <span class="pill">Groups</span>
              <span class="pill">Kanban</span>
              <span class="pill">Issues</span>
              <span class="pill">Expenses</span>
              <span class="pill">Audit trail</span>
            </div>
            <p class="footer-note">
              Recommended structure: <strong>${sampleWorkspace.name}</strong> workspace with functional groups and modular collaboration tools.
            </p>
          </div>
          <div class="stack">
            <div class="card">
              <div class="label">Recommended next build slice</div>
              <div class="stat">${metrics.recommendedNextStep}</div>
              <p>Create workspace → create group → invite user → create task → move status → log activity.</p>
            </div>
            <div class="card metrics-grid">
              <div>
                <div class="stat">${metrics.workspaceCount}</div>
                <div class="label">workspace blueprint</div>
              </div>
              <div>
                <div class="stat">${metrics.groupCount}</div>
                <div class="label">starter groups</div>
              </div>
              <div>
                <div class="stat">${metrics.moduleCount}</div>
                <div class="label">modules mapped</div>
              </div>
              <div>
                <div class="stat">100%</div>
                <div class="label">ready for next slice</div>
              </div>
            </div>
          </div>
        </section>

        <section class="grid three">${groupCards}</section>

        <section class="grid two">
          <article class="card">
            <h2>Roadmap</h2>
            <div class="timeline">${roadmapCards}</div>
          </article>

          <article class="card">
            <h2>Build principles</h2>
            <ul>${principles.map((principle) => `<li>${principle}</li>`).join('')}</ul>
            <p class="footer-note">
              Health endpoint: <strong>/api/health</strong><br />
              Blueprint endpoint: <strong>/api/blueprint</strong>
            </p>
          </article>
        </section>
      </main>
    </body>
  </html>`;
}

async function serveStatic(res, pathname) {
  const assetPath = join(publicDir, pathname.replace(/^\//, ''));
  const data = await readFile(assetPath);
  const contentType = extname(assetPath) === '.css' ? 'text/css; charset=utf-8' : 'text/plain; charset=utf-8';
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
}

export function createAppServer() {
  return createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/api/health') {
      return json(res, 200, {
        status: 'ok',
        service: 'co-work',
        stage: 'foundation',
        metrics: getLandingMetrics(),
        timestamp: new Date().toISOString(),
      });
    }

    if (req.method === 'GET' && url.pathname === '/api/blueprint') {
      return json(res, 200, {
        workspace: sampleWorkspace,
        roadmap,
        principles,
      });
    }

    if (req.method === 'GET' && url.pathname === '/styles.css') {
      try {
        return await serveStatic(res, url.pathname);
      } catch {
        return json(res, 404, { error: 'Asset not found' });
      }
    }

    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(pageTemplate());
      return;
    }

    json(res, 404, { error: 'Not found' });
  });
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  const port = Number(process.env.PORT || 3000);
  createAppServer().listen(port, () => {
    console.log(`Co-Work running on http://localhost:${port}`);
  });
}
