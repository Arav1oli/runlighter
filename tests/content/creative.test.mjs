import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { createBrief } from '../../src/lib/brief.mjs';
import { renderCreativePackage } from '../../src/lib/creative.mjs';
import { MockImageProvider } from '../../src/lib/providers/image.mjs';
import { DISCLOSURE } from '../../src/lib/constants.mjs';

test('creative renderer produces exact Instagram, hero and OG dimensions',async()=>{
  const directory=await mkdtemp(path.join(os.tmpdir(),'run-lighter-creative-'));
  try{
    const brief=createBrief('2026-07-22',1,{topic:'reporting',angle:'Build the report once',headline:'Stop rebuilding Friday reports',keywords:['reporting'],visual_format:'minimal-data-visual'},[]);
    const manifest=await renderCreativePackage(brief,directory,new MockImageProvider());
    for(const [name,expected] of Object.entries({instagram:[1080,1350],hero:[1600,900],og:[1200,630]})){
      const metadata=await sharp(path.resolve(manifest.variants[name].png)).metadata();
      assert.deepEqual([metadata.width,metadata.height],expected);
      const svg=await readFile(path.resolve(manifest.variants[name].svg),'utf8');
      assert.equal(svg.includes(DISCLOSURE),true);
      assert.equal(svg.includes('RUN / LIGHTER'),true);
    }
  }finally{await rm(directory,{recursive:true,force:true});}
});
