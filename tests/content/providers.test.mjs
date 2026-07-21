import test from 'node:test';
import assert from 'node:assert/strict';
import { MockTextProvider } from '../../src/lib/providers/text.mjs';
import { MockInstagramPublisher } from '../../src/lib/publishing/instagram.mjs';
import { createBrief } from '../../src/lib/brief.mjs';
import { DISCLOSURE } from '../../src/lib/constants.mjs';

const topic={topic:'enquiry follow-up',angle:'Separate acknowledgement from judgement',headline:'Good leads should not wait',keywords:['leads'],visual_format:'workflow-diagram'};

test('mock text provider creates complete disclosure-bearing content',async()=>{
  const brief=createBrief('2026-07-22',1,topic,[]);const content=await new MockTextProvider().generate(brief);
  assert.equal(content.caption.split(DISCLOSURE).length-1,1);
  assert.equal(content.article_markdown.split(DISCLOSURE).length-1,1);
  assert.match(content.article_markdown,/What should remain under human judgement/);
});

test('mock Instagram publishing is deterministic and non-live',async()=>{
  const publisher=new MockInstagramPublisher();const result=await publisher.publish({contentId:'rl-test'});
  assert.equal(result.media_id,'mock-rl-test');assert.equal(result.mock,true);
});
