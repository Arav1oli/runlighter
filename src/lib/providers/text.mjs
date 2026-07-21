import { DISCLOSURE } from '../constants.mjs';
import { sha256 } from '../utils.mjs';

const SYSTEM_PROMPT = `You create practical content for Run Lighter, a Sydney automation consultancy for owner-led service businesses. Use Australian English. Be clear, grounded and useful. Do not use AI hype. Do not suggest replacing staff. Do not invent results, testimonials, quotations, numbers, statistics or case studies. Never expose confidential information. Keep human judgement, relationships and accountability visible. Focus on one operational idea. Every caption and article must contain this exact sentence once: ${DISCLOSURE}`;

const schema = {
  type: 'object', additionalProperties: false,
  required: ['caption','article_markdown','excerpt','description','seo_title','meta_description','primary_keyword','secondary_keywords','hero_image_alt','promotion_reason','suggested_paid_audience','suggested_ad_primary_text','suggested_ad_headline'],
  properties: {
    caption: { type:'string' }, article_markdown: { type:'string' }, excerpt: { type:'string' },
    description: { type:'string' }, seo_title: { type:'string' }, meta_description: { type:'string' },
    primary_keyword: { type:'string' }, secondary_keywords: { type:'array', items:{type:'string'} },
    hero_image_alt: { type:'string' }, promotion_reason: { type:'string' },
    suggested_paid_audience: { type:'string' }, suggested_ad_primary_text: { type:'string' },
    suggested_ad_headline: { type:'string' }
  }
};

function mockArticle(brief) {
  const subject = brief.topic;
  const action = brief.desired_action;
  const structures = [
    ['The operational problem','Why the problem persists','A practical way to improve it','What should remain under human judgement','Implementation considerations','Run lighter, one process at a time'],
    ['Where the process gets heavy','The pattern behind the extra work','Map one real example','Draw the human boundary','Build, test and review','A lighter next step'],
    ['Start with the handover','What software cannot fix alone','Three layers of the workflow','Human responsibility by design','A sensible first implementation','Keep the first change useful']
  ];
  const headings = structures[(brief.campaign_day-1)%structures.length];
  return `# ${brief.selected_headline}

Repeated ${subject} work rarely looks dramatic. It appears as a quick message, a copied field, a reminder added to a calendar or a status update sent to one more person. Each step is small. Together, those steps make a growing service business heavier to run and easier to interrupt.

The practical question is not whether every part of ${subject} can be automated. It is which repeated steps should happen reliably, which decisions still need a person and how the two should meet without creating more systems to manage.

## ${headings[0]}

In many owner-led businesses, the process lives across email, a spreadsheet, a customer system and the memory of the person who usually keeps things moving. That can work while the team is small and the volume is predictable. As the business grows, the same arrangement creates avoidable checking, chasing and double handling.

The owner often becomes the safety net. When information is missing, a handover is unclear or a follow-up has not happened, the question returns to the same person. The issue is not effort. It is that the workflow has no clear trigger, owner or visible next step.

## ${headings[1]}

The work is usually spread across several small actions, so it is hard to see as one process. People improve their own part with templates, flags or personal reminders, but the handover between people and systems remains manual.

Software can also hide the problem. A business may already have capable tools, yet still copy information between them because no one has designed the connection. Buying another platform before mapping the work can add another place to check without removing a single repeated step.

There is also a sensible hesitation around automation. Teams know that customers, unusual situations and commercial decisions require judgement. That hesitation is useful. The answer is to define where judgement begins, not to leave every routine step manual.

## ${headings[2]}

Start with one real example from the past week. Follow it from the first trigger to the final outcome. Write down what entered the process, who touched it, which systems were updated and what caused the next action.

Then separate the workflow into three groups:

1. **Routine movement.** Information that can move between approved systems without interpretation.
2. **Rule-based action.** A reminder, task or acknowledgement that can happen when a clear condition is met.
3. **Human judgement.** A decision, exception or conversation where context and accountability matter.

This simple division prevents two common mistakes. It stops the business from automating a decision that should remain human, and it stops staff from manually carrying information that a system could move consistently.

Choose one narrow improvement. It might be creating the next task when a status changes, acknowledging a new enquiry, preparing a draft record from approved data or showing overdue actions in one view. Give the workflow an owner, define what success means and test it with the people who use it.

## ${headings[3]}

Automation should not decide how to handle an unusual customer, make an unreviewed commercial commitment or remove accountability from the person responsible for the outcome. It should make the normal path visible and bring exceptions to the right person with useful context.

Relationships also stay human. A system can make sure a follow-up is not forgotten, but the quality of the conversation still belongs to the team. It can prepare information for review, but approval remains with the person who understands the consequences.

The aim is not fewer people. It is less repeated work around the people, so their time goes into judgement, service and decisions.

## ${headings[4]}

Use the software already in place as the starting point. Confirm who owns the data, what permissions are required and what should happen when information is incomplete. Build a visible exception path before switching on the normal path.

Keep a short audit trail. The business should be able to see what triggered the workflow, what action occurred and where a person intervened. Add a kill switch and test with a small group before expanding the scope.

Review the workflow after it has handled real work. Ask whether it removed a repeated step, whether the handover became clearer and whether staff know what to do when something falls outside the rule. Expand only when the first improvement is genuinely useful.

## Automation note

${DISCLOSURE}

The content workflow follows approved Run Lighter brand rules, validation checks and publishing safeguards. Human accountability remains in place, and the system stops when a critical check fails.

## ${headings[5]}

The best first automation is rarely the biggest. It is the repeated, well-understood piece of work that can be made reliable without taking judgement away from the team.

${action}. Run Lighter can visit your Sydney business, map the friction and identify a useful place to begin.`;
}

