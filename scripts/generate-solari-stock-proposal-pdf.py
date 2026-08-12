#!/usr/bin/env python3
"""Generate the downloadable Solari & Stock marketing proposal PDF."""

from __future__ import annotations

import html
import shutil
from pathlib import Path

from reportlab.graphics.shapes import Drawing, Rect
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "solari-stock" / "assets"
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PDF = OUTPUT_DIR / "Solari_and_Stock_Marketing_Implementation_Proposal.pdf"
DEPLOY_PDF = ASSET_DIR / "Solari_and_Stock_Marketing_Implementation_Proposal.pdf"
LOGO = ASSET_DIR / "solari-stock-logo.png"
DIRECTORS = ASSET_DIR / "solari-stock-directors.png"

PAGE_W, PAGE_H = A4
INK = colors.HexColor("#231F20")
TEAL = colors.HexColor("#7BA6AE")
TEAL_DARK = colors.HexColor("#3F6F77")
PALE_TEAL = colors.HexColor("#E9F1F2")
SOFT_GREY = colors.HexColor("#F4F7F7")
MID_GREY = colors.HexColor("#545454")
DIVIDER = colors.HexColor("#D7E2E4")
WARM = colors.HexColor("#F3EEE8")
PAPER = colors.HexColor("#FDFCF9")
WHITE = colors.white


styles = getSampleStyleSheet()


def style(name: str, **kwargs) -> ParagraphStyle:
    base = kwargs.pop("parent", styles["BodyText"])
    return ParagraphStyle(name, parent=base, **kwargs)


BODY = style(
    "Body",
    fontName="Helvetica",
    fontSize=9.4,
    leading=13.6,
    textColor=MID_GREY,
    spaceAfter=4,
)
BODY_SMALL = style(
    "BodySmall",
    fontName="Helvetica",
    fontSize=8.2,
    leading=11.6,
    textColor=MID_GREY,
)
BODY_TINY = style(
    "BodyTiny",
    fontName="Helvetica",
    fontSize=7.2,
    leading=10.2,
    textColor=MID_GREY,
)
EYEBROW = style(
    "Eyebrow",
    fontName="Helvetica-Bold",
    fontSize=7.4,
    leading=10,
    textColor=TEAL_DARK,
    tracking=1.2,
    spaceAfter=7,
)
TITLE = style(
    "Title",
    fontName="Helvetica-Bold",
    fontSize=31,
    leading=29,
    textColor=INK,
    spaceAfter=12,
)
SECTION_TITLE = style(
    "SectionTitle",
    fontName="Helvetica-Bold",
    fontSize=22,
    leading=23,
    textColor=INK,
    spaceAfter=7,
)
SECTION_DECK = style(
    "SectionDeck",
    fontName="Helvetica",
    fontSize=10,
    leading=14.5,
    textColor=MID_GREY,
    spaceAfter=13,
)
CARD_TITLE = style(
    "CardTitle",
    fontName="Helvetica-Bold",
    fontSize=10.2,
    leading=12.5,
    textColor=INK,
    spaceAfter=6,
)
CARD_LABEL = style(
    "CardLabel",
    fontName="Helvetica-Bold",
    fontSize=6.9,
    leading=9,
    tracking=0.85,
    textColor=TEAL_DARK,
    spaceAfter=5,
)
PRICE = style(
    "Price",
    fontName="Helvetica-Bold",
    fontSize=27,
    leading=27,
    textColor=INK,
    spaceAfter=5,
)
SAVING_PRICE = style(
    "SavingPrice",
    fontName="Helvetica-Bold",
    fontSize=22,
    leading=22,
    textColor=INK,
    spaceAfter=4,
)
PRICE_SMALL = style(
    "PriceSmall",
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=13,
    textColor=TEAL_DARK,
    spaceAfter=7,
)
COVER_DECK = style(
    "CoverDeck",
    fontName="Helvetica",
    fontSize=11.3,
    leading=16,
    textColor=MID_GREY,
    spaceAfter=14,
)
WHITE_EYEBROW = style(
    "WhiteEyebrow",
    fontName="Helvetica-Bold",
    fontSize=7,
    leading=9,
    tracking=0.9,
    textColor=WHITE,
)
FOOTER = style(
    "Footer",
    fontName="Helvetica-Bold",
    fontSize=6.3,
    leading=8,
    tracking=0.65,
    textColor=MID_GREY,
)


