---
name: run-lighter-real-photo-campaign
description: Turn a user-supplied real-world photo and business concept into a reviewed Run Lighter social creative, answer-first article and Meta lead ad. Use when Adrian supplies or approves a real photo for Run Lighter, asks to flesh out the commercial idea, requests a square ad or post, or authorises the approved concept to go live across the website, Instagram, Facebook and the existing Meta ad set.
---

# Run Lighter Real Photo Campaign

Use real scenes to connect a recognisable business problem with a credible life or business possibility. Preserve the truth of the source photo, keep claims modest and make one coherent package rather than unrelated outputs.

## Fixed Run Lighter boundaries

- Use Australian English, Australia/Sydney dates and no em dashes.
- Publish only to Run Lighter, the Facebook Page Run Lighter and Instagram `@run_lighter`.
- Paid ads may use only Meta ad account `264193331473545`, campaign `120252651440610735`, ad set `120252651440620735` and qualified instant form `1049875634638986`.
- Never create another campaign, ad set or schedule. Never increase a budget automatically.
- Keep the exact disclosure once in social and article copy: `This post has been automated so we can run lighter.`
- Fail closed on an account, Page, Instagram account, form or destination mismatch.

## 1. Receive and audit the source

1. Treat the attached photo as an edit target, not permission to publish.
2. Record its source path, dimensions and SHA-256 hash.
3. Confirm Adrian supplied the photo or has stated that Run Lighter may use it.
4. Check for identifiable private people, number plates, addresses, client information, third-party logos and other sensitive details. Remove or obscure only what is necessary.
5. Do not fabricate customer results, locations, signs, interfaces or operational details.
6. Leave additional photos unused when Adrian says to hold them.

## 2. Develop the commercial idea

Build the concept around one buyer, one repeated workflow, one visible before-state, the Run Lighter mechanism and one credible next action.

- Prefer established Sydney B2B and professional-service businesses. At most one in four concepts should be led by trades or field services.
- Translate the workflow problem into an outcome the owner values, such as time, reliability, visibility or a better client experience.
- Explain what starts the workflow, the normal path, the exception path and what remains under human judgement.
- Do not promise a quantified saving without a measured baseline. Treat an hour as a hypothesis to test, not a guarantee.

## 3. Make the first review creative

1. Create a polished 1080 by 1080 square from the real source photo.
2. Preserve the scene and photographic character. Use crops, lighting correction and deterministic overlays before considering generative changes.
3. Use strong mobile contrast and the earthy Run Lighter palette.
4. Keep the core artwork line short and make the key consequence or possibility visually dominant.
5. Include the Run Lighter mark and the exact readable disclosure.
6. Do not add robots, holograms, generic dashboards, invented logos or an exact likeness of Adrian.
7. Show the source and edited creative together in chat. State what changed.
8. Wait for explicit approval of the creative. A file attachment or general discussion is not approval.

## 4. Expand only after approval

After Adrian explicitly approves the creative:

- Write a coordinated Instagram and Facebook caption with a strong first line, one practical insight, a low-pressure call to action, three to eight hashtags and the disclosure once.
- Write a 700 to 1,300 word answer-first article from the same idea. Use the buyer question as the H1 and answer it in the first 50 words. Include the normal workflow, exception path, human judgement, metadata, alt text, internal links, structured data and a practical call to action.
- Derive website hero and Open Graph crops from the approved real photo without inventing new scene content.
- Write claim-safe Meta primary text, headline and description for the qualified instant form.

## 5. Validate before any live action

Check all of the following:

- Source provenance, privacy and approval are recorded.
- Creative is legible, not blank or clipped and matches the approved hash.
- The package is distinct from recent Run Lighter work.
- Article H1 is the exact buyer question and the direct answer appears in the first 50 words.
- Copy is complete, uses Australian English and contains no em dash.
- The disclosure count is correct.
- Canonical, media and internal URLs are correct.
- The full test suite and production build pass.

## 6. Publish in order

1. Publish the website article, deploy main and verify the public article and media URLs.
2. Verify canonical URL, Article and Organisation structured data and XML sitemap entry.
3. Submit IndexNow and record the receipt. Do not use Google's Indexing API for ordinary articles.
4. Cross-post the approved image and caption once to `@run_lighter` and the Run Lighter Facebook Page. Verify both URLs and IDs.
5. Create one ad inside the fixed existing campaign and ad set. Use the qualified form `1049875634638986`, the existing budget and no Meta-generated text, image, video or translation variants.
6. Confirm the account, campaign, ad set, Page, Instagram account, form, image, copy and destination again immediately before publishing the ad.

If any live verification fails, keep the ad or package staged and record the exact blocker. Do not publish a partial or mismatched package.

## 7. Record the release

Save a publication record containing:

- content ID and Australia/Sydney date
- source and approved creative hashes
- approval timestamp and approved concept
- article URL, canonical and sitemap status
- IndexNow status and receipt
- Instagram media ID and URL
- Facebook post ID and URL
- Meta account, campaign, ad set, form and ad ID
- budget-change status, which must remain unchanged
- validation, test and build results
- any blocker or unresolved verification

Commit only the new skill, approved campaign package and publication state. Preserve unrelated work in a dirty worktree.
