import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDisclosure } from '../../src/lib/validation.mjs';
import { DISCLOSURE } from '../../src/lib/constants.mjs';
import { upsertRegistry } from '../../src/lib/registry.mjs';

test('disclosure validation requires exact sentence exactly once',()=>{
  assert.equal(validateDisclosure(DISCLOSURE,'test').pass,true);
  assert.equal(validateDisclosure(`${DISCLOSURE} ${DISCLOSURE}`,'test').pass,false);
  assert.equal(validateDisclosure('This post was automated.','test').pass,false);
});

test('registry upsert prevents duplicate content IDs',()=>{
  const registry={version:1,entries:[]};upsertRegistry(registry,{content_id:'one',date:'2026-07-22',status:'generated'});upsertRegistry(registry,{content_id:'one',date:'2026-07-22',status:'staged'});
  assert.equal(registry.entries.length,1);assert.equal(registry.entries[0].status,'staged');
});
