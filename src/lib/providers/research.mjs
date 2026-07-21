import { sha256 } from '../utils.mjs';

export class NoResearchProvider {
  name = 'none'; model = 'none';
  async research() { return { available:false, candidates:[], note:'Topical research unavailable. Evergreen mode used.' }; }
}

export class OpenAIResearchProvider {
  name = 'openai';
  constructor(config) { this.config = config; this.model = config.textModel; }
  async research(date) {
    if (!this.config.openaiApiKey) return { available:false, candidates:[], note:'OPENAI_API_KEY not configured. Evergreen mode used.' };
    const prompt = `Find up to three current, authoritative Australian business or technology developments as of ${date} that have a direct practical connection to workflow automation for established owner-led service businesses. Prefer government or primary sources. Return concise ideas with source URLs. Do not force a topical angle.`;
    const response = await fetch('https://api.openai.com/v1/responses', {
      method:'POST', headers:{ Authorization:`Bearer ${this.config.openaiApiKey}`, 'Content-Type':'application/json' },
      body:JSON.stringify({ model:this.model, store:false, tools:[{type:'web_search'}], input:prompt })
    });
    if (!response.ok) return { available:false, candidates:[], note:`Research request failed with HTTP ${response.status}. Evergreen mode used.` };
    const data = await response.json();
    const output = data.output_text || '';
    const urls = [...JSON.stringify(data).matchAll(/https?:\\?\/\\?\/[^"\\\s]+/g)].map(match => match[0].replaceAll('\\/','/'));
    return { available:true, candidates:output ? [{ topic:'current Australian business development', angle:output.slice(0, 500), headline:'A useful current business development', keywords:['Australia','business'], source_urls:[...new Set(urls)].slice(0, 5) }] : [], note:'OpenAI web research completed.' };
  }
}

export function getResearchProvider(config) {
  if (['none','mock'].includes(config.researchProvider)) return new NoResearchProvider();
  if (config.researchProvider === 'openai') return new OpenAIResearchProvider(config);
  throw new Error(`Unsupported RESEARCH_PROVIDER: ${config.researchProvider}`);
}

export const researchAudit = (provider, result) => ({ provider:provider.name, model:provider.model, result_hash:sha256(JSON.stringify(result)), available:result.available, note:result.note });
