# Run Lighter homepage: master design brief

Overarching instructions for the homepage/landing build. Every design pass, review and
asset generation checks against this document. Owner: Adrian. When an instruction here
conflicts with an older doc or a habit, this document wins.

## 1. What the page is

One page that is both the homepage and the landing page for paid traffic. Tight, snappy,
conversion focused. The audience spans tradies to high-end professionals, so nothing
cartoonish, nothing patronising, no AI-generated humans.

## 2. Narrative structure (the non-negotiable order)

1. **Elevator pitch** at the top. One screen, instantly clear.
2. **Clear storytelling about what the business does** across the next three to four
   page-scrolls. Meaningful automation, custom to the business: it saves time, lifts
   conversions, and with AI much of the repeated work in a service business no longer
   needs a person doing it. The judgement still does. Remaining copy is drawn from the
   live site, not invented.
3. **Only after the information is given** do we ask for input: the interactive board
   ("What's the one problem you'd eliminate in your business today?") and the lead form.
   Give before you ask. Information first, participation second.

## 3. The concept: an analog signal path

The page is a patch-cable signal path, warm analog hardware, not SaaS chrome.
One lead drops in at the top, plugs in, and one continuous cable carries the signal
down the whole page, docking at stations. Every element is on the line; nothing is an
island. The board and the form are stations too.

The closing image: the line runs into a speaker beneath the lead form, and the
travelling bulges in the cable walk out as people. Leads in, clients out.

## 3a. Rulings (standing decisions)

- The side-entry seat clip is **banned** from the page: every filmed vignette must
  reference the top-down flow, with the cable entering from the top of frame.
- The cord **is** the headline underline: it emanates from under the hero's final word,
  loops once, and dives down the page. The static CSS underline is retired.
- The drawn cord is fabric: dark jacket, warm core, chevron braid, sheen, ~11px gauge,
  with fat travelling bulges. Never a thin flat line.
- The outro is the **side-on brass megaphone** Higgsfield film (supersedes the earlier
  speaker ruling): one single cord dropping from beneath the form into the horn, people
  marching out **left to right**, no audio, film colour-mapped to the page's #F3EFE5 so
  no video box exists. The CSS walker system is retired.
- The hero carries a small ghosted **plug-in film** behind the headline: SIDE VIEW of a
  brass jack plug descending from the top of frame into the socket below it, seating on
  the beat. It stays small — the warm bloom sits exactly at the point the plug enters
  the hole, and the headline remains the loudest thing on screen. The earlier
  wrap-around-jack clip is retired everywhere (hero and station one).
- **One cord only** in any filmed vignette. A shot with doubled or forked cable is
  rejected or cropped before animation.
- **Congruence at every hand-off.** Wherever the drawn cord meets a filmed cable it
  touches it: same x, overlapping past the feathered edge into the frame, and at the
  same rendered gauge (the drawn gauge steps up on desktop so it matches the filmed
  braid at the size it displays). Never "video, and then cords".
- **The cord never sits behind text. Ever.** Not under it on a lower layer, not at any
  width. The route is computed from measured copy rects and travels only through empty
  space: page margins, section gaps, the rail corridor, the empty socket slot. The one
  sanctioned touch is the headline underline, which sits under the word, not behind it.
  Passing beneath an opaque panel (the patch board, the trust strip) is allowed: the
  cord is hidden like hardware, and no text is ever read over cable. An automated
  occlusion audit (`.render/occl.cjs`) proves zero crossings at 320–1440 before any
  pass is called done.

## 4. Visual language

- **Palette**: the existing brand tokens. Oat, paper, moss, sage, terracotta, ochre,
  eucalyptus, clay. Aesop-adjacent warm craft, never SaaS indigo.
- **Colour blocking**: sections sit in distinct full-bleed bands: creams, beiges, light
  olives, sage, with one deep moss block (the form). Not one flat colour for the page.