def p(text: str, paragraph_style: ParagraphStyle = BODY) -> Paragraph:
    return Paragraph(text, paragraph_style)


def plain(text: str) -> str:
    return html.escape(text, quote=False)


def section_header(eyebrow: str, title: str, deck: str | None = None):
    flow = [p(plain(eyebrow.upper()), EYEBROW), p(plain(title), SECTION_TITLE)]
    if deck:
        flow.append(p(plain(deck), SECTION_DECK))
    return flow


def card(title: str, body: str, background=PAPER, label: str | None = None):
    content = []
    if label:
        content.append(p(plain(label.upper()), CARD_LABEL))
    content.extend([p(plain(title), CARD_TITLE), p(plain(body), BODY_SMALL)])
    table = Table([[content]], colWidths=[81.5 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.7, DIVIDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table


def card_grid(items, backgrounds=(PAPER, PALE_TEAL), gap=6 * mm):
    rows = []
    for index in range(0, len(items), 2):
        left = items[index]
        right = items[index + 1] if index + 1 < len(items) else None
        left_card = card(*left, background=backgrounds[index % len(backgrounds)])
        right_card = (
            card(*right, background=backgrounds[(index + 1) % len(backgrounds)])
            if right
            else ""
        )
        rows.append([left_card, right_card])
    grid = Table(rows, colWidths=[81.5 * mm, 81.5 * mm], hAlign="LEFT")
    grid.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), gap / 2),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), gap),
            ]
        )
    )
    return grid


