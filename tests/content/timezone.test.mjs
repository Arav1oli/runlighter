import test from 'node:test';
import assert from 'node:assert/strict';
import { inExecutionWindow, zonedParts } from '../../src/lib/utils.mjs';

test('Sydney staging guard works during daylight saving time',()=>{
  const instant=new Date('2026-01-15T18:00:00Z');
  assert.equal(zonedParts(instant,'Australia/Sydney').time,'05:00');
  assert.equal(inExecutionWindow(instant,'05:00',15,'Australia/Sydney'),true);
  assert.equal(inExecutionWindow(instant,'07:00',15,'Australia/Sydney'),false);
});

test('Sydney staging guard works during standard time',()=>{
  const instant=new Date('2026-07-14T19:00:00Z');
  assert.equal(zonedParts(instant,'Australia/Sydney').time,'05:00');
  assert.equal(inExecutionWindow(instant,'05:00',15,'Australia/Sydney'),true);
});

test('execution window closes after fifteen minutes',()=>{
  const instant=new Date('2026-07-14T19:15:00Z');
  assert.equal(inExecutionWindow(instant,'05:00',15,'Australia/Sydney'),false);
});
