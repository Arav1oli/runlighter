import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, assertLiveConfiguration } from '../../src/lib/config.mjs';
import { withRetry } from '../../src/lib/retry.mjs';
import { redact } from '../../src/lib/utils.mjs';

test('configuration defaults fail safe',()=>{
  const config=loadConfig({AUTO_PUBLISH:'false',INSTAGRAM_AUTO_PUBLISH:'false',DRY_RUN:'true'});
  assert.equal(config.autoPublish,false);assert.equal(config.instagramAutoPublish,false);assert.equal(config.dryRun,true);
  assert.equal(config.continuousContent,false);
  assert.throws(()=>assertLiveConfiguration(config),/DRY_RUN/);
});

test('continuous daily content is opt in',()=>{
  const config=loadConfig({CONTINUOUS_CONTENT:'true'});
  assert.equal(config.continuousContent,true);
});

test('kill switch blocks live configuration',()=>{
  const config=loadConfig({CONTENT_KILL_SWITCH:'true',DRY_RUN:'false',AUTO_PUBLISH:'true'});
  assert.throws(()=>assertLiveConfiguration(config),/kill switch/);
});

test('retry uses temporary attempts and eventually succeeds',async()=>{
  let attempts=0;const result=await withRetry(async()=>{attempts+=1;if(attempts<3)throw new Error('temporary');return'ok';},{retries:3,baseDelayMs:1});
  assert.equal(result,'ok');assert.equal(attempts,3);
});

test('secret redaction removes API-like tokens',()=>{
  const redacted=redact('Authorization: Bearer sk-abcdefghijklmnopqrstuvwxyz123456');
  assert.equal(redacted.includes('sk-'),false);assert.equal(redacted.includes('[REDACTED]'),true);
});
