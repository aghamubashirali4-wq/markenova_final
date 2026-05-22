# Markenova Digital — v5 Production Release

**Major upgrade: industry-specific landing pages + lead magnets + Tawk.to live chat + conversion optimization.**

---

## What's New in v5

### 1. New Positioning (Main Page)
- Replaced "Why Markenova" section with **"Our Approach"** — the founder story you provided
- New hero headline: **"Your Long-Term Digital Growth Partner"**
- Highlights: 4+ years experience, 100+ businesses guided
- Added integrated services positioning (Website + SEO + Ads + Social + Brand)

### 2. Three Industry-Specific Landing Pages
- **`home-services.html`** — HVAC, plumbing, roofing, electrical, remodeling
- **`medical-aesthetic.html`** — Dentists, med spas, chiropractors, dermatology
- **`tech-startups.html`** — AI startups, SaaS, B2B platforms

Each industry page includes:
- Industry-specific hero & messaging
- "Who this is for" cards
- Research-driven insights (6 statistics)
- Free guide download CTA
- Service offerings tailored to that industry
- Industry-specific contact form

### 3. Three Lead Magnet Guides (HTML)
- **`guides/home-services-google-ads-checklist.html`** — 14-point audit checklist
- **`guides/medical-patient-acquisition-guide.html`** — 10-chapter playbook
- **`guides/saas-growth-playbook.html`** — 9-chapter growth playbook

