# Run Lighter daily content system

## System overview

Run Lighter remains a static GitHub Pages website. A small Node.js content system extends the existing stack without introducing a new web framework. It prepares a coordinated Instagram and blog package at 5:00 am Australia/Sydney time, then publishes the validated package at 7:00 am when live controls are enabled.

The repository detected during implementation was a single `index.html` site deployed from the `main` branch to GitHub Pages. Its visual system uses DM Sans, Manrope, warm oat and paper surfaces, earthy green, sage, clay and restrained supporting colours. The content renderer uses the same palette and an approved system-font fallback. Existing social and campaign files were preserved.

## Architecture

- `scripts/content/cli.mjs`: operator commands and GitHub Actions entrypoint
- `src/lib/topic-engine.mjs`: evergreen and optional topical candidate scoring
- `src/lib/providers/`: replaceable research, text and image providers
- `src/lib/creative.mjs`: deterministic text overlay and PNG/WebP renderer
- `src/lib/validation.mjs`: fail-closed editorial, brand and technical checks
- `src/lib/publishing/instagram.mjs`: official Meta container and media-publish flow
- `_content/blog/`: editable article source records
- `data/`: registry, daily briefs, queue and campaign control
- `generated/`: creative assets
- `logs/content/`: structured audit records
- `blog/`, `feed.xml`, `sitemap.xml`: public build outputs

GitHub Pages excludes source data, logs, previews and scripts through `_config.yml`. Draft images are placed under `/generated/drafts/`, blocked in `robots.txt` and never linked from the public blog. Published assets move to `/generated/YYYY-MM-DD/`.

## Daily workflow

The GitHub Actions workflow runs every 15 minutes. The CLI calculates local time with the IANA timezone `Australia/Sydney`, so daylight saving changes do not alter the 5:00 am and 7:00 am local schedule. It runs only from `CAMPAIGN_START_DATE` through the configured campaign length. Date-based locks, registry state and queue state make reruns idempotent.

At 5:00 am the system selects a topic, builds a brief, generates text and images, validates everything, records an audit log and stages the package. If a reviewed campaign draft already exists, the job validates it and promotes it to `staged` without regenerating it. At 7:00 am it validates again, publishes the website, verifies the public article and image URLs, then uses the official Meta Instagram Content Publishing API if Instagram publishing is enabled.

## Accounts and configuration

Required for live AI generation:

- OpenAI API project and `OPENAI_API_KEY`
- `TEXT_PROVIDER=openai` and/or `IMAGE_PROVIDER=openai`
- `TEXT_MODEL` and `IMAGE_MODEL`

The OpenAI integration uses the Responses API with structured JSON output and the Image API generation endpoint. Current official references: [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) and [Image generation](https://developers.openai.com/api/docs/guides/image-generation).

Required for Instagram:

- Instagram professional account connected in a supported Meta setup
- Meta app with the permissions required by the account and publishing route
- Long-lived access token stored as `META_ACCESS_TOKEN`
- Instagram professional account ID stored as `META_IG_USER_ID`
- A currently supported Graph API version stored as `META_API_VERSION`
- Public HTTPS image URL

The adapter creates a media container with `/{ig-user-id}/media`, polls its status, then publishes through `/{ig-user-id}/media_publish`. Meta requires authentication to view some current documentation, so verify the current account and permission requirements in the [official Instagram Platform documentation](https://developers.facebook.com/docs/instagram-platform/content-publishing/) before enabling live mode. `META_API_VERSION` has no silent code default for this reason.

## Safe defaults

`.env.example` defaults to mock providers, dry-run mode and disabled publishing:

```text
AUTO_PUBLISH=false
INSTAGRAM_AUTO_PUBLISH=false
DRY_RUN=true
CONTENT_KILL_SWITCH=false
CONTINUOUS_CONTENT=false
```

Secrets belong in GitHub Actions secrets, never repository variables or committed files. The system does not print credentials and redaction is covered by tests.

## Operator commands

```bash
npm run content:generate -- --date YYYY-MM-DD
npm run content:preview
npm run content:validate -- --date YYYY-MM-DD
npm run content:stage -- --date YYYY-MM-DD
node scripts/content/cli.mjs publish-website --date YYYY-MM-DD --confirm-live
node scripts/content/cli.mjs publish-instagram --date YYYY-MM-DD --confirm-live
npm run content:dry-run
npm run content:reconcile -- --date YYYY-MM-DD
npm run content:status
npm run content:pause
npm run content:resume
npm run build
npm test
```

Live commands require both safe configuration flags and an explicit `--confirm-live` flag outside GitHub Actions. Scheduled publishing is controlled by the pre-approved repository variables.

## Provider behaviour

`RESEARCH_PROVIDER=none` continues in evergreen mode and records that topical research was unavailable. `RESEARCH_PROVIDER=openai` uses web search and records sources. A failed research request does not fail the day. Text or image provider failure retries with exponential backoff, then fails without publication.

The mock providers generate complete, deterministic fixtures without paid APIs. They are suitable for launch checks and the 14-day preview, not for pretending that external research occurred.

## Validation and recovery

Critical validation fails closed. The system checks the exact automation disclosure in the caption, article and creative source, content length, Australian English, duplicate topics, unique titles and slugs, image dimensions, brand presence, prohibited claims, draft exclusion and publishing state.

Use `npm run content:status` to inspect the registry. Use `content:reconcile` if Meta publishes but a later registry write fails. Website publication never creates a second article for the same date. Instagram retries reuse the stored content ID and refuse to run when a media ID already exists.

Pause immediately with `npm run content:pause`. For a remote campaign, commit and push the updated `data/campaign-control.json`. The repository variable `CONTENT_KILL_SWITCH=true` is the independent emergency stop.

## Promotion scoring

Every package is scored across audience relevance, hook strength, benefit clarity, practical value, visual quality, distinctiveness, offer alignment, misunderstanding risk, time sensitivity and correct-audience likelihood. A post is only marked as a promotion candidate at or above the configured threshold and after all safety checks pass. The system never creates an ad or spends money.

## Extending the campaign

Set `CONTINUOUS_CONTENT=true` to keep the daily workflow running beyond the initial review campaign. When it is false, change `CAMPAIGN_DAYS` and `CAMPAIGN_START_DATE` in repository variables to run another fixed campaign. The topic engine has a reusable source pool and checks the previous 90 days, so the 14-day campaign is an initial review set rather than a hard-coded publishing sequence. Add new evergreen source entries to `src/lib/topics.mjs` or implement another research adapter behind `src/lib/providers/research.mjs`.

## Known limitations

- Public URL verification depends on GitHub Pages deployment latency.
- Meta permission and token setup must be completed by the account owner.
- The deterministic creative validator confirms source text and layout bounds by construction; it does not OCR the final raster.
- Live generated backgrounds may vary, but all important text remains deterministic.
- GitHub Actions scheduled events can be delayed by GitHub. The local-time guard prevents duplicates but cannot force GitHub to start exactly on the minute.