def labelled_callout(label: str, body: str, background=PALE_TEAL):
    table = Table(
        [[p(plain(label.upper()), CARD_LABEL), p(body, BODY)]],
        colWidths=[36 * mm, 127 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.8, DIVIDER),
                ("LINEBEFORE", (0, 0), (0, -1), 3, TEAL_DARK),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table


def bar(width_mm: float, fill_color):
    drawing = Drawing(142 * mm, 8 * mm)
    drawing.add(Rect(0, 1.5 * mm, 142 * mm, 4 * mm, fillColor=SOFT_GREY, strokeColor=None))
    drawing.add(Rect(0, 1.5 * mm, width_mm * mm, 4 * mm, fillColor=fill_color, strokeColor=None))
    return drawing


def on_cover(canvas, doc):
    canvas.saveState()
    canvas.setTitle("Solari & Stock Marketing Implementation Proposal")
    canvas.setAuthor("Run Lighter")
    canvas.setSubject("Marketing implementation proposal for Solari & Stock Lawyers")
    canvas.setFillColor(WARM)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(PALE_TEAL)
    canvas.rect(PAGE_W - 71 * mm, 0, 71 * mm, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(TEAL_DARK)
    canvas.rect(0, PAGE_H - 5 * mm, PAGE_W, 5 * mm, fill=1, stroke=0)
    canvas.restoreState()


def on_body(canvas, doc):
    canvas.saveState()
    logo_w = 43 * mm
    logo_h = logo_w * 255 / 1160
    canvas.drawImage(str(LOGO), 18 * mm, PAGE_H - 16.5 * mm, logo_w, logo_h, mask="auto")
    canvas.setFont("Helvetica-Bold", 6.5)
    canvas.setFillColor(MID_GREY)
    canvas.drawRightString(PAGE_W - 18 * mm, PAGE_H - 12.5 * mm, "2026-2027 | IMPLEMENTATION")
    canvas.setStrokeColor(DIVIDER)
    canvas.setLineWidth(0.6)
    canvas.line(18 * mm, PAGE_H - 19 * mm, PAGE_W - 18 * mm, PAGE_H - 19 * mm)
    canvas.line(18 * mm, 14 * mm, PAGE_W - 18 * mm, 14 * mm)
    canvas.setFont("Helvetica-Bold", 6.3)
    canvas.drawString(18 * mm, 9.5 * mm, "MARKETING IMPLEMENTATION PROPOSAL")
    canvas.drawRightString(PAGE_W - 18 * mm, 9.5 * mm, f"SOLARI & STOCK | {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT_PDF),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=24 * mm,
    bottomMargin=18 * mm,
    title="Solari & Stock Marketing Implementation Proposal",
    author="Run Lighter",
    subject="Marketing implementation proposal for Solari & Stock Lawyers",
)

cover_frame = Frame(16 * mm, 16 * mm, PAGE_W - 32 * mm, PAGE_H - 32 * mm, id="cover")
body_frame = Frame(18 * mm, 18 * mm, PAGE_W - 36 * mm, PAGE_H - 42 * mm, id="body")
doc.addPageTemplates(
    [
        PageTemplate(id="cover", frames=[cover_frame], onPage=on_cover),
        PageTemplate(id="body", frames=[body_frame], onPage=on_body),
    ]
)

story = []

# Cover
logo = Image(str(LOGO), width=72 * mm, height=72 * mm * 255 / 1160)
portrait = Image(str(DIRECTORS), width=66 * mm, height=66 * mm)
cover_copy = [
    logo,
    Spacer(1, 20 * mm),
    p("SOLARI &amp; STOCK | 2026-2027", EYEBROW),
    p("External marketing<br/>implementation proposal", TITLE),
    p(
        "An external service to implement the accepted Marketing and Business Development Strategy 2026-2027 and the advertised manager role.",
        COVER_DECK,
    ),
]
portrait_panel = Table(
    [[portrait], [p("ACCEPTED STRATEGY<br/><b>EXTERNAL IMPLEMENTATION</b>", CARD_LABEL)]],
    colWidths=[66 * mm],
)
portrait_panel.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), WHITE),
            ("BOX", (0, 0), (-1, -1), 0.8, DIVIDER),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ]
    )
)
cover_table = Table([[cover_copy, portrait_panel]], colWidths=[102 * mm, 68 * mm])
cover_table.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (0, -1), 8 * mm),
            ("RIGHTPADDING", (1, 0), (1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]
    )
)
story.extend(
    [
        Spacer(1, 10 * mm),
        cover_table,
        Spacer(1, 17 * mm),
        labelled_callout(
            "Responsibility",
            "<b>Solicitors write and approve the legal substance.</b> We plan the work, prepare briefs, edit and publish approved material, run campaigns and track enquiries and new matters.",
            WHITE,
        ),
        Spacer(1, 11 * mm),
        p("ACQUISITION   |   PUBLISHING   |   REFERRERS   |   MEASUREMENT", CARD_LABEL),
        NextPageTemplate("body"),
        PageBreak(),
    ]
)

# Services 1-4
story.extend(
    section_header(
        "01 | What we will manage",
        "A complete external marketing function",
        "The work is organised around acquisition, publishing, relationships and measurable commercial outcomes.",
    )
)
services_1 = [
    (
        "Google Ads and lead generation",
        "Build and manage Google Search Ads and paid Facebook and Instagram campaigns. Start with the Separation Options Consult, then improve search terms, audiences, advertisements, budgets, landing pages, booking paths and follow-up around qualified enquiries.",
    ),
    (
        "Lead tracking and live dashboard",
        "Connect website, local search, advertising, email, social and referrer activity to enquiries, bookings, new matters and known revenue. Keep the work list, approvals, deadlines and available results visible.",
    ),
    (
        "Social media",
        "Plan, write, design, schedule and publish three core content pieces each week. Adapt each piece across LinkedIn, Facebook and Instagram and pass client or legal enquiries to the nominated person at the firm.",
    ),
    (
        "Email marketing",
        "Produce the monthly client newsletter and quarterly professional and referrer newsletter. Manage targeted outreach, audience groups, build and test each send, track links and record replies and follow-up.",
    ),
]
story.extend([card_grid(services_1), PageBreak()])

