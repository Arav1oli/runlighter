import { sleep } from '../utils.mjs';

export class MockInstagramPublisher {
  name = 'mock';
  async validateCredentials() { return { ok:true, mode:'mock', publishes:false }; }
  async publish({ contentId }) { return { media_id:`mock-${contentId}`, container_id:`mock-container-${contentId}`, status:'FINISHED', mock:true }; }
}

export class MetaInstagramPublisher {
  name = 'meta';
  constructor(config) { this.config = config; this.base = `https://graph.facebook.com/${config.metaApiVersion}`; }
  headers() { return { Authorization:`Bearer ${this.config.metaAccessToken}` }; }
  async validateCredentials() {
    const url = `${this.base}/${encodeURIComponent(this.config.metaIgUserId)}?fields=id,username`;
    const response = await fetch(url, { headers:this.headers() });
    if (!response.ok) throw new Error(`Meta credential test failed with HTTP ${response.status}`);
    const data = await response.json();
    return { ok:true, id:data.id, username:data.username };
  }
  async request(url, options = {}) {
    const response = await fetch(url, { ...options, headers:{ ...this.headers(), ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const code = data.error?.code ? ` Meta code ${data.error.code}.` : '';
      throw new Error(`Meta publishing request failed with HTTP ${response.status}.${code}`);
    }
    return data;
  }
  async publish({ imageUrl, caption, contentId, timeoutSeconds = 300, containerId = '', onContainer = async()=>{} }) {
    let creationId=containerId;
    if (!creationId) {
      const createUrl = `${this.base}/${encodeURIComponent(this.config.metaIgUserId)}/media`;
      const body = new URLSearchParams({ image_url:imageUrl, caption, is_carousel_item:'false' });
      const container = await this.request(createUrl, { method:'POST', body });
      if (!container.id) throw new Error('Meta did not return a media container ID');
      creationId=container.id;
      await onContainer(creationId);
    }
    const started = Date.now();
    let status = 'IN_PROGRESS';
    while (Date.now() - started < timeoutSeconds * 1000) {
      const check = await this.request(`${this.base}/${creationId}?fields=status_code,status`);
      status = check.status_code || check.status || status;
      if (status === 'FINISHED') break;
      if (['ERROR','EXPIRED'].includes(status)) throw new Error(`Instagram media container entered ${status} state`);
      await sleep(5000);
    }
    if (status !== 'FINISHED') throw new Error('Instagram media container timed out before becoming ready');
    const publishUrl = `${this.base}/${encodeURIComponent(this.config.metaIgUserId)}/media_publish`;
    const result = await this.request(publishUrl, { method:'POST', body:new URLSearchParams({ creation_id:creationId }) });
    if (!result.id) throw new Error('Meta did not return a published media ID');
    return { media_id:result.id, container_id:creationId, status:'FINISHED', content_id:contentId, mock:false };
  }
}

export function getInstagramPublisher(config, forceMock = false) {
  return forceMock || config.dryRun ? new MockInstagramPublisher() : new MetaInstagramPublisher(config);
}
