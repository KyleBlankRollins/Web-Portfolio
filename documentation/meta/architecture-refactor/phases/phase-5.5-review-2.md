What's fixed
All seven items from the last round landed, and cleanly:

The dead block pipeline is gone — buildTimelineDescriptionBlocks, TimelineDescriptionBlock, the •/\\n handling, the second template branch, and the two tests that were pinning it. buildTimelineStaticModel is down to id/heading construction.
Heading↔title validation added at career-content.ts:45-51 with a matching test.
The schema is now the single source of truth: z.infer exported, the nested ternary replaced by schemaByMode, and career excluded from the blog date/formattedDate post-processing.
Builder signatures take readonly CareerCompany[] with honest names; parseValue is off the career path.
The toHaveLength(15) is derived again via parseCareerContent(loadSiteSource().careerContent).
dateRange/duration are computed, and the two wrong values are gone — 3M Mar–Jul 2019 now reads "4 mos" instead of "8 mos".
The styles README path and the ###/TOC authoring note are both correct.
tsc is clean. npm test fails only the pre-existing blog.html snapshot I confirmed at 8e48b397 last round.

New findings
A. career.html.snap is stale, and the test never gets far enough to notice
The snapshot still holds the old hand-authored durations (1 yr 2 mos, 1 year 5 mos, 2 years); the build now emits 2 years 1 month, 1 year 4 mos, 1 year 11 mos. git status shows the file unmodified — it was never regenerated.

The reason it's green is build-output.test.ts:81-90: the loop awaits each toMatchFileSnapshot, so the blog.html mismatch (second item) throws and career.html is never compared. Every career assertion in that snapshot — including the id/heading logic from finding G — is currently unchecked.

This is exactly the gate the phase doc relies on ("rebuild and let the output checks identify any expected snapshot changes"), and it silently didn't run. Fix blog.html, or collect failures across the loop instead of aborting, then regenerate career.html.snap.

B. Duration is non-deterministic, so the snapshot will rot every month
career-content.ts:108 uses new Date() for endDate = "Present". The MongoDB lead role renders 2 years 1 month today and 2 years 2 mos in October. With career.html under snapshot, the suite breaks itself on a calendar boundary once A is fixed — a failure that looks like a regression and isn't.

Take the clock as a parameter (parseCareerContent(files, now = new Date())) so tests can pin it, or normalize the duration div for present roles in normalizeDom.

C. Three unit conventions in one function
career-content.ts:117-119:

if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "mos"}`);
return parts.join(" ") || "1 mo";
Years spell out, months abbreviate on plural only, and the fallback uses a third form. The built page already shows 2 years 1 month next to 1 year 4 mos. Pick one — the old data used yr/yrs/mos throughout.

D. Dates now drive arithmetic but are still validated as z.string().min(1)
Confirmed by probe: startDate = "2024" throws RangeError: Invalid time value out of formatMonth, with no file path and no field name — unlike every other frontmatter failure, which reports Invalid frontmatter in "<path>": .... A one-character typo in a résumé file gets a stack trace instead of a message.

.regex(/^\d{4}-(0[1-9]|1[0-2])$/) on startDate, and the same or Present on endDate, closes it. Also confirmed: reversed dates (2025-01 → 2024-01) silently render "1 mo" rather than erroring.

E. A career file with no frontmatter dies with a TypeError
frontmatter-parser.ts:162 short-circuits to { metadata: {} as TMetadata } before the schema runs, so metadata.positions.length at career-content.ts:39 throws TypeError: Cannot read properties of undefined (reading 'length') (verified). The as TMetadata cast is precisely what hides this from the compiler — the early return claims to produce a CareerFrontmatter and doesn't.

F. parse<TMetadata> is an unchecked cast wearing a generic
Nothing connects TMetadata to this.mode. new FrontmatterParser("published").parse<CareerFrontmatter>(src) typechecks and lies at runtime. Making the class generic on its mode with a MetadataFor<M> mapping would let schemaByMode and the return type agree by construction and delete both as casts — including the one in E.

G. buildTimelineStaticModel lost all unit coverage
Removing the dead-block assertions was right, but the deleted test was also the only coverage for slugify/id, the duplicate-company occurrence suffix, the companyYearSpan heading, and HTML escaping (it used Example <Company> and ?x=1&y=2 deliberately). That logic now has no unit test and no working snapshot behind it. Worth re-adding the id/heading half.

H. Durations dropped by one month across the board — worth stating explicitly
The new computation is exclusive of the end month. 3M Mar 2020–Jun 2021 went from 1 yr 4 mos to 1 year 3 mos; Apr 2017–Mar 2019 from 2 years to 1 year 11 mos. The source data counted inclusively (LinkedIn's convention). Both are defensible, but this changed every résumé-facing number on the page and isn't noted anywhere.

Minor
build-output.test.ts:84-85 has an empty if (relativePath === "data/theme-manifest.json") { } — pre-existing, but it's the only reason normalized is let.
CareerPositionMetadata is exported through modules/index.ts and used nowhere.
Phase doc line 57 still describes the builder "preserving the authored order of paragraphs and consecutive bullet groups" as though it were bespoke logic; that's just Marked now.
A and B are the ones I'd handle before closing the phase — together they mean the career page's rendered output currently has no working test, and the fix for A will introduce a monthly false failure unless B goes with it.
