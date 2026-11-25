import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmailDraft, normalizeSelection, nextTabIndex, readinessSummary } from '../src/lib/planner.ts';

const parse = link => {
  const url = new URL(link);
  return { to: url.pathname, subject: url.searchParams.get('subject'), body: url.searchParams.get('body') };
};

test('email draft lists selected topics once, in order, without personal data', () => {
  const draft = parse(createEmailDraft(['home', 'commercial', 'home'], 'team@example.com'));
  assert.equal(draft.to, 'team@example.com');
  assert.equal(draft.subject, 'Coverage conversation: Home insurance, Commercial insurance');
  assert.equal(draft.body.match(/Home insurance/g)?.length, 1);
  assert.ok(!draft.body.includes('Auto insurance'));
  assert.ok(draft.body.includes('Please don’t include driver’s licence, banking or payment details.'));
});

test('email draft lists ticked items under their topic, and only for selected topics', () => {
  const body = parse(createEmailDraft(['auto', 'home'], 'team@example.com', ['auto-1', 'auto-3', 'commercial-0'])).body;
  assert.ok(body.includes('- Auto insurance\n  I already have ready:\n  ✓ Vehicle year, make, model and VIN\n  ✓ Questions about coverage limits and deductibles'));
  assert.ok(!body.includes('Driver details'));
  assert.ok(body.includes('- Home insurance\n\n'), 'Home has nothing ticked, so no "ready" list');
  assert.ok(!body.includes('Description of your business'), 'Ticks for unselected topics are left out');
});

test('email draft never mentions quotes or coverage being arranged', () => {
  const body = parse(createEmailDraft(['auto'], 'team@example.com')).body.toLowerCase();
  assert.ok(!body.includes('quote'));
  assert.ok(!body.includes('bind'));
});

test('email draft without a selection is still a valid general enquiry', () => {
  const draft = parse(createEmailDraft(['invalid'], 'team@example.com'));
  assert.equal(draft.subject, 'Coverage conversation');
  assert.ok(draft.body.includes('I’d like to talk about my insurance.'));
  assert.deepEqual(normalizeSelection(['auto', '<script>', 'auto', 'home']), ['auto', 'home']);
});

test('readiness summary counts progress and celebrates completion', () => {
  assert.equal(readinessSummary(0, 0), '');
  assert.equal(readinessSummary(2, 4), '2 of 4 ready');
  assert.match(readinessSummary(4, 4), /^All 4 ready/);
});

test('keyboard navigation wraps, supports endpoints, and ignores unrelated keys', () => {
  assert.equal(nextTabIndex('ArrowLeft', 0, 3), 2);
  assert.equal(nextTabIndex('ArrowRight', 2, 3), 0);
  assert.equal(nextTabIndex('Home', 2, 3), 0);
  assert.equal(nextTabIndex('End', 0, 3), 2);
  assert.equal(nextTabIndex('Tab', 1, 3), null);
  assert.equal(nextTabIndex('ArrowRight', 0, 0), null);
});
