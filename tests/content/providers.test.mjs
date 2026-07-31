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

test('answer-first content uses the buyer question and gives the answer near the top',async()=>{
  const searchTopic={
    topic:'choosing a first automation',
    angle:'Start with a stable repeated workflow',
    headline:'Which business process should I automate first?',
    search_question:'Which business process should I automate first?',
    social_hook:'Find Your First Useful Automation',
    direct_answer:'Start with one repeated, rules-based workflow that creates visible delay or double handling.',
    search_intent:'commercial investigation',
    buyer_stage:'problem aware',
    primary_keyword:'which business process to automate first',
    keywords:['first business automation'],
    visual_format:'workflow-diagram',
    search_plan_id:'rl-search-test'
  };
  const brief=createBrief('2026-08-05',15,searchTopic,[]);
  const content=await new MockTextProvider().generate(brief);
  assert.equal(brief.selected_headline,searchTopic.search_question);
  assert.equal(brief.overlay_copy[0],searchTopic.social_hook);
  assert.match(content.article_markdown,/^# Which business process should I automate first\?/);
  assert.ok(content.article_markdown.split(/\s+/).slice(0,90).join(' ').includes(searchTopic.direct_answer));
});

test('mock Instagram publishing is deterministic and non-live',async()=>{
  const publisher=new MockInstagramPublisher();const result=await publisher.publish({contentId:'rl-test'});
  assert.equal(result.media_id,'mock-rl-test');assert.equal(result.mock,true);
});
