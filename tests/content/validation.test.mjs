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

test('registry force regeneration replaces the entry for that date',()=>{
  const registry={version:1,entries:[]};
  upsertRegistry(registry,{content_id:'old',date:'2026-08-05',headline:'Old idea'});
  upsertRegistry(registry,{content_id:'planned',date:'2026-08-05',headline:'Planned search question'});
  assert.equal(registry.entries.length,1);
  assert.equal(registry.entries[0].content_id,'planned');
  assert.equal(registry.entries[0].headline,'Planned search question');
});
