# Run Lighter content launch checklist

## Dry-run acceptance

- [ ] Run `npm ci`
- [ ] Run `npm test`
- [ ] Run `npm run content:dry-run`
- [ ] Open `preview/14-day/index.html`
- [ ] Review all captions, creatives and articles
- [ ] Run `npm run build`
- [ ] Confirm the existing landing page and `/blog/` still render correctly
- [ ] Confirm drafts are absent from `blog/`, `feed.xml` and `sitemap.xml`

## GitHub repository setup

- [ ] Confirm GitHub Pages deploys the `main` branch root
- [ ] Add repository variable `CAMPAIGN_START_DATE`
- [ ] Add repository variable `CAMPAIGN_DAYS=14`
- [ ] Set `CONTINUOUS_CONTENT=true` only when daily publishing should continue beyond the initial campaign
- [ ] Keep `AUTO_PUBLISH=false`, `INSTAGRAM_AUTO_PUBLISH=false` and `DRY_RUN=true`
- [ ] Run the workflow manually with `dry-run`
- [ ] Download and review the preview artifact

## Provider setup

- [ ] Add `OPENAI_API_KEY` as a GitHub Actions secret if using live generation
- [ ] Set `TEXT_PROVIDER=openai` only after the structured-output test succeeds
- [ ] Set `IMAGE_PROVIDER=openai` only after image and overlay tests succeed
- [ ] Leave `RESEARCH_PROVIDER=none` unless topical research is required

## Meta setup

- [ ] Confirm the Instagram account is professional and correctly linked in Meta
- [ ] Create or select the Meta app
- [ ] Grant the current official publishing permissions
- [ ] Generate and securely store a suitable access token
- [ ] Add `META_ACCESS_TOKEN` and `META_IG_USER_ID` as Actions secrets
- [ ] Set a current supported `META_API_VERSION` repository variable
- [ ] Run `node scripts/content/cli.mjs credentials-test` with live credentials in a secure environment
- [ ] Stage one private launch test and verify the public media URL

## Activation order

1. Set `DRY_RUN=false`.
2. Keep both publish flags false and manually run `stage` for the launch date.
3. Review the staged files and logs.
4. Set `AUTO_PUBLISH=true` to permit the 7:00 am website step.
5. Run one manual website publication and verify the article.
6. Set `INSTAGRAM_AUTO_PUBLISH=true` only after the website and credential checks pass.
7. Monitor the first scheduled 5:00 am and 7:00 am workflows.

## Emergency controls

- Set repository variable `CONTENT_KILL_SWITCH=true` for an immediate stop.
- Or run `npm run content:pause`, commit `data/campaign-control.json` and push.
- Restore only after the failure is understood and a dry-run passes.