Each guide:
- Reads like a professional document
- Includes "Save as PDF" button (uses browser's print-to-PDF)
- Has CTA section at bottom linking to free audit
- Optimized for both reading on-screen and printing

### 4. Live Chat Integration
- **Tawk.to** integrated on all pages
- Property ID: `6a0fc97c2b50d01c367b8fe0/1jp6qm3pf`
- Manage chats at https://tawk.to dashboard

### 5. Conversion Optimization
- **Exit-intent popup** (desktop: mouse leaves top of page; mobile: after 30s scrolling)
- Shows once per session (uses sessionStorage)
- Offers three industry guides + book a call

### 6. Simplified Contact Forms
- Reduced from 7 fields to 5 (Name, Email, Phone, Service, Message)
- Industry pages have industry-specific service dropdowns
- Page source tracking in form submissions (tells you which page converted)

### 7. New Sections on Main Page
- **Industries We Serve** — links to 3 industry pages
- **Free Resources** — lead magnet cards
- **Research-Driven Expertise** — 4 statistical insights
- Updated **FAQ** with "Why trust a new agency?" question

---

## File Structure

```
markenova_v5/
├── index.html                                          # Main homepage
├── home-services.html                                  # Home services landing
├── medical-aesthetic.html                              # Medical/aesthetic landing
├── tech-startups.html                                  # Tech/SaaS landing
├── style.css                                           # Main stylesheet
├── script.js                                           # Main JavaScript
├── privacy-policy.html                                 # (Carry over from v4)
├── terms.html                                          # (Carry over from v4)
├── site.webmanifest                                    # (Carry over from v4)
├── README.md                                           # This file
├── guides/
│   ├── guide-style.css                                 # Guide-specific styles
│   ├── home-services-google-ads-checklist.html        # Home services guide
│   ├── medical-patient-acquisition-guide.html         # Medical guide
│   └── saas-growth-playbook.html                      # SaaS guide
└── assets/
    ├── icons/                                          # (Copy from v4)
    └── images/                                         # (Copy from v4)
```

---

## Deployment Instructions

### Step 1: Copy assets from v4
Your existing `assets/` folder (logos, icons, favicons) is unchanged. **Copy it from your current v4 deployment into this v5 folder**:

```
v4/assets/  →  v5/assets/
```

You also need:
- `v4/privacy-policy.html` → `v5/privacy-policy.html`
- `v4/terms.html` → `v5/terms.html`
- `v4/site.webmanifest` → `v5/site.webmanifest`

### Step 2: Test locally (optional)
```bash
cd markenova_v5
python3 -m http.server 8080
# Visit http://localhost:8080
```

### Step 3: Deploy to Cloudflare Pages

**Option A: Drag & Drop (Easiest)**
1. Go to Cloudflare Pages dashboard
2. Open your `markenovadigital.com` project
3. Click "Create deployment"
4. Drag the entire `markenova_v5` folder
5. Click "Deploy"
6. After preview deployment looks good, click "Promote to Production"

**Option B: Git-based**
1. Push `markenova_v5` contents to your connected GitHub repo
2. Cloudflare will auto-deploy on push

### Step 4: Verify
- ✅ Main site loads at markenovadigital.com
- ✅ All 3 industry pages load (/home-services.html, /medical-aesthetic.html, /tech-startups.html)
- ✅ All 3 guides load (/guides/...)
- ✅ Tawk.to chat widget appears bottom-right
- ✅ Contact form submits successfully (test with your own email)
- ✅ Exit popup appears when leaving page

---

## Important Configuration Notes

### Formspree (Contact Forms)
Forms currently submit to: `https://formspree.io/f/meedqgvl` (same as v4)
Submissions go to: `hello@markenovadigital.com`

### Calendly Booking
Calendly widget configured for: `https://calendly.com/markenovadigital/30min`
No changes needed if your Calendly URL is unchanged.

### Google Tag Manager
GTM ID active: `GTM-PF6TW8M6` (same as v4)
All page views automatically tracked.

### Tawk.to Live Chat
Configured with your property:
- Widget ID: `6a0fc97c2b50d01c367b8fe0`
- Embed ID: `1jp6qm3pf`
- Manage at: https://dashboard.tawk.to

---

## Recommended Next Steps (For Maximum Conversion)

### Week 1 (After Deploy):
1. **Test all forms** by submitting from each page
2. **Setup Tawk.to** with proper greeting message:
   > "Looking to generate more leads? Happy to answer any questions 👋"
3. **Set Tawk.to business hours** so customers see online/offline status correctly

### Week 2-4:
4. **Create actual branded PDFs** from the lead magnets:
   - Use Canva (free): import HTML → make it branded → export as PDF
   - Replace "Save as PDF" buttons with direct PDF downloads
5. **Run Google Ads** to the industry-specific pages (much higher relevance score than generic homepage)
6. **Track which page converts best** in GA4 (path attribution shows in form submissions)

### Month 2:
7. **Add 2-3 real testimonials** as you onboard founding clients
8. **Create case studies** from your first wins
9. **Update industry pages** with real client logos/quotes (optional but powerful)

---

## What's Honest in This Version

We did NOT add:
- ❌ Fake testimonials with names like "James M."
- ❌ Made-up case studies with specific numbers ("47 leads in 30 days")
- ❌ Inflated agency claims ("We've helped 500+ businesses")

We DID add:
- ✅ Your real 4+ year sales/BD experience (positioning advantage)
- ✅ Real industry research statistics (publicly verifiable)
- ✅ Honest "founding client" pricing positioning
- ✅ Transparent FAQ about being a new agency

This positions you as: **Honest, expert, low-risk, high-trust** — which is exactly what your ICP wants.

---

## Need Changes?

Common edits you might want:
- **Update founder story** → Edit `index.html` lines ~315-340 in the `<section class="approach-story">` block
- **Change phone number** → Find/replace `+1 905 667 6884` across all files
- **Change Tawk.to property** → Update the `embed.tawk.to` URL in `<head>` of all HTML files
- **Add new industry page** → Duplicate `home-services.html`, change content, add link in `index.html` industries section
- **Add new guide** → Duplicate one of the guides in `/guides/`, change content

---

## Questions?

Email hello@markenovadigital.com or test the live chat (Tawk.to) on the site itself.

— Built for Markenova Digital, January 2026
