import { DISCLOSURE } from './constants.mjs';

const ARTICLES = {
  'Which business process should I automate first?': {
    intro: `The right first automation is not the flashiest idea. It is the smallest repeated workflow that causes a visible delay, regularly needs someone to copy or chase information, and has a normal path that the team can explain. A strong first project is narrow enough to test, useful enough for staff to notice and safe enough to stop when an exception appears.`,
    sections: [
      ['Start with friction, not software', `Do not begin with a list of AI products. Begin with the work that interrupts the owner or team every week. Look for enquiries waiting to be assigned, customer details being entered twice, reminders living in personal calendars, reports rebuilt from several systems or approved job information being retyped into an invoice. These are useful signals because the problem already exists and the people doing the work can describe it. A new tool is only relevant after the workflow is understood.`],
      ['Use four filters', `A useful first candidate is repeated, rules-based, visible and reversible. Repeated means it happens often enough to matter. Rules-based means the normal path can be described without relying on instinct. Visible means the business can tell whether the change removed waiting, double handling or missed action. Reversible means the workflow can be paused without damaging customer service. If a process fails one of these filters, it may still be worth improving, but it is a weaker first automation.`],
      ['Map one real example', `Take a recent piece of work and follow it from trigger to completion. Record where the information arrived, who touched it, what was copied, which systems changed and how the next person knew to act. Include the awkward example, not just the ideal path. The map should show the normal route, the information required at each step and the point where human judgement begins. This prevents the build from automating an imaginary process that only exists in a procedure document.`],
      ['Choose a narrow first result', `A sensible first result might be creating a sales task when a qualified enquiry arrives, preparing a draft record from approved information, acknowledging receipt while assigning a human owner, or showing overdue actions in one place. It should not be “automate sales” or “add AI to operations”. Those scopes hide too many decisions. Name the trigger, the action, the responsible person and the exception path. That is enough to produce a testable first version.`],
      ['Keep exceptions human', `Missing information, unusual customers, commercial commitments and sensitive conversations should be routed to a person with context. The system can collect the relevant details and make the exception visible, but it should not guess its way through a decision the business would normally expect someone to own. This boundary is not a limitation. It is what makes the automation dependable and easier for the team to trust.`],
      ['What to bring to a review', `Bring one recent example, the systems involved, the person who currently owns the work and the most common reason it goes off track. That is enough to have a productive conversation. Run Lighter can map the workflow on site, identify the strongest practical starting point and explain what should remain human before any larger build is proposed.`]
    ]
  },
  'How much does business automation cost in Sydney?': {
    intro: `There is no responsible single price for business automation because the cost follows the workflow. A simple connection between two well-documented systems is a different project from a lead, quoting or onboarding process with several tools, permissions, exception paths and staff handovers. The useful question is what must be understood, built, tested and supported.`,
    sections: [
      ['What actually creates the cost', `The main cost drivers are scope, system access, data quality, exception handling, testing and ongoing ownership. A workflow that moves complete information between supported systems is usually simpler than one that must interpret inconsistent emails, recover missing details or coordinate several teams. Security and permissions matter as well. If the workflow touches personal, financial or commercially sensitive information, the design needs clear controls rather than a quick connection made for convenience.`],
      ['Discovery should reduce uncertainty', `A credible proposal starts by mapping the current process. The review should identify the trigger, required inputs, normal route, exceptions, people involved and systems that hold the source information. This work prevents a fixed price being attached to an undefined outcome. It also exposes cases where the problem can be solved by changing an existing setting or process instead of commissioning a larger build.`],
      ['Separate setup from ownership', `Ask what the implementation price includes and what happens after launch. Setup may cover workflow design, connections, testing, documentation and staff handover. Ongoing work may include monitoring, error handling, provider changes, security updates and improvements. Neither model is automatically better. The important point is that the business knows who notices a failure, who can pause the workflow and who owns changes when the underlying process evolves.`],
      ['Compare proposals by scope', `Two quotes are only comparable when they describe the same workflow and responsibility. Check whether each proposal includes exception handling, testing with real examples, documentation, staff training, privacy considerations and post-launch support. A cheap build that only demonstrates the happy path can leave the team manually repairing failures. A larger proposal can also be unnecessary if it replaces software that was already capable of the required work.`],
      ['Start with a proof, not a promise', `For a business new to automation, a narrow proof is often a better commercial decision than a broad transformation program. Select one useful workflow, agree on the boundary and test it with real work. The proof should show whether the systems connect reliably, whether staff understand the exception path and whether the change removes a repeated step. Evidence from that first implementation makes the next scope easier to price.`],
      ['A practical next step in Sydney', `Run Lighter begins with the business process rather than a preselected software package. An on-site review can identify the strongest opportunity, the likely complexity and what information is needed before a responsible implementation price can be prepared. The purpose of the review is to make the scope clearer, not to force every business into the same solution.`]
    ]
  },
  'How do I automate lead follow-up without sounding robotic?': {
    intro: `Automate the timing, routing and reminders around follow-up, not the relationship itself. A system can acknowledge an enquiry, collect context, assign an owner and make the next action visible. The actual sales conversation should still sound like the person and business the prospect chose to contact.`,
    sections: [
      ['Separate response from conversation', `A fast acknowledgement and a useful human reply are different jobs. The acknowledgement can confirm that the enquiry arrived and explain what happens next. The human reply can respond to the details, ask a relevant question and decide the right next step. Problems begin when one generic sequence tries to do both. The prospect receives polished messages, but nobody has demonstrated that the business understood the request.`],
      ['Capture context once', `The first workflow should preserve the source, service requested, timing, location and any message the prospect supplied. That context should follow the lead into the customer system and the assigned task. Staff should not need to open several tools or ask the prospect to repeat information already provided. Automation feels less robotic when it gives the person responding enough context to be specific.`],
      ['Use rules for ownership and urgency', `Define who receives each type of enquiry, when it needs attention and what happens if the first owner is unavailable. A rule can route a request by service, area or existing relationship. It can also escalate an untouched lead after an agreed period. The system should make delay visible. It should not pretend a conversation happened by sending increasingly urgent generic messages from an unattended address.`],
      ['Draft, then review', `AI can help prepare a response using approved business information and the prospect’s original message, but the draft should be reviewed when the answer contains advice, pricing, availability or a commitment. Keep the language direct and plain. Avoid fake familiarity and manufactured urgency. A short reply that clearly refers to the enquiry will usually feel more human than a long sequence designed to imitate personal attention.`],
      ['Stop sequences when reality changes', `The workflow needs clear stop conditions. A reply, phone call, booking, disqualification or change of owner should prevent irrelevant reminders from continuing. This is where many follow-up systems lose trust. They keep speaking because a status was not updated. Connect the communication rules to the real sales stages and make it easy for staff to correct the record.`],
      ['The first workflow to test', `Start with acknowledgement, assignment, one visible follow-up task and an exception alert. Test it against new enquiries, returning customers, incomplete forms and requests outside the normal service area. Once the team trusts the routing and status changes, additional reminders can be added carefully. Run Lighter can map this process on site and build it around the systems already used by the sales team.`]
    ]
  },
  'What can AI automate in a small service business?': {
    intro: `AI and workflow automation are most useful for repeated digital work around the service: capturing enquiries, moving approved information, preparing drafts, creating tasks, checking completeness, summarising records and producing routine reports. Commercial decisions, unusual cases and important customer conversations should remain under human judgement.`,
    sections: [
      ['Enquiries and lead administration', `A workflow can capture an enquiry from a form or inbox, create the correct customer record, preserve the original message, assign an owner and prepare an acknowledgement. AI may help classify an unstructured message or summarise the request. A person should still decide how to respond when the request is unusual, commercially important or outside the normal service.`],
      ['Documents and onboarding', `Businesses often repeat the same document preparation, folder creation, information requests and reminders for every new customer. Automation can create the workspace, populate approved fields, issue the correct checklist and show what is missing. It should not approve incomplete agreements, interpret ambiguous instructions or make commitments that normally require an authorised person.`],
      ['Operations and handovers', `When a status changes, the next task, notification or record update can often happen automatically. This is useful between sales and delivery, field staff and the office, or completed work and invoicing. The design should identify the source of truth and prevent several systems from disagreeing. Exceptions need an owner rather than disappearing into a failed background process.`],
      ['Marketing and reporting', `Automation can collect approved data, prepare recurring reports, route content for review and create campaign tasks from a defined plan. AI can draft or summarise, but brand judgement and factual responsibility remain human. The aim is to remove the repeated assembly around marketing, not to flood channels with generic material because generation became easy.`],
      ['Finance administration', `Approved job details can move into a draft invoice, payment reminders can follow agreed rules and recurring finance reports can be assembled from trusted data. Final approval, tax treatment, unusual adjustments and sensitive customer conversations should remain with the responsible person. Financial workflows need stronger permissions and audit trails than a simple internal reminder.`],
      ['How to identify your opportunity', `List the digital tasks repeated each week, then mark where information is copied, chased, reformatted or checked. Choose a workflow with stable rules and a visible owner. Run Lighter can review the real process at your Sydney business, separate automation from judgement and recommend a useful first implementation without requiring a wholesale software replacement.`]
    ]
  },
  'Can automation work with the software my business already uses?': {
    intro: `Often, yes. Many useful automations begin by connecting the software already used for email, customer records, forms, accounting, documents and task management. The decision should follow the workflow and the available integration options. Replacing the entire software stack should not be the default.`,
    sections: [
      ['Map the information journey', `Identify where information first enters, which system should be the source of truth and where the same details are entered again. The map should include the person who owns each stage and what triggers the next action. This quickly shows whether the problem is a missing connection, an inconsistent process or a tool that genuinely cannot support the required work.`],
      ['Check supported connection methods', `Modern business software may offer an API, webhook, approved connector, export or built-in automation. The quality of those options matters more than the number of logos shown on an integration page. Confirm what data can be read or written, how authentication works, whether actions are logged and what limits apply. Avoid fragile screen-scraping workarounds when a supported method is available.`],
      ['Choose a source of truth', `Customer details, job status and financial information should not drift across several systems without clear ownership. Decide which platform controls each important field and how updates move outward. When two systems can both overwrite the same information, errors become difficult to diagnose. A good automation reduces double handling while making data responsibility clearer.`],
      ['Design the exception path', `Connections fail when information is incomplete, permissions expire or the software provider changes a field. The workflow should detect those conditions, preserve the original data and tell the right person what needs attention. Silent failure is worse than a manual process because the team assumes the work happened. Monitoring and a kill switch are part of the implementation, not optional extras.`],
      ['Know when replacement is justified', `Replacement may be sensible when the current tool cannot provide secure access, no longer supports the process, creates duplicated records or imposes a serious operational limit. Even then, changing platforms and automating the workflow are separate projects. The business should understand the migration risk, staff impact and source data before treating new software as the automatic answer.`],
      ['Review what you already own', `Bring a list of the current tools and one workflow that crosses them. Run Lighter can map the handovers, check practical connection options and identify whether the existing stack is capable of the change. The outcome may be a connection, a process adjustment or a recommendation to replace one part, but it should be based on evidence from the actual work.`]
    ]
  },
  'How do I choose an AI automation consultant in Sydney?': {
    intro: `Choose a consultant who begins with the real workflow, clearly defines what remains human, works with existing systems where sensible and explains testing, support and ownership. Avoid providers who lead with a tool before understanding the business problem or promise a broad transformation without a scoped first process.`,
    sections: [
      ['They should ask operational questions', `A useful first conversation covers the trigger, people involved, systems used, delays, exceptions and desired outcome. The consultant should want to see how work happens today, including the awkward cases. If the discussion stays at the level of AI features and generic possibilities, there is not yet enough information to design a dependable workflow.`],
      ['They should protect human judgement', `Ask where the proposed system stops and a person takes responsibility. Customer relationships, commercial commitments, unusual cases and sensitive information need explicit boundaries. A credible consultant will describe the exception path and approval points without treating them as failures to automate. The goal is a lighter operation, not a system that makes hidden decisions on behalf of the business.`],
      ['They should explain the architecture plainly', `You should understand which systems connect, where data is stored, what permissions are required and how the workflow can be paused. Technical detail may sit underneath the implementation, but ownership should not be mysterious. The business needs documentation and a clear answer to who monitors failures, maintains credentials and responds when a software provider changes.`],
      ['They should scope testing and support', `A demonstration is not the same as a production workflow. Ask how real examples, incomplete information, duplicate records and unavailable systems will be tested. Confirm what happens after launch and whether support is included, optional or handed back to the team. The proposal should identify success conditions and the responsibilities on both sides.`],
      ['They should avoid unsupported claims', `Be cautious with guaranteed savings, invented benchmarks, vague claims about replacing roles or examples that cannot be verified. A responsible provider can explain the mechanism and the expected operational change without manufacturing certainty. Early projects should prove a useful result in the client’s environment before the scope expands.`],
      ['Use the first review as evidence', `The review should leave you with a clearer process, a ranked opportunity and an understanding of the human boundary, even if you do not proceed immediately. Run Lighter visits Sydney businesses to examine the work where it happens, identify a practical starting point and build around the existing operation rather than forcing a generic AI package.`]
    ]
  },
  'Will business automation replace my staff?': {
    intro: `Good business automation should remove repeated movement, checking and reminders around staff, not erase the judgement, accountability and relationships they provide. Roles can change when routine administration is reduced, but the implementation should be designed around better work and clearer capacity rather than an unsupported promise to remove people.`,
    sections: [
      ['Separate tasks from roles', `A role contains many kinds of work: customer conversations, decisions, coordination, exception handling, subject knowledge and routine administration. Automation usually addresses particular tasks, not the whole role. Mapping at task level prevents the business from assuming that because one repeated step can be automated, every responsibility held by the person can be replaced.`],
      ['Use capacity deliberately', `Time released from copying, checking or chasing does not create value automatically. Decide where that capacity should go. It might improve response quality, increase customer contact, shorten a handover, reduce backlog or allow staff to focus on work that requires experience. The intended use of capacity should be part of the project discussion, not an afterthought.`],
      ['Keep accountability visible', `Every workflow needs a human owner. The system may perform an action, but someone remains responsible for the process, the data and the response when an exception occurs. Staff should know what the automation does, what it does not do and how to stop it. This is especially important when the workflow touches customers, pricing, finance or sensitive information.`],
      ['Involve the people doing the work', `The people closest to a process usually know the shortcuts, missing information and unusual cases that a procedure document overlooks. Involving them improves the design and reduces fear. It also helps distinguish genuinely repetitive work from a step that looks simple but contains valuable judgement. A workflow built with staff is more likely to be used and monitored correctly.`],
      ['Measure operational improvement', `Review whether the change removed double handling, reduced waiting, improved visibility or made an exception easier to manage. Do not judge success only by whether the workflow ran. A technically successful automation can still make the job harder if it creates more alerts, hides context or shifts manual cleanup to another person.`],
      ['A responsible starting point', `Choose one narrow workflow and define the human boundary before building. Run Lighter can map the process with the owner and team, identify what can move automatically and document where judgement stays. The aim is to help the business and its people run lighter, with better systems supporting the work rather than pretending the people are unnecessary.`]
    ]
  }
};