# Services 5-7 and strategy
story.extend(section_header("01 | Continued", "Publishing, search and client material"))
services_2 = [
    (
        "Article publishing",
        "Prepare one practical article idea and solicitor writing brief each week. Solari & Stock solicitors write and approve the legal substance. We edit approved material for clarity and search visibility, create the image, add links and page information, publish it and adapt it for newsletters, social channels, frequently asked questions, Google Business Profile updates and client or referrer resources.",
    ),
    (
        "Website management and local search optimisation",
        "Own the website work list, page changes, landing pages and supplier coordination. Improve priority Family Law and Wills and Estates pages, the Google Business Profile, local service pages, page titles, internal links and enquiry paths.",
    ),
    (
        "Brochures and marketing material",
        "Create client guides, referrer resources, service brochures, invitations and campaign material from solicitor-approved content. Produce one substantial new or refreshed item each quarter.",
    ),
]
story.append(card_grid(services_2, backgrounds=(PALE_TEAL, WARM)))
story.append(Spacer(1, 4 * mm))
story.append(
    labelled_callout(
        "Clear responsibility",
        "<b>Solari &amp; Stock solicitors write and approve the legal substance.</b> We handle the ideas, briefs, editing, images, design, publishing, distribution, campaign management and measurement.",
    )
)
story.extend([Spacer(1, 7 * mm), PageBreak()])

# Plan
story.extend(
    section_header(
        "02 | Implementing the accepted plan",
        "The strategy remains the authority",
        "The service puts the accepted plan's acquisition, publishing, referral and measurement priorities into operation while preserving the responsibilities that remain with Solari & Stock.",
    )
)
plan_items = [
    ("Website, tracking and newsletters", "Manage website improvements, local search, source fields, campaign links, newsletters and the live dashboard."),
    ("Separation Options Consult", "Build the landing page, advertising, booking path, distribution, follow-up process and performance view."),
    ("Referrer and community pipeline", "Maintain priority contact groups, outreach schedules, meeting preparation, invitations, newsletters and follow-up."),
    ("Firm systems and paid activity", "Support agreed templates, reminders, survey delivery and reporting, while managing paid search and social activity."),
    ("Awards and directories", "Not included in the proposed service."),
    ("Content hubs and firm support", "Build the topic plan, prepare solicitor briefs, edit and publish approved content, improve internal links and repurpose material."),
]
story.append(card_grid(plan_items, backgrounds=(PAPER, PALE_TEAL)))
story.extend([Spacer(1, 3 * mm), PageBreak()])

# Delivery
story.extend(
    section_header(
        "03 | Scheduled output",
        "A clear operating rhythm",
        "The regular delivery programme continues beyond setup and is managed as one ongoing external marketing function.",
    )
)
weekly_items = [
    ("1 article brief", "One practical article idea and writing brief prepared for the appropriate solicitor."),
    ("1 article or page update", "One approved article edited, search-optimised, imaged and published, or a priority service-page or local search improvement if approved legal copy is not ready."),
    ("3 social content pieces", "Three core pieces created and adapted across LinkedIn, Facebook and Instagram."),
    ("Advertising and lead generation", "One optimisation cycle across active Google Search, Facebook and Instagram campaigns."),
    ("Website and local search", "At least one priority improvement plus checks of technical issues, the Google Business Profile, local pages and enquiry paths."),
    ("Email and referrer follow-up", "One cycle covering audience lists, scheduled campaigns, replies, next actions and meeting preparation."),
    ("Results and dashboard", "Add new enquiries, known sources, campaign results, referred work and available matter outcomes to the live dashboard."),
]
story.append(card_grid(weekly_items, backgrounds=(PAPER, PALE_TEAL)))
story.extend([Spacer(1, 3 * mm), PageBreak()])

