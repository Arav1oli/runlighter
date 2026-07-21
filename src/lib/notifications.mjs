export async function notify(config, title, detail) {
  const message = `${title}\n${detail}`;
  if (config.notificationProvider === 'github') {
    if (process.env.GITHUB_STEP_SUMMARY) {
      const { appendFile } = await import('node:fs/promises');
      await appendFile(process.env.GITHUB_STEP_SUMMARY, `## ${title}\n\n${detail}\n\n`, 'utf8');
    }
    return { delivered:true, channel:'github-summary' };
  }
  if (config.notificationProvider === 'webhook' && config.notificationWebhookUrl) {
    const response = await fetch(config.notificationWebhookUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ text:message }) });
    return { delivered:response.ok, channel:'webhook', status:response.status };
  }
  return { delivered:false, channel:'none' };
}
