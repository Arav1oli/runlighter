# Meta publishing safety boundary

This boundary is fail closed. It applies to every scheduled, recovery and manual Run Lighter pass.

## Exclusive allowlist

- Meta business: `2419577311552088`
- Business Suite asset: `1171129046091419`
- Facebook Page: `Run Lighter`, Page ID `61592301111343`
- Instagram: `@run_lighter`
- Ad account: `264193331473545`
- Campaign: `120252651440610735`
- Ad set: `120252651440620735`

No other Meta Page, Instagram account, business asset, ad account, campaign or ad set is authorised. A general statement about browser access does not widen this allowlist.

## Mandatory preflight

Immediately before every organic Publish click, and again before any retry:

1. Run `npm run meta:destination-check` with all exact identifiers and `--organic-action publish-new-crosspost`.
2. Inspect the composer destination selector. Exactly `Run Lighter` and `run_lighter` must be selected. No third asset may appear.
3. Confirm the Facebook Page ID is `61592301111343` and the Instagram username is `run_lighter`. Names alone are insufficient.
4. Confirm boosting is off.
5. Record the verified identifiers and the visible destination state in the audit before clicking Publish.

If an identifier is hidden, ambiguous, missing or different, do not publish. Preserve the prepared package, record the blocked control and notify Adrian.

## Prohibited actions

- Never click Share or Repost for a Run Lighter package.
- Never select another Page or account, even temporarily.
- Never use an existing organic post as an ad creative.
- Never click `Update post` or accept a warning that Ads Manager will update the original post.
- Never change Page access, connected-account or crossposting settings during the daily pass.
- Never delete, edit or attempt to repair content on an unauthorised asset.
- Never enable or accept Meta-generated text, image or video variations for Run Lighter ads.
- Never enable visual touch-ups, creative translations, overlays, music, CTA enhancement, animation, brightness or contrast enhancement, or placement-media substitution.
- Never publish or discard a pre-existing unrelated draft while preparing a new ad change. Identify it and obtain an explicit owner decision first.

Keep ad copy, imagery and video exactly as owner-approved. Immediately before publishing a new paid ad, verify each creative enhancement is off and record the visible state in the audit.

Paid Run Lighter lead ads are for Sydney. Before publishing a new ad, verify the ad-set location control is Sydney, NSW and is not broadened to Australia. If the published or draft location cannot be verified precisely, do not publish or modify the ad set. Preserve the current budget unless Adrian provides an explicit numeric change.

Ads must use a separate uploaded creative and ad-level CTA. If Meta cannot configure the CTA without modifying the organic post, leave the ad paused and report the exact blocker.

## Verification

After publication, verify the Facebook permalink resolves to Page ID `61592301111343` and the Instagram URL resolves to `run_lighter`. The Business Suite receipt must show only those two destinations. Any mismatch makes the Meta stage failed, even if the website package is live.

Use a dedicated Run Lighter browser profile for every Meta write. A shared Meta browser profile or session is not authorised for publishing. If a dedicated profile is unavailable, deploy and preserve the website package, refuse the Meta write, record the blocked control and notify Adrian. If the controllable Meta session contains an active non-Run Lighter composer, account picker selection or unpublished edit, do not perform a Meta write from that session.