const sharedClose = `## Automation note

${DISCLOSURE}

This content workflow follows approved Run Lighter brand rules, validation checks and publishing safeguards. A person remains accountable for the rules and the system stops when a critical check fails.

## Book an on-site automation review

If this question sounds familiar, Run Lighter can review the process at your Sydney business, identify the repeated work and recommend the strongest practical place to start. The review is a conversation about the real workflow, not a generic AI presentation.`;

export function buildSearchArticle(brief) {
  const article = ARTICLES[brief.search_question];
  if (!article) return '';
  const sections = article.sections.map(([heading, body]) => `## ${heading}\n\n${body}`).join('\n\n');
  const implementation = `## Test the change against real work

Before switching on a ${brief.topic} workflow broadly, test it with examples the team has already handled. Include a straightforward case, incomplete information, a duplicate, an unusual request and a situation where the normal owner is unavailable. Confirm what the system does, what it refuses to do and who receives the exception. The test should also show whether staff can understand the audit trail without needing the builder beside them.

Start with a small group and keep the original process available while the team confirms the new path. Record the trigger, the action taken and any human intervention. If the workflow creates noise, loses context or shifts cleanup to another person, stop and adjust it. A technically functioning automation is not useful when it makes the operation harder to understand.

## Look for operational evidence

The first evidence should be practical. Is less information being retyped? Are overdue actions easier to see? Does the right person receive the context needed to decide? Can an exception be found and corrected quickly? These signals are more useful than a dramatic demonstration because they reflect the work the business must handle every day.

Review the result with the people using the process. Keep what makes the handover clearer and remove steps that exist only because the technology can perform them. Expand the scope only after the first workflow is dependable, owned and genuinely lighter to operate.`;
  return `# ${brief.search_question}

## Short answer

${brief.direct_answer}

${article.intro}

${sections}

${implementation}

${sharedClose}`;
}

export function buildSearchCaption(brief) {
  const hooks = {
    'Which business process should I automate first?': 'Do not start with AI. Start with friction.',
    'How much does business automation cost in Sydney?': 'Automation cost follows workflow complexity.',
    'How do I automate lead follow-up without sounding robotic?': 'Automate the reminder, not the rapport.',
    'What can AI automate in a small service business?': 'AI is useful around the service.',
    'Can automation work with the software my business already uses?': 'Your current software may be enough.',
    'How do I choose an AI automation consultant in Sydney?': 'Choose the workflow thinking, not the hype.',
    'Will business automation replace my staff?': 'Automate repetition. Keep human judgement.'
  };
  return `${hooks[brief.search_question]}

The practical starting point is one repeated workflow with a clear trigger, a normal path and a named human owner for exceptions.

Map what happens today before choosing software. Let approved rules handle routine movement, reminders and preparation. Keep customer conversations, commercial decisions and unusual cases with the people accountable for them.

${DISCLOSURE}

The workflow follows defined brand, quality and publishing rules, with human accountability kept in place.

Read the full answer on the Run Lighter blog or book an on-site automation review.

#RunLighter #BusinessAutomation #SydneyBusiness #Operations`;
}