- **Texture**: every band carries a whisper of grain. Flat fills read digital; texture
  reads printed.
- **Typography**: DM Sans display (tight negative tracking) over Manrope body.
- **Imagery**: macro photography of warm analog hardware on cream panels that fill the
  frame edge to edge, brass, braided cables, dim moss LEDs. Video vignettes are shot on
  the page's own background colour and soft-masked so they sit in the page, never boxed
  like an embedded clip. Drawn cables and filmed cables match colour so vector hands
  over to film at each station.

## 5. Motion rules

- **Animation never disrupts scroll.** No pinning, no hijack, no jerk. Everything plays
  in line with the scroll and exists to assist understanding, never to perform.
- **Cables are alive, never small and static.** Once connected they pulse (breathing
  stroke) and carry travelling bulges, peristalsis, like a snake swallowing: visible
  waves moving down the line. This applies to drawn cables and to any filmed ones.
- **Lights warm up, they never snap on.** Every LED, jack and lamp blooms through warm
  amber before settling, like analog valve gear. When something is plugged in, a lit
  reference appears elsewhere on the page (e.g. the nav lamp).
- **Docking is the event.** Text and states pop when the signal arrives, not at vague
  scroll percentages. Cause and effect teaches the page's grammar.
- **Mobile first.** Animations are designed at 390px before desktop. Small is fine;
  embedded and referenced is mandatory. Reduced-motion and no-JS get a clean static page.
- **Cables never lie over copy, and never under it either.** The cord routes around
  text through measured empty space (see the ruling in 3a); layering is never the fix.

## 6. The interactive journey (bottom of page)

- Question: "What's the one problem you'd eliminate in your business today?"
- The lead follows the cursor on desktop; tap to patch on touch.
- On plug: connection is quick but smooth, services for that area pop out below, then a
  gentle auto-glide down to the lead form. The plug carries into the form: jack seats,
  light warms, and the primary business concern field is prefilled with their choice.
  The visitor has taken part in the journey; the form is its natural next step.
- Free before the ask: the board gives value with no email required.

## 7. Trust and contact

- Phone number and name in the header: 0466 039 459, Adrian. No photo.
- Form posts to the production FormSubmit config; a hidden field records the patched
  area for lead-quality context.
- Honest claims only. No invented testimonials; proof slots stay empty until real
  client lines exist.

## 8. Storytelling and clarity principles (researched, adopted)

- Scroll must drive the narrative, not merely trigger animations; define the story in
  plain prose before designing the visuals.
- Clear arc: beginning (a lead arrives), tension (where work jams), reveal (the patched
  system), resolution (people walking out of the speaker).
- Preserve breathing space and visible exits; never force a tunnel. CTAs stay reachable
  at all times (nav + sticky).
- Message hierarchy: headline speaks to the pain, subhead explains why care, body tells
  the story, proof mid-to-lower, CTA repeated and action-oriented.
- Performance is perception: a stuttering page never feels premium. Watch page weight,
  lazy-load media, no auto-playing boxed video.
- One thought per screen. If a section carries two ideas, split it or cut one.

## 9. Production workflow

- Higgsfield generates stills first (cheap, judged against this brief), then Seedance
  animates approved stills. Every asset passes the palette and full-frame-panel check
  before integration. The recursive loop renders the page at 390 and 1440, judges
  against this document, fixes, and re-renders before anything reaches Adrian.
- Staging deploys go assets first, page last, verified live before it is shown as done.

## 10. Review checklist (run every pass)

1. Does the top 3–4 scrolls tell a stranger exactly what Run Lighter does?
2. Does anything disrupt the scroll? Kill it.
3. Are all connected cables pulsing with travelling bulges? Are any lights snapping on?
4. Does every animation assist comprehension, referenced to the elements around it?
5. Mobile at 390 and 320: no overflow, thumb-sized targets, weight in budget.
6. Is the ask (board + form) after the information, never before?
7. Is every claim on the page true?
