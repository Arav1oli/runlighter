const form=document.querySelector('#workflow-check');
const result=document.querySelector('#check-result');
const emailLink=document.querySelector('#email-result');

const labels={
  workflow:'Workflow',frequency:'Frequency',visibility:'Visibility',ownership:'Ownership',exceptions:'Exceptions',consequence:'Consequence'
};

form?.addEventListener('submit',event=>{
  event.preventDefault();
  const values=Object.fromEntries(new FormData(form));
  const missing=Object.keys(labels).filter(key=>!values[key]);
  if(missing.length){document.querySelector(`[name="${missing[0]}"]`)?.focus();return;}
  const score=['frequency','visibility','ownership','exceptions','consequence'].reduce((total,key)=>total+Number(values[key].split('|')[0]),0);
  const band=score>=19?'Strong first-workflow candidate':score>=13?'Worth mapping before automating':'Clarify the process before automating';
  const reason=score>=19?'The work is repeated, consequential and difficult to see or hand over. A bounded proof can test one trigger, one owner and one outcome without replacing professional judgement.':score>=13?'There is enough repeatability to investigate, but the owner, exceptions or source of truth needs to be made explicit before software is connected.':'The process is not yet stable enough for a safe automation proof. Document the start, finish, owner and exception rules first.';
  result.dataset.visible='true';
  result.querySelector('h2').textContent=band;
  result.querySelector('[data-score]').textContent=`Your friction score is ${score}/25.`;
  result.querySelector('[data-reason]').textContent=reason;
  const lines=[
    'Accounting Workflow Friction Check',
    `Result: ${band} (${score}/25)`,
    ...Object.entries(labels).map(([key,label])=>`${label}: ${values[key].replace(/^\d+\|/,'')}`),
    '',
    'The score was calculated locally at runlighter.com. I chose to share it by email.'
  ];
  emailLink.href=`mailto:adrian@runlighter.com?subject=${encodeURIComponent(`Workflow check: ${values.workflow}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
  result.scrollIntoView({behavior:'smooth',block:'center'});
});
