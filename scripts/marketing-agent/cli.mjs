#!/usr/bin/env node
import { loadMarketingConfig } from '../../src/lib/marketing-agent/config.mjs';
import { getMetaAdapter } from '../../src/lib/marketing-agent/meta.mjs';
import { runMarketingLearningSystem, marketingStatus } from '../../src/lib/marketing-agent/engine.mjs';
import { withLock } from '../../src/lib/locks.mjs';
import { fromRoot, redact, zonedParts } from '../../src/lib/utils.mjs';

const args = process.argv.slice(2);
const command = args.shift() || 'status';
const option = (name, fallback = '') => {
  const index = args.indexOf(`--${name}`);
  if (index < 0) return fallback;
  return args[index + 1] && !args[index + 1].startsWith('--') ? args[index + 1] : true;
};
const flag = name => args.includes(`--${name}`);
const baseConfig = loadMarketingConfig();
const config = {
  ...baseConfig,
  dryRun: flag('live') ? false : (flag('dry-run') || baseConfig.dryRun)
};
const date = option('date', zonedParts(new Date(), config.timezone).date);
const fixture = option('fixture', flag('dry-run') || config.dryRun
  ? fromRoot('data', 'marketing-agent', 'fixtures', 'sample-meta-snapshot.json')
  : '');

try {
  if (command === 'daily' || command === 'run') {
    const result = await withLock(date, 'marketing-learning', () => runMarketingLearningSystem(config, {
      date,
      snapshotPath: fixture,
      apply: flag('apply'),
      confirmLive: flag('confirm-live')
    }));
    console.log(JSON.stringify(result.report, null, 2));
  } else if (command === 'status') {
    console.log(JSON.stringify(await marketingStatus(), null, 2));
  } else if (command === 'credentials-test') {
    const adapter = getMetaAdapter(config, { snapshotPath: option('fixture', '') });
    console.log(JSON.stringify(await adapter.validateCredentials(), null, 2));
  } else {
    throw new Error(`Unknown marketing-agent command: ${command}`);
  }
} catch (error) {
  console.error(redact(error.message));
  process.exitCode = 1;
}