# Scheduled supporting output and dashboard
story.extend(section_header("03 | Continued", "Monthly, quarterly and always available"))
schedule_items = [
    ("Every month", "One fully designed client newsletter, one targeted professional outreach campaign and one Microsoft Teams performance and planning meeting, recorded and transcribed. On-site attendance is by agreement."),
    ("Every quarter", "One professional and referrer newsletter, one substantial client guide, referrer resource or brochure, and a content and campaign priority review."),
    ("Always available", "Live performance dashboard, master marketing calendar, current website and campaign work list, approvals and deadlines."),
    ("Enquiries and acquisition", "Website visits, local search actions, advertising spend, clicks, enquiries, bookings, cost per enquiry, matters opened and known revenue where available."),
    ("Publishing and relationships", "Articles and page work, newsletter delivery and link clicks, social results, referrer contacts, meetings, next actions and referred enquiries."),
]
story.append(card_grid(schedule_items, backgrounds=(PALE_TEAL, WARM)))
story.append(Spacer(1, 4 * mm))
story.append(
    labelled_callout(
        "Scope",
        "This delivers the website, search, advertising, publishing, referrer, acquisition and measurement work in the accepted strategy and advertised role. Awards and professional directory submissions are not included.",
        PAPER,
    )
)
story.extend([Spacer(1, 3 * mm), PageBreak()])

# Commercial comparison
story.extend(
    section_header(
        "04 | Commercial comparison",
        "A lower known annual outlay",
        "The proposal is priced against the agreed outcomes and ongoing responsibility. It is not calculated by hours worked or a fixed allocation of time.",
    )
)
comparison_rows = [
    [
        p("CURRENT KNOWN ANNUAL BASELINE", CARD_LABEL),
        p("About $128,000", PRICE),
        p("Plus current Meta costs, which are unknown.", BODY_SMALL),
    ],
    [
        p("PROPOSED ANNUAL INVESTMENT", CARD_LABEL),
        p("About $80,000", PRICE),
        p("Professional fee plus recommended media.", BODY_SMALL),
    ],
]
comparison_table = Table(comparison_rows, colWidths=[58 * mm, 53 * mm, 52 * mm])
comparison_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), WARM),
            ("BACKGROUND", (0, 1), (-1, 1), PALE_TEAL),
            ("BOX", (0, 0), (-1, -1), 0.8, DIVIDER),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, DIVIDER),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, -1), 13),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 13),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]
    )
)
story.extend(
    [
        comparison_table,
        Spacer(1, 5 * mm),
        bar(142, colors.HexColor("#9B8E82")),
        p("Current known baseline: about $128,000 plus unknown Meta costs", BODY_TINY),
        Spacer(1, 2 * mm),
        bar(88.75, TEAL_DARK),
        p("Proposed annual investment: about $80,000 including recommended media", BODY_TINY),
        Spacer(1, 6 * mm),
    ]
)
saving = Table(
    [[p("INDICATIVE ANNUAL DIFFERENCE", CARD_LABEL), p("About $48,000 lower per year", SAVING_PRICE), p("Approximately 37.5% below the known current baseline, before any current Meta spend is counted.", BODY)]],
    colWidths=[43 * mm, 66 * mm, 54 * mm],
)
saving.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), PAPER),
            ("BOX", (0, 0), (-1, -1), 1.2, TEAL_DARK),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, -1), 14),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]
    )
)
story.append(saving)
story.append(Spacer(1, 5 * mm))
story.append(
    card_grid(
        [
            ("In-house marketing - about $110,000", "Indicative annual employment cost including salary, superannuation and associated employment costs."),
            ("Logline - $18,000 before GST", "$1,150 per month for local search services plus $350 per month for website hosting, security and development support."),
            ("Current Meta advertising - unknown", "Current media spend is excluded from the $128,000 known baseline because the amount is not available."),
        ],
        backgrounds=(WARM, PALE_TEAL),
    )
)
story.extend([Spacer(1, 2 * mm), PageBreak()])

