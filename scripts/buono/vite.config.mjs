import { fileURLToPath } from 'node:url';
import path from 'node:path';

const runlighterRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const buonoSiteRoot = path.resolve(runlighterRoot, '../buono-launchpad/site');
const staticSourceRoot = path.resolve(runlighterRoot, 'scripts/buono/static-src');
const nodeModules = path.resolve(buonoSiteRoot, 'node_modules');

export default {
  root: staticSourceRoot,
  base: '/launchpads/buono/',
  publicDir: path.resolve(buonoSiteRoot, 'public'),
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      { find: 'next/image', replacement: path.resolve(staticSourceRoot, 'ImageShim.tsx') },
      { find: 'react/jsx-runtime', replacement: path.resolve(nodeModules, 'react/jsx-runtime.js') },
      { find: 'react-dom/client', replacement: path.resolve(nodeModules, 'react-dom/client.js') },
      { find: /^react$/, replacement: path.resolve(nodeModules, 'react/index.js') },
    ],
  },
  build: {
    outDir: path.resolve(runlighterRoot, 'launchpads/buono'),
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2020',
  },
};
