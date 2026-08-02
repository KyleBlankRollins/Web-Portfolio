# Fable Design Audit

> Design audit of the portfolio site across desktop and mobile layouts, themes, accessibility, and interactive components.

## Summary

I explored every page at desktop (`1200px` and `1440px`) and mobile widths, both themes, light and dark modes, plus the tag filter, TOCs, and keyboard focus.

Overall verdict: the site has a genuinely distinctive identity. The Valkyrie serif with small-caps headings, the fixed gradient backdrop, and the theme system hang together well, and dark mode and both themes are executed carefully.

Nothing here needs a major revision. But I found one real layout bug, a couple of consistency slips, and several places where small changes would objectively improve readability.

## Bugs to Fix First

1. **Portfolio TOC overlap:** At both `1200px` and `1440px` viewports, the floating right-side TOC card sits on top of the intro paragraphs. Text is cut off mid-sentence behind it, and the panel covers most of the third writing-sample card. The blog post and career pages solve this correctly by giving the TOC its own column; the portfolio page floats the panel over the content without reserving space for it. This is the single most impactful fix because it hides actual work samples.

2. **Body text line height:** Article paragraphs render at `18px` type with a `23px` line height (`1.28x`). The typographic convention for body copy is `1.4x` to `1.6x`, and the theme tokens agree: `theme-base.css` defines `--line-height-normal: 1.6`. However, `shared-styles.ts` hardcodes `1.2777778rem` in several places. Switching paragraph styles to the token would make blog posts noticeably more comfortable with a one-line change.

3. **Duplicate Career anchor:** You worked at Purch twice, and both TOC entries link to `#purch`. The second entry, the 2010 internship, scrolls to the 2015 stint, leaving the bottom section unreachable from the TOC. Suffix the IDs with `#purch-2` and consider adding years to the two labels to disambiguate them.

4. **Tag pill styling:** Tag pills lose their styling in Canney Valley dark mode. In Basic Blue, both modes, and Canney Valley light, career tags render as pills with backgrounds. In Canney Valley dark, they collapse to bare floating text. This looks like a missing token in that theme variant rather than a design decision.

## Targeted Improvements

### Add a Footer

Every page just ends: no contact links, social links, or copyright. Right now, the only way to reach you is a LinkedIn link buried in the portfolio intro paragraph.

For a portfolio site, "How do I contact this person?" is the highest-value action. A footer with contact links, GitHub, and RSS, if the blog has a feed, is the conventional and expected place for it. This is the highest-leverage addition on the list.

Requirements: add a footer. Include LinkedIn and GitHub links. Those are the only things worth adding right now.

### Give the Home Page More to Do

The hero is a centered "Hello there!" card floating in approximately `200px` of empty gradient, and the three cards below it duplicate the header navigation exactly: Blog, Portfolio, and Career. A visitor gets no actual content without a second click.

Consider surfacing real material:

- Your latest post title and date
- One featured project
- Your current role

That directly serves the recruiter or reader who lands there and makes the page feel alive rather than like a signpost. Also, the intro paragraphs are center-aligned. Centered multi-line body text is measurably harder to read; left-align the paragraphs even if the card stays centered.

### Ration the Small Caps

Small caps are your signature, and they work beautifully for page titles and section headings. But they are currently used for `h1`, `h2`, `h3`, every TOC entry, and career tag pills.

When everything is small caps, the hierarchy flattens. The article TOC is the worst case: multi-line, all-small-caps entries at two nesting levels are hard to scan.

Suggestion: keep small caps for `h1` and `h2`, and use regular serif or italic text for `h3`, TOC entries, and metadata. Contrast between styles is what makes the small caps feel special.

### Unify the Three TOC Treatments

Blog posts put the TOC in a left card, Portfolio floats it on the right, and Career uses a left card with different active-state styling. It is the same concept with three behaviors.

Picking one pattern, preferably a right-side rail because it keeps content on the natural left reading axis, and reusing it everywhere would make the site feel more designed. It would also fix bug #1 as a side effect.

### Compress the Mobile Header

At `390px`, the header stacks the logo, navigation, and Themes button into approximately `190px` of chrome, nearly a quarter of the viewport before content starts.

Putting the logo on the left and navigation on the right in one row, then relocating the theme switcher to the footer or an icon-only button, would roughly halve that space.

### Improve Blog Card Economy

Each card spends a horizontal rule plus a "Read more ->" line on a link that duplicates the clickable title. Making the whole card the link target and dropping the rule and read-more line would fit approximately `50%` more posts above the fold without feeling cramped.

### Smaller Improvements

- The home page `<title>` is `KBR.com`, which is also a Fortune 500 defense contractor's domain. Inner pages are just `Blog` or `Portfolio`; consider titles such as `Blog - Kyle Rollins`.
- The three 3M writing-sample cards use the same stock-photo cover image, so they read as one document repeated. Distinct thumbnails or document-type icons would help.
- The tag filter is nicely built with URL parameters, counts, and active state, but it could use an explicit "clear filter" affordance.
- The Mode toggle in the Themes menu does not indicate which side is dark. Sun and moon icons would fix it.

## What I Would Leave Alone

The gradient-with-fixed-attachment backdrop (I initially flagged a "gradient seam" but it was a screenshot artifact — real scrolling is seamless), the card-on-gradient system, dark mode (well done, good contrast throughout), keyboard focus states (visible rings on nav), and the overall Valkyrie/IBM Plex Mono pairing. The theme system itself — two full themes × two modes, all coherent — is a portfolio piece in its own right; the "Themes" button in the header is earned.

One honest bigger-picture note: I don't think this site needs a redesign. Its bones — typography-first, content-on-cards, restrained color — are objectively sound. The gap between it and a "great" portfolio site is almost entirely the home page's emptiness and the missing footer/contact path, not the visual system.
