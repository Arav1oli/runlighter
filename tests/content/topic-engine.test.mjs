import test from 'node:test';
import assert from 'node:assert/strict';
import { jaccard, similarity, selectTopic } from '../../src/lib/topic-engine.mjs';

test('normalised title comparison catches near duplicates',()=>{
  assert.ok(jaccard('Stop typing the same detail twice','Stop typing the same details twice')>.6);
});

test('topic similarity combines topic and keyword overlap',()=>{
  const score=similarity({headline:'Your inbox is not a workflow',topic:'inbox triage',angle:'Route messages',keywords:['email','triage']},{headline:'Your inbox is not the workflow',topic:'email triage',angle:'Route routine messages',keywords:['email','triage']});
  assert.ok(score>.75);
});

test('topic selection rejects the previous duplicate and rotates visual format',()=>{
  const registry={entries:[{date:'2026-07-21',topic:'enquiry follow-up',angle:'Why fast acknowledgement and human follow-up should be separate steps',headline:'A good lead should never wait for an acknowledgement',keywords:['leads','follow-up','crm'],visual_format:'workflow-diagram'}]};
  const selection=selectTopic('2026-07-22',registry,.82,[]);
  assert.notEqual(selection.selected.topic,'enquiry follow-up');
  assert.notEqual(selection.selected.visual_format,'workflow-diagram');
});
