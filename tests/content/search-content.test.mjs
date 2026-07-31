import test from 'node:test';
import assert from 'node:assert/strict';
import { SEARCH_QUESTION_SEEDS, nextUnscheduledDate } from '../../src/lib/search-content.mjs';
import { wordCount } from '../../src/lib/utils.mjs';

test('search question library contains distinct buyer questions with short social hooks', () => {
  assert.ok(SEARCH_QUESTION_SEEDS.length >= 14);
  assert.equal(new Set(SEARCH_QUESTION_SEEDS.map(item => item.question)).size, SEARCH_QUESTION_SEEDS.length);
  for (const item of SEARCH_QUESTION_SEEDS) {
    assert.match(item.question, /\?$/);
    assert.ok(wordCount(item.social_hook) <= 7, `${item.social_hook} exceeds seven words`);
    assert.ok(item.direct_answer.length > 60);
    assert.ok(item.primary_keyword);
  }
});

test('weekly search plan begins after already registered content', () => {
  const registry = {
    entries: [
      { date: '2026-08-01' },
      { date: '2026-08-02' },
      { date: '2026-08-03' }
    ]
  };
  assert.equal(nextUnscheduledDate('2026-08-01', registry), '2026-08-04');
});