function mockCaption(brief) {
  return `${brief.selected_hook}

${brief.problem} The answer is not to automate every decision. It is to separate the repeated movement from the moments that need context, judgement and a real conversation.

Start with one recent example. Map the trigger, the handovers, the systems touched and the person responsible for the next step. Then let approved rules handle the routine path and send exceptions to the right person.

${DISCLOSURE}

The workflow follows defined brand, quality and publishing rules, with human accountability kept in place.

${brief.caption_cta}

#RunLighter #BusinessAutomation #SydneyBusiness #Operations`;
}

export class MockTextProvider {
  name = 'mock';
  model = 'deterministic-template-v1';
  async generate(brief) {
    return {
      caption: mockCaption(brief),
      article_markdown: mockArticle(brief),
      excerpt: `${brief.angle}. A practical guide for owner-led service businesses.`,
      description: `A practical Run Lighter guide to ${brief.topic}, clear handovers and responsible automation.`,
      seo_title: `${brief.selected_headline} | Run Lighter`,
      meta_description: `Learn a practical way to improve ${brief.topic} while keeping judgement, relationships and accountability human.`,
      primary_keyword: brief.primary_keyword,
      secondary_keywords: brief.secondary_keywords,
      hero_image_alt: `Earthy green Run Lighter diagram showing ${brief.visual_concept.toLowerCase()}.`,
      promotion_reason: brief.promotion_hypothesis,
      suggested_paid_audience: 'Sydney owners and operations leaders in established service businesses',
      suggested_ad_primary_text: `${brief.selected_hook} See how one practical workflow can remove repeated work while keeping important decisions human.`,
      suggested_ad_headline: brief.selected_headline
    };
  }
}

export class OpenAITextProvider {
  name = 'openai';
  constructor(config) { this.config = config; this.model = config.textModel; }
  async generate(brief) {
    if (!this.config.openaiApiKey) throw new Error('OPENAI_API_KEY is required for TEXT_PROVIDER=openai');
    const payload = {
      model: this.model,
      store: false,
      input: [
        { role:'system', content:SYSTEM_PROMPT },
        { role:'user', content:`Create the final caption and article package from this approved brief:\n${JSON.stringify(brief)}` }
      ],
      text: { format: { type:'json_schema', name:'run_lighter_content', strict:true, schema } }
    };
    const response = await fetch('https://api.openai.com/v1/responses', {
      method:'POST', headers:{ Authorization:`Bearer ${this.config.openaiApiKey}`, 'Content-Type':'application/json' },
      body:JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`OpenAI text generation failed with HTTP ${response.status}`);
    const data = await response.json();
    const text = data.output_text || data.output?.flatMap(item => item.content || []).find(item => item.type === 'output_text')?.text;
    if (!text) throw new Error('OpenAI response did not contain structured output');
    return JSON.parse(text);
  }
}

export function getTextProvider(config) {
  if (config.textProvider === 'mock') return new MockTextProvider();
  if (config.textProvider === 'openai') return new OpenAITextProvider(config);
  throw new Error(`Unsupported TEXT_PROVIDER: ${config.textProvider}`);
}

export function promptAudit(brief, provider) {
  return { provider:provider.name, model:provider.model, system_prompt_hash:sha256(SYSTEM_PROMPT), brief_hash:sha256(JSON.stringify(brief)) };
}
