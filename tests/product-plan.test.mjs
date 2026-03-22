import test from 'node:test';
import assert from 'node:assert/strict';
import { getLandingMetrics, roadmap, sampleWorkspace } from '../lib/product-plan.js';

test('landing metrics reflect the seeded workspace structure', () => {
  const metrics = getLandingMetrics();

  assert.equal(metrics.workspaceCount, 1);
  assert.equal(metrics.groupCount, sampleWorkspace.groups.length);
  assert.equal(metrics.moduleCount, 9);
  assert.equal(metrics.recommendedNextStep, roadmap[0].phase);
});

test('every seeded group has at least one collaboration module', () => {
  for (const group of sampleWorkspace.groups) {
    assert.ok(group.modules.length > 0, `${group.name} should expose at least one module`);
  }
});
