import { readFile } from 'node:fs/promises';
import { ensureDir, writeText } from '../utils.mjs';
import path from 'node:path';

export class MockImageProvider {
  name = 'mock';
  model = 'deterministic-vector-v1';
  async generateBackground() { return null; }
}

export class OpenAIImageProvider {
  name = 'openai';
  constructor(config) { this.config = config; this.model = config.imageModel; }
  async generateBackground(prompt) {
    if (!this.config.openaiApiKey) throw new Error('OPENAI_API_KEY is required for IMAGE_PROVIDER=openai');
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method:'POST',
      headers:{ Authorization:`Bearer ${this.config.openaiApiKey}`, 'Content-Type':'application/json' },
      body:JSON.stringify({
        model:this.model, size:'1024x1536', quality:'medium', output_format:'png',
        prompt:`${prompt}. No words, letters, numbers, logos, robots, humanoid assistants, glowing brains, holograms or futuristic dashboards. Earthy, premium, restrained Australian business aesthetic.`
      })
    });
    if (!response.ok) throw new Error(`OpenAI image generation failed with HTTP ${response.status}`);
    const data = await response.json();
    if (!data.data?.[0]?.b64_json) throw new Error('OpenAI image response did not contain base64 image data');
    return Buffer.from(data.data[0].b64_json, 'base64');
  }
}

export function getImageProvider(config) {
  if (config.imageProvider === 'mock') return new MockImageProvider();
  if (config.imageProvider === 'openai') return new OpenAIImageProvider(config);
  throw new Error(`Unsupported IMAGE_PROVIDER: ${config.imageProvider}`);
}