# Investment and terms
story.extend(
    section_header(
        "05 | Outcome-based investment",
        "One professional fee for ownership and delivery",
        "The fee is priced for the agreed marketing outcomes. It is not based on hours worked.",
    )
)
professional_price = [
    p("PROFESSIONAL FEE", CARD_LABEL),
    p("$60,000", PRICE),
    p("PER YEAR", PRICE_SMALL),
    p("Equivalent to $5,000 per month", CARD_TITLE),
    p("The professional fee is for ownership and delivery of the agreed marketing outcomes, not hours worked.", BODY_SMALL),
]
media_price = [
    p("RECOMMENDED MEDIA STARTING POINT", CARD_LABEL),
    p("$20,000", PRICE),
    p("PER YEAR, PAID SEPARATELY", PRICE_SMALL),
    p("Annual starting point", CARD_TITLE),
    p("Recommended starting budget across Google Search, Facebook and Instagram, adjusted using actual enquiry and conversion data.", BODY_SMALL),
]
price_table = Table([[professional_price, media_price]], colWidths=[81.5 * mm, 81.5 * mm])
price_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (0, 0), WHITE),
            ("BACKGROUND", (1, 0), (1, 0), WARM),
            ("BOX", (0, 0), (-1, -1), 0.8, DIVIDER),
            ("LINEABOVE", (0, 0), (0, 0), 3, TEAL_DARK),
            ("LINEABOVE", (1, 0), (1, 0), 3, TEAL),
            ("LEFTPADDING", (0, 0), (-1, -1), 14),
            ("RIGHTPADDING", (0, 0), (-1, -1), 14),
            ("TOPPADDING", (0, 0), (-1, -1), 14),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]
    )
)
story.append(price_table)
story.append(Spacer(1, 5 * mm))
outcome_items = [
    ("Planning and delivery control", "Maintain the priorities, work list, owners, approvals and deadlines."),
    ("Briefs, editing and publishing", "Prepare briefs and publish approved legal and marketing material."),
    ("Campaign management", "Build, run and improve active Google, Facebook and Instagram campaigns."),
    ("Website and local search coordination", "Own the improvement list and coordinate technical suppliers."),
    ("Referrer support", "Organise contact groups, outreach, follow-up and relationship records."),
    ("Live reporting and dashboard", "Connect available activity to enquiries, matters and known revenue."),
]
story.append(card_grid(outcome_items, backgrounds=(PAPER, PALE_TEAL)))
story.extend([Spacer(1, 2 * mm), PageBreak()])

story.extend(section_header("05 | Terms", "Starting arrangement and additional outcomes"))
term_items = [
    ("Flexible first three months", "Monthly for the first three months, with no long-term lock-in. At month three, both parties review the work, results, priorities and fit."),
    ("12 months by mutual agreement", "If both parties are satisfied after the review, the preference is to agree a 12-month term so delivery time and resources can be reserved."),
    ("Separate costs and supplier continuity", "Advertising media, website hosting, platform subscriptions and approved external specialist or development costs are separate. We will review the current local search package for duplication and coordinate the retention or transfer of hosting and technical support."),
]
story.append(card_grid(term_items, backgrounds=(PALE_TEAL, WARM)))
story.append(Spacer(1, 6 * mm))
story.append(
    labelled_callout(
        "Additional outcomes",
        "<b>Marketing and automation can be added when useful.</b><br/><br/>If Solari &amp; Stock would like additional marketing or automation outcomes, we are happy to discuss them. Where appropriate, they can be incorporated into this proposal at this stage, or scoped and presented as a separate proposal.",
        WHITE,
    )
)
story.append(Spacer(1, 6 * mm))
story.append(
    p(
        "The annual comparison is indicative, not a guaranteed saving. Current Meta costs are unknown. The actual difference will also depend on supplier services retained after review and any separate hosting, platform subscription, specialist or development costs approved by Solari & Stock. GST treatment may vary between employment costs, professional fees and media costs.",
        BODY_TINY,
    )
)

doc.build(story)
shutil.copy2(OUTPUT_PDF, DEPLOY_PDF)
print(OUTPUT_PDF)
print(DEPLOY_PDF)
