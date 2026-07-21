# Run Lighter

Practical automation for growing businesses in Sydney.

Live site: https://arav1oli.github.io/runlighter/

The repository contains the landing page, native blog, daily content automation system, generated campaign previews, original photography, social graphics and business handover documents.

## Main paths

- `index.html`: landing page
- `blog/`: generated public blog pages and shared blog styles
- `_content/blog/`: editable article source records
- `assets/`: website images and favicon
- `generated/`: daily Instagram, website and Open Graph creative assets
- `data/`: content registry, briefs, publication queue and controls
- `scripts/content/`: content system command line entrypoint
- `src/lib/`: providers, publishing, rendering, validation and site building
- `social/`: profile, cover, launch, story and campaign graphics
- `docs/`: implementation, launch, handover and campaign documentation

## Start safely

```bash
npm ci
npm test
npm run content:dry-run
npm run build
```

Open `preview/14-day/index.html` to review the initial campaign. Live publishing defaults to off. See [content automation](docs/content-automation.md) and the [launch checklist](docs/launch-checklist.md) before adding credentials or enabling scheduled publishing.
