Findings

1. The legacy description-block pipeline is now unreachable — and new tests were added to pin it
   In career-content.ts:65, renderedDescription is set whenever description is non-empty. So in static-content.ts:115:

const description = position.renderedDescription ? "" : position.description;
description is always "" and blocks is always []. parseCareerContent is the only producer of CareerCompany, so there is no input that reaches the other branch. The build output confirms it: 13 description divs for 13 non-empty sections, all from the renderedDescription template branch.

That makes all of this dead: TimelineDescriptionBlock (static-content.ts:38), buildTimelineDescriptionBlocks (:133) with its • and \\n handling, the blocks/description fields on StaticTimelinePosition, description on CareerPosition, and the second <div class="description"> in timeline-static-content.html:51-60.

The part I'd flag hardest: the +50 lines in static-content.test.ts are two new tests ("preserves paragraph breaks between prose blocks", "preserves label paragraphs before their bullet groups") that feed •-prefixed, \\n-escaped strings no producer can generate. They pass, and they read as coverage for the authoring contract in the phase doc — but the real paragraph/bullet behavior now comes from Marked, and is untested here. This is false confidence sitting on top of dead code. Delete both the code and those tests; if the contract needs coverage, assert on renderedDescription markup instead.

2. Position sections match metadata by index only
   career-content.ts:50 checks the count of ## sections against positions.length and nothing else. The heading text is discarded. Reorder two [[positions]] blocks without reordering the sections and every description silently attaches to the wrong role — no error, no failing test. The handoff section tells a human to "keep frontmatter position metadata aligned with the ## Position sections"; that's a rule the parser can enforce in three lines by comparing the heading text to positions[index].title.

3. Schema and type are two definitions joined by a cast
   careerFrontmatterSchema lives in modules/frontmatter-parser.ts; CareerFrontmatter is redeclared in career-content.ts:27-35 and applied via parsed.metadata as CareerFrontmatter at :47. Nothing verifies they agree — the cast is the seam where drift becomes a runtime surprise. Export z.infer<typeof careerFrontmatterSchema> from the parser and delete the hand-written interface.

Related, in the parser itself: FrontmatterMode now mixes two axes — published/draft are publication states of a blog post, career is a different content type. Career metadata is forced through FrontmatterData (a blog shape: title?, date?, tags?) and then runs the blog's date/formattedDate post-processing, inert only because career files happen to have no top-level date. The nested ternary at frontmatter-parser.ts:174-179 is the visible symptom; a Record<FrontmatterMode, ZodType> map removes it, but the deeper fix is a separate content-type parameter.

4. Stale signatures on the model builders
   buildHomeStaticModel and buildTimelineStaticModel still accept string | readonly CareerCompany[] and route through parseValue. With experience-data.json gone, nothing passes a string, and the parameter is still named experienceJson while holding CareerCompany[]. Drop the union, drop parseValue for these two, rename to companies. Also static-content.ts:35 redeclares readonly renderedDescription?: string, which Omit<CareerPosition, "description" | "skills"> already carries.

5. A test count went from derived back to hardcoded
   build-output.test.ts:143 is now toHaveLength(15). Your own phase-5-review-2.md lists "hard-coded test counts → now derived" as a fix from that round; this undoes it. It's still derivable — count ## sections across source/site/content/career/, or run parseCareerContent(loadSiteSource().careerContent). (The added expect(careerHtml).not.toContain("\\n") is a good regression guard, though — keep that.)

6. Wrong path in the styles README
   styles/README.md:21 puts career/ inside the public/ tree diagram. The content lives at source/site/content/career/. The other two READMEs got this right; this one moved the label but not the tree.

7. Derived data re-encoded by hand, and already wrong
   dateRange and duration duplicate startDate/endDate in all seven files, and two are already incorrect: mongodb.md:11 says "1 yr 2 mos" for Aug 2024–Present (~2 yr 1 mo as of today), and 3m.md:31 says "8 mos" for Mar 2019–Jul 2019 (5 months). This came over from the JSON unchanged, but the migration was the natural moment to compute both from the dates. Any Present position's duration is guaranteed to rot; at minimum derive that case at build time.

8. Minor: TOC pollution risk
   MarkdownRenderer assigns ids to headings, and the career page TOC scans .timeline for levels 2–3. A ### written inside a description would render as an <h3> with an id and land in the TOC beside job titles. Nothing triggers it today; worth a line in the authoring contract.

What's solid
loadSiteSource losing its publicRoot parameter is a clean win — authoring input is out of the output directory and the path traversal flagged in the phase-4 review is gone. Reusing the frontmatter + Markdown infrastructure instead of forking a second pipeline is the right call, the Zod schema is appropriately strict, empty descriptions are handled deliberately rather than by accident, and deleting the home-highlights runtime component while keeping the partial was the correct half to remove.

The one change I'd make before calling the phase done is #1 — the dead pipeline plus the tests written to cover it is the finding that will cost the most later, because the next person to touch timeline rendering will reasonably believe those tests mean something.
