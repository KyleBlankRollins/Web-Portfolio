---
title: "Communicability Under Transduction: Design and Pre-Registration"
description: "Pre-registered design measuring whether explicitly marked pragmatic relations survive a documentation delivery pipeline better than the same relations left implicit in prose."
keywords: "experiment design, pre-registration, technical writing, documentation, semiotics, communicability, transduction, retrieval, AI agents"
date: ""
tags: [technical writing, documentation, AI, research, experiment]
status: "design"
design_version: "0.7"
registered: "2026-08-02"
registration_commit: "75667a9a494b076e79e9f5aba5bd0dc932d890a1"
instrument_locked: ""
instrument_lock_commit: ""
repository: "docs-transduction-study — separate repository, not this one"
---

## Status

**Design — registered 2026-08-02 (L1, commit `75667a9a`); instrument not yet locked, not yet run.** Version 0.7 is the registered 0.6 plus post-registration amendments A1–A2 — see the [Amendment log](#amendment-log). Version 0.6 supersedes 0.5; 0.2 is preserved alongside this file. See [What changed from 0.5](#what-changed-from-05-and-why), [What changed from 0.4](#what-changed-from-04-and-why), [What changed from 0.3](#what-changed-from-03-and-why), and [What changed from 0.2](#what-changed-from-02-and-why).

Registration happens in **two locks**, because two different things need protecting and they are ready at different times:

| Lock | Frontmatter fields | What it freezes | When |
| ---- | ------------------ | --------------- | ---- |
| **L1 — design freeze** | `registered`, `registration_commit` | Hypotheses, relation taxonomy, survival rubric, de-marking rules, pipeline stage definitions, analysis plan, disconfirming outcomes | Before any specimen is selected |
| **L2 — instrument lock** | `instrument_locked`, `instrument_lock_commit` | Specimen list, relation inventory, probes with foils, the gate exclusion log, de-marking templates, the coding-order seed | After variants exist and every probe has passed the both-arms gate; before any downstream artifact of a study specimen is generated |

L1 protects the hypotheses from being fitted to the data. L2 protects the instrument from being fitted to the artifacts. After L1, changes to anything in the L1 row are amendments; after L2, the same for the L2 row. Amendments go in the [Amendment log](#amendment-log), never silent edits.

No A1–A5 artifact of a study specimen is generated before the L2 commit exists.

**One named exception: the pilot page.** A single page that is **not** in the study sample may run the full A1–A4 pipeline before L2, with disposable probes, as an engineering shakedown — build determinism, accessibility-tree shape, chunker sanity, coding-harness usability. Discovering those after L2 costs an amendment each; a non-sample page answers every engineering question without letting the author see any study artifact before lock. The pilot's artifacts and probes are destroyed afterward, and the disposal is logged in the run log with its date.

**The experiment does not live in this repository.** It gets its own repo with a Python toolchain; this document is the design that repo is built from, and a copy is frozen there at registration. This file stays here because it is series planning material.

## What changed from 0.5 and why

One change, driven by spike evidence from the experiment repository. Nothing touches a hypothesis, the taxonomy, the rubric, or a de-marking rule.

- **A1's "deterministic" label is now claimed only with the ad-pinning overlay applied.** The spike's build-comparison check found 5,112 of 6,313 pages differing between clean builds of the pinned corpus: a promotional component selects one of three ads with `Math.random()` in component frontmatter — per page, per build. Under the two-build arm design that injects between-arm differences unrelated to the manipulation, visible in whole-page A2 trees even where A3's article-scoped extraction excludes them. A committed overlay pins the choice to one fixed ad and is applied identically to both arms before either build (experiment repository, ADR-0005). The two-build comparison, and the spike checks deferred behind it, are re-scored at the pilot with the overlay in place.

## What changed from 0.4 and why

Version 0.4 froze the right things; writing the implementation plan against it surfaced four places where the procedure could not be executed as written and two stage definitions left silently underspecified. Nothing here changes a hypothesis, the taxonomy, the rubric, or a de-marking rule. It is all pre-L1 operational repair.

- **A pilot page is now a named exception to the no-artifacts-before-L2 rule.** The implementation plan needs a one-page end-to-end shakedown before L2, which 0.4 forbade; a single non-sample page with disposable probes answers every engineering question without letting the author see any study artifact before lock, and its disposal is logged.
- **Anchor-resolution timing was impossible as written.** 0.4 required anchors to resolve "at every stage before L2" while also forbidding artifact generation before L2. Anchors now resolve in both arms at A0 before L2 and at A1–A4 when those artifacts are generated, with a post-L2 failure repaired as a mechanical amendment labeled results-not-seen. Resolution also gains a committed normalization spec, because build-time typographic transforms mean a verbatim A0 substring will not literally match a rendered artifact.
- **Procedure steps 4–5 were in an impossible order.** Per-arm anchors were assigned before the implicit variants they anchor into existed. The inventory now takes explicit-arm anchors at step 4; implicit-arm anchors follow variant generation.
- **A2's snapshot policy is a registered choice: default page state, no interaction.** It determines whether content hidden by default — inactive tab panels above all — is present in A2 at all, so it cannot be left to run time.
- **A3 is defined as a named, versioned extractor in plain-text mode**, scoped to the article element, rather than an unspecified "tags stripped" — the plain-text mode is what keeps "no structure preserved" true rather than aspirational.
- **Foils are capped at two**, matching the instrument's data contract, so option-set size stays comparable across probes.
- **The redundancy inventory's position in the procedure is a default, not a dependency.** It reads no pipeline artifacts and touches nothing either lock freezes, so it may run any time after the relation inventory exists.

## What changed from 0.3 and why

Version 0.3 was internally consistent as an argument but under-specified as a procedure: three things it left to be decided during execution were decisions that must exist before execution, and one had contradicted itself. Nothing here changes a hypothesis, the taxonomy, or the rubric. It is all operational.

- **Registration split into two locks.** The 0.3 Procedure froze the design at step 1; the 0.3 execution checklist froze it *after* probes were locked. Both could not hold, and the ambiguity was about which commit constitutes the registration — the one thing pre-registration exists to make unambiguous. The [two-lock model](#status) resolves it without weakening either commitment, because the design and the instrument genuinely become final at different moments.
- **The A4 unit of scoring is now specified.** A page yields many chunks, and 0.3 never said which one a probe is answered against — leaving the question "did this relation survive chunking?" resting on a choice that would have been made after seeing the artifacts. It is now [fixed in advance](#what-is-scored-at-a4), with straddled host passages recorded rather than worked around.
- **Relation instances now carry anchors.** The unit of analysis was scored "per stage, per arm" with no rule for locating it in an artifact. Anchors and host passages make that mechanical and checkable at lock time.
- **De-marking rules D2, D3, and D4 are bound to a fixed template set.** These three rules *insert* words rather than only removing structure, so left unconstrained they were an invitation to hand-tune the implicit arm sentence by sentence — which is precisely the strawman threat the design rates High. Templates are committed and frozen at L2.
- **D4 now de-marks by lowercasing the keyword** ("MUST" → "must") rather than substituting a paraphrase ("needs to"). The 0.3 phrasing was an illustration that does not survive mechanical application: "You MUST restart" becomes "You needs to restart", and broken grammar in the implicit arm only would let the arms be told apart on fluency rather than on marking. Lowercasing is what RFC 8174 itself makes the marking, so removing capitalization *is* the de-marking. The cost is that D4 becomes the smallest manipulation in the set and is [reported separately from D3](#analysis-plan). Reasoning recorded in the experiment repository as ADR-0001.

## What changed from 0.2 and why

Version 0.2 had two principled commitments that turned out to be mutually exclusive, and several measures that could not be scored as described. The 0.3 design keeps every idea that survived scrutiny and cuts the rest. Recorded here so the cuts do not get re-litigated:

- **The channel-availability factor and the agent task measure (M3) are cut, deferred to [Future work](#future-work).** The 0.2 design required the implicit-marking variants to reach an agent through the real Astro Docs MCP server — a third-party service that indexes Astro's docs as authored and cannot serve study-generated variants. The primary hypothesis was unexecutable as specified. The redundancy-collapse idea is good; it needs its own experiment with a delivery path the study controls.
- **Server-mediated retrieval (the old A4b and H6) is demoted from hypothesis to [observational annex](#annex-the-server-mediated-snapshot).** It can only ever carry the explicit arm, and it conflates retrieval failure (the relevant passage was never returned) with transduction loss (it was returned, degraded). The annex keeps the snapshot and adds a retrieval gate; it makes no comparative claims.
- **De-marking rules D5 (names → pronouns) and D6 (relocating prerequisites) are cut.** D5 manufactures ambiguity that violates the propositional-equivalence constraint by construction, for exactly the instances that matter most. D6 changes which chunk information lands in — an information manipulation disguised as a marking manipulation. What remains is a clean test of **component syntax versus prose**, which is also the Goodman argument stated operationally.
- **Probes are now closed-form, with pre-written foils.** Free-text probe answers had no specified scorer: an LLM judge would use pragmatic competence to measure pragmatic failure, and an author judge would reimport the bias the measure existed to remove. Forced-choice probes are scored by exact match, and the foil option operationalizes the corrupted-versus-absent distinction directly.
- **The blinding claims are rewritten to what is actually achievable.** The manipulation is visible in the artifact — an admonition block versus an inline sentence *is* the treatment — so "blind to arm" was never available. The design now claims only the controls that work.
- **Relation types split into manipulated and observed.** Force, sequence, alternatives, and prerequisites can be re-marked mechanically. Reference and deixis cannot be de-marked without changing content, so they are tracked as naturally occurring instances instead. The 0.2 design blurred these and inherited a confound.

## The question

Four literatures argue that meaning is remade whenever a representation is transformed. None of them measured it on documentation, and the trade conversation asserts the opposite without evidence.

**The recommendation under test:** that explicitly marking pragmatic relations — with component syntax, structural markup, and controlled vocabulary — makes those relations survive the delivery pipeline better than leaving them implicit in well-written prose. The series asserts this. Nobody has demonstrated it.

The design is one paired comparison, run down one pipeline:

> Take real documentation pages. Hold their propositional content fixed. Vary only whether relations are marked by structure or carried by prose. Push both variants through the same delivery pipeline. At each stage, test whether a fixed set of questions can still be answered correctly. The finding is the **divergence between the two trajectories** — not the performance of either arm.

By construction both arms start equal: every probe is answerable from either variant at the source. Whatever gap opens downstream was caused by the pipeline acting on the marking difference, because nothing else differs.

## Theoretical provenance

This is **not** an application of the Semiotic Inspection Method or the Communicability Evaluation Method, and must not be described as one. SIM compares sign classes within one system, qualitatively; CEM requires an observed interpreter and a fixed utterance vocabulary. What the design takes from semiotic engineering is narrower, and the published post should say so in one sentence:

- **Communicability** as the measured construct (de Souza): can the intended interpreter recover the designer's intent — distinct from whether the text is accurate or readable.
- **The analyst-side stance** (SIM): inspection without users yields a claim about the artifact, which does not expire when models change. This is why phase 1 is model-free.
- **The loud/silent breakdown distinction** (CEM): "What's this?" — no interpretation generated — versus "Why doesn't it?" — a wrong interpretation generated confidently. This is why the rubric scores corruption below absence.

## Definitions

### Relation taxonomy

Categories are external — the four phenomena from the PUB benchmark for the observed set, and the relations Starlight components mark for the manipulated set — so they cannot have been shaped to fit the hypotheses.

**Manipulated relations** — markable by component syntax, and mechanically de-markable without touching content:

| ID | Relation | Explicit marking | Implicit carrier |
| -- | -------- | ---------------- | ---------------- |
| R1 | Sequence — steps that must occur in order | Step components | Prose paragraph, order in sentence sequence |
| R2 | Membership — mutually exclusive alternatives | Tabbed panels | Prose enumeration |
| R3 | Force — how mandatory an action is, scope of warnings | Admonitions, normative keywords | Modal verbs in running prose |
| R4 | Precondition — what must hold before an action | Prerequisite blocks, tables | Prose statement in place |

**Observed relations** — naturally occurring, identical in both arms, tracked but never manipulated:

| ID | Phenomenon | In documentation |
| -- | ---------- | ---------------- |
| O1 | Reference | "the key," "your existing config" |
| O2 | Deixis | "this step," "as described above," "see below" |

A **relation instance** is one occurrence of one of these in one specimen. It is the unit of analysis.

Because instances are scored per stage and per arm, each one must be locatable in an artifact by rule rather than by recollection. Every instance therefore carries, **per arm**:

- An **anchor** — a short verbatim substring of that arm's A0 source, guaranteed present wherever the relation's evidence is.
- A **host passage** — the minimal contiguous span from which the probe is answerable.

Anchors are necessarily per-arm, since the arms differ in wording; that difference is the treatment. Anchors are never shown to the coder and never appear in a probe, so the no-distinctive-strings rule is untouched. Anchor resolution runs as a script against a small committed **normalization spec** — whitespace collapsing, typographic quote and dash folding, a defined case rule — frozen at L2, because build-time typographic transforms mean a verbatim A0 substring will not literally match a rendered artifact. Resolution must succeed for every instance, in both arms, at A0 before L2. Resolution in A1–A4 is verified when those artifacts are generated; an anchor that fails to resolve there is a defect in the anchor, not a finding — a page always contains itself — and is repaired as a mechanical amendment labeled results-not-seen.

{# Read the PUB paper before this taxonomy is cited in print. Confirm the phenomenon names and do not print an example count without checking — the research doc flags an unresolved discrepancy. #}

### Probes

Subjective coding of "was meaning preserved?" is not measurable. Each relation instance gets one **closed-form probe**, written and locked before any downstream artifact of a study specimen exists:

- **The question.** Phrased without vocabulary unique to either arm.
- **The correct answer**, verified against A0.
- **One or two foils** — specific, plausible *wrong* relations the degradation could produce. The cap exists so option-set size stays comparable across probes.
- **"The text does not say"** — always available.

> **Probe:** Are the three package-manager commands alternatives to each other, or steps to run in sequence?
> **Correct:** Alternatives — run exactly one.
> **Foil:** Sequence — run all three in order.

Answer options are presented in randomized order. Scoring is exact match: no judge model, no post-hoc interpretation. Choosing the foil *is* the corrupted outcome, observed directly rather than inferred from a transcript.

Authoring rules, fixed in advance: one probe per instance; answerable unambiguously from **both** A0 variants (this is the propositional-equivalence gate — instances that fail it are excluded and logged before locking); no probe quotes a distinctive string from either variant; a designated subset are [version-change probes](#contamination).

### Survival rubric

Ordinal, per probe per artifact:

| Score | Label | Criterion |
| ----- | ----- | --------- |
| 3 | Preserved | Correct answer, supported explicitly |
| 2 | Degraded | Correct answer, but only by inference or outside knowledge |
| 1 | Absent | "The text does not say" — the loss is visible |
| 0 | Corrupted | A foil — the artifact supports a wrong relation, and nothing signals the loss |

**Corrupted scores below Absent, on purpose.** A reader who generates no interpretation fails loudly and recoverably; a reader who generates the wrong one fails silently and expensively. A rubric that pools them discards the finding the series most wants.

The worked case: package-manager tabs encode membership. Strip the tab structure in plain-text extraction and three consecutive command blocks read as sequence. That is not absence — the relation was *replaced*, and nothing marks the substitution.

{# Verify this behavior on actual specimens before using it as part 3's opener. It is the best example available if it holds. #}

## Corpus

**The Astro framework's documentation** (`github.com/withastro/docs`, `src/content/docs/en/`, MDX with Starlight components). MIT licensed, which permits publishing specimens and derived variants with attribution. **Pinned to a commit SHA at registration.**

Why this corpus:

- **Not written by the person testing it.** Removes the single-voice limitation no self-authored corpus escapes.
- **The explicit arm comes pre-built.** Starlight components are relation markers; de-marking is mechanical component removal, not editorial rewriting.
- **Real version history with breaking changes**, which makes contamination measurable.
- **Heavy cross-referentiality.** Good structure creates things to point at, so the observed set (O1, O2) is well populated.

Selection rules, fixed in advance: specimens span Diátaxis types so the sample is not all procedures; each specimen's last-major-change version is recorded; targets are **8–12 specimens** and **≥20 instances per manipulated relation type** (R1–R4) and **≥20 per observed type** (O1–O2). If the corpus cannot supply a cell, record the shortfall before running rather than discovering it after.

## The marking manipulation

Explicit variants are Astro's pages as authored. Implicit variants apply these rules **mechanically, without hand-tuning**:

| Rule | Transformation |
| ---- | -------------- |
| D1 | Step components → prose paragraph, order preserved in sentence sequence |
| D2 | Tabbed alternatives → prose enumeration, with the alternative relation stated once in prose |
| D3 | Admonitions → inline sentences in surrounding prose, in place |
| D4 | Normative keywords → ordinary modals: the keyword is lowercased ("MUST" → "must"), in place |
| D7 | Tables → prose enumeration, in place |
| D8 | Prerequisite-heading blocks → heading removed; content unchanged and in place, introduced by a template sentence stating the precondition relation. *Added by amendment A1.* |

*(D5 and D6 from the 0.2 design are deliberately absent — see [What changed](#what-changed-from-02-and-why). Rule IDs are kept stable rather than renumbered.)*

**D2, D3, and D8 insert words; they do not only remove structure.** D2 must state the alternative relation in prose, D3 must land an admonition's content in a surrounding sentence, and D8 must assert the precondition relation in a sentence once its heading is gone. (D4 inserts nothing — it lowercases the keyword in place, per the 0.4 decision and ADR-0001.) Each insertion is a writing act, and a writing act performed freely, specimen by specimen, is exactly how an implicit arm becomes a strawman without anyone intending it.

So the inserted language comes from a **small, fixed, committed template set** — a frozen phrase inventory for D2, D3, and D8 (`"Choose one of the following options:"`, `"Before you begin, you need the following:"`). Templates are applied uniformly across all specimens, are committed as data rather than embedded in prose, and are frozen at L2. *(An earlier version of this paragraph described a D4 paraphrase mapping; that contradicted the 0.4 lowercasing rule and was repaired by amendment A2.)*

If a specimen genuinely cannot be de-marked without a bespoke sentence, that is recorded as an exception naming the specimen — and if exceptions turn out to be frequent, the claim that the manipulation is mechanical is **false and must be reported as such**, not quietly patched with better sentences.

**Propositional content must be identical between variants.** The implicit variant may not omit information — including relational information: if tabs assert "these are alternatives," the prose must assert it too, in words. The manipulation is *how* the relation is encoded, never *whether*.

This constraint is the entire safeguard against strawmanning, and it is enforced by the probe gate: every probe must be answerable from both A0 variants by a careful reader. An implicit variant that simply says less proves nothing, and the design must be able to show it didn't.

## Pipeline

Every stage is study-controlled and both arms pass through all of it. Implicit variants are valid MDX and build through Starlight like the originals.

| ID | Stage | Nature | Artifact |
| -- | ----- | ------ | -------- |
| A0 | Authored MDX | Reference | Both variants. Defines the inventory; probes gated here. Not scored. |
| A1 | Compiled HTML | Deterministic | Starlight build output |
| A2 | Accessibility tree | Deterministic | Playwright snapshot of the served page |
| A3 | Plain-text extraction | Deterministic | Named, versioned extractor in plain-text mode; no structure preserved |
| A4 | Retrieval chunks | Deterministic | Fixed-size, no overlap, parameters recorded, script committed |
| A5 | Model summary | **Stochastic** | Fixed prompt, ≥3 models, ≥2 vendors, temperature and IDs recorded |

A0 is MDX, not Markdown: components compile away before HTML, so the pipeline has a transformation stage plain-Markdown mental models omit. It is where component-level marking either survives or does not.

**A1's determinism is claimed with the corpus's ad-pinning overlay applied.** The pinned corpus contains one source of build-output randomness — a promotional component that picks an ad per page, per build. A committed overlay pins the pick and is applied identically to both arm trees before either build (ADR-0005 in the experiment repository); the pilot re-scores the two-build comparison with the overlay in place. Client-side randomness in the corpus (browser-generated tab IDs) cannot affect build output; whether it surfaces in A2 snapshots is a pilot verification item.

**A2 is snapshotted in the default page state, with no interaction** — a registered configured choice. Content hidden in the default state may be absent from A2 entirely: Starlight renders inactive tab panels hidden, and hidden content is typically excluded from the accessibility tree. That absence is a measurement of the stage, not an error — and it is a specific place where R2 evidence can die at A2 rather than A3.

**A3 comes from a named, versioned extraction tool, not a bespoke tag-stripper**, run in plain-text output mode against the article element only, with tool name, version, and configuration recorded. The plain-text mode is what keeps "no structure preserved" accurate rather than aspirational, and the extraction target is a configured choice — full-page extraction would pull sidebar, header, and search chrome into every artifact.

A5 is the only stage with a model inside the artifact-generation step, which is why it belongs to phase 2.

### What is scored at A4

At A1–A3 the artifact is the whole page, so an instance is trivially present in it. A4 is different: a page becomes many chunks, and *which chunk a probe is answered against* determines the answer. Left unfixed, that choice would be made after the artifacts exist, which makes it an analytic degree of freedom in the stage the design cares most about.

Fixed in advance: **the A4 artifact for an instance is exactly one chunk — the chunk containing the first character of that instance's host passage for that arm.** Where the host passage crosses a chunk boundary, a `spans_chunks` flag is recorded alongside the score.

A straddled passage is not an inconvenience to be routed around. It is the H3 mechanism observed directly: the evidence for the relation was cut in half, one half is present, and nothing in the chunk marks the amputation. Recording it makes it a covariate in the H3 analysis instead of a nuisance.

No retriever is involved at A4. Selecting chunks by relevance would make a deterministic stage stochastic and would confound chunking with ranking — which is why retrieval lives in the [annex](#annex-the-server-mediated-snapshot) and nowhere else.

## Hypotheses

Directional, each paired with the observation that would disconfirm it.

| ID | Hypothesis | Disconfirmed if |
| -- | ---------- | --------------- |
| H1 | **The survival gap between explicit and implicit arms widens down the pipeline.** Arms are equal at A0 by construction; explicit marking's advantage appears and grows across A3, A4, A5. | The trajectories stay parallel (marking never matters), or the implicit arm survives equal or better at every stage. |
| H2 | Among observed instances, deixis (O2) is the most fragile type, and chunking (A4) is where it breaks. | Another type is reliably more fragile, or deixis survives chunking comparably to the rest. |
| H3 | At A4, loss more often produces a wrong relation (Corrupted) than a visible gap (Absent). | Absence dominates, or the two are comparable. |
| H4 | *(Phase 2)* Prior intrusion — answering from memorized behavior rather than the artifact — rises as artifact recoverability falls. | Intrusion is flat across recoverability levels, or falls. |

**H1 is the recommendation under test.** If it fails, the series' central practical advice is unsupported in the form it is stated, and every part must say so plainly. Stating it as a *trajectory divergence* rather than a main effect does two jobs: the A0 equality is guaranteed by the propositional-equivalence gate, so any downstream gap is attributable to the pipeline acting on marking; and a difference-of-trajectories is a structural claim that does not expire with any particular model.

H2 converts the deixis convergence — two literatures independently naming deixis the fragile category — from a coincidence of citations into a prediction. H3 is the CEM loud/silent distinction made countable. H4 treats training-data contamination as a phenomenon with a number rather than a nuisance.

## Measures

### M1 — Survival trajectories (primary)

Per relation instance, per stage, per arm, on the four-level rubric. Two passes:

- **M1a — analyst-judged. Phase 1. Model-free.** The analyst answers each probe from the artifact alone, choosing among the locked options, and flags whether a correct answer was explicit or inferred. A claim about the artifact, so it does not expire.
- **M1b — model-judged. Phase 2.** Artifact plus probe in; the model selects an option; scored by exact match. Run across ≥3 models from ≥2 vendors. Multi-model consistency of the *H1 divergence* — not absolute scores — is the only claim carried forward.

Where M1a and M1b diverge is itself a finding: information present in the artifact but not recoverable *by this kind of interpreter* is the three-place predicate — a representation of x for z — made concrete.

### M2 — Redundancy inventory (descriptive)

For each specimen, record which channels carry each relation: the documentation (metalinguistic), the CLI surface (static — help output, flag names, error strings), and runtime behavior (dynamic — what actually happens). Output is a **redundancy map**: how many channels carry each relation.

Analyst-side, cheap, model-free, and it grounds the redundancy-collapse argument — currently an assertion everywhere it appears — without requiring the agent-task experiment this design deferred. It also feeds the [future channel-availability study](#future-work) a measured starting point.

### Implementation note: Inspect AI, phase 2 only

Phase 2 runs on [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai) (UK AI Security Institute, MIT, Python). In the 0.2 design Inspect was load-bearing — sandboxing, tool gating, MCP consumption. Those needs died with the cuts, so this is now a pragmatic choice rather than an architectural one, made for four reasons:

- **M1b is a forced-choice eval, which is Inspect's native task shape.** Choice-style solver, exact-match scorer against the locked answer key. No custom judge anywhere.
- **Multi-model replication is a config change**, not per-vendor API code — and the only durable claim phase 2 makes is that the H1 divergence replicates across models and vendors.
- **Epochs with a reducer declared before running** handle A5 and M1b stochasticity without a post-hoc aggregation choice that would invite the charge of picking the flattering one.
- **The design commits to publishing the logs.** Inspect's eval logs are structured, carry full transcripts and model config, and are built to be shipped and reopened. A hand-rolled harness would make the logging format itself a credibility surface.

A secondary reason: the deferred [channel-availability experiment](#future-work) needs Inspect's sandboxing and tool gating, so building phase 2 on it now means that study extends this harness rather than replacing it.

**Phase 1 does not touch Inspect.** M1a and M2 are analyst work on static artifacts — that is what makes them durable. Do not contort them into eval tasks for toolchain consistency. The annex's MCP snapshot likewise needs no framework: it is a locked query set archived verbatim. Pin the Inspect version, record it alongside model IDs, and verify current API specifics against the documentation rather than from memory.

**Build M1b and the closed-book covariate as two tasks over one shared dataset definition.** The covariate is the same probe set with no artifact attached — a trivial second task in Inspect. Sharing the dataset definition means any probe amendment propagates to both tasks or neither, so the covariate can never drift out of sync with the main eval, and the H4 comparison stays like-for-like by construction.

## Contamination

Astro's documentation is certainly in the training data of every model used in phase 2. This is the condition under which real agents read documentation, so it is measured, not scrubbed.

- **Version-change probes.** For instances where current behavior differs from a previous major version: an answer matching current docs was recovered from the artifact; an answer matching **superseded** behavior is memory overriding the text in front of the model, unambiguously. These probes carry H4. A closed-book baseline (probe with no artifact) runs as a covariate — one extra call per probe.
- **The familiarity confound, stated plainly.** The explicit arm is verbatim training text; the implicit arm is novel. In M1b this could inflate the explicit arm independent of marking. It is why M1a — immune by construction — carries the primary claim, and why M1b results are reported per specimen-age stratum with the confound named in publication. No M1b marking effect is claimed as clean evidence on its own; consistency between M1a and M1b is the evidence.

## Analysis plan

Pre-specified. Anything not listed is exploratory and labeled as such.

- **Primary (H1):** mean and full distribution of survival by arm × stage; the trajectory figure with both arms overlaid; the gap (explicit minus implicit) per stage. Reported pooled **and per specimen** — nested data means pooled counts can be driven by two atypical pages, and the reader gets to see whether the effect is broad or concentrated.
- **H2:** survival by observed type × stage. The fragility ranking is **descriptive** — probes differ across types and are not calibrated for difficulty — and is compared to the PUB ordering with that caveat stated.
- **R3 is reported split by marking device, never pooled.** Force is carried by two very different manipulations: admonitions (D3), which restructure a block, and normative keywords (D4), which change only capitalization. Pooling them would let D3's effect present as a property of force marking in general, and would let a null on D4 dilute a result on D3. Capitalization survives every deterministic stage intact, so a flat D4 trajectory is the expected outcome and is not evidence against H1.
- **H3:** among non-Preserved instances at A4, the Corrupted : Absent ratio, reported overall **and split by `spans_chunks`** — whether the host passage survived intact in one chunk or was cut across a boundary. Note in publication that offering a foil measures *endorsement* of the wrong relation and may run higher than spontaneous error; the comparison across stages and arms is symmetric, which is what H3 needs.
- **H4:** prior-intrusion rate on version-change probes against M1a recoverability of the artifact shown.
- **M1a vs M1b divergence**, by type and stage. **M2:** channels per relation, descriptive.
- **Reporting rules:** raw counts and full distributions, not only central tendency; effect sizes and distributions lead, not p-values; no unpre-specified subgroups; the coded dataset, logs, and analysis scripts are published.

## Procedure

Ordering matters: variants exist before probes are locked, so the no-distinctive-strings rule and the both-variants gate are checkable at lock time. (The 0.2 ordering made its own probe rules unverifiable.) The two locks sit at steps 1 and 8.

1. **L1 — freeze the design.** Commit; record date and SHA in `registered` / `registration_commit`.
2. **Pin the corpus** to a SHA in the run log.
3. **Select specimens** per the selection rules; record rationale and last-major-change versions.
4. **Build the relation inventory** from the explicit arm's A0; classify R1–R4, O1–O2; assign explicit-arm anchors and host passages.
5. **Generate implicit variants** mechanically; commit the transformation script and the template set.
6. **Verify propositional equivalence** across every diff hunk; log per-specimen sign-off and any de-marking exceptions; assign implicit-arm anchors and host passages.
7. **Write probes with foils**, including version-change probes. **Gate each against both A0 variants.** Exclude and log failures. Verify anchors resolve in both arms at A0.
8. **L2 — lock the instrument.** Commit the specimen list, inventory, probes, gate exclusions, templates, and the coding-order seed; record date and SHA in `instrument_locked` / `instrument_lock_commit`.
9. **Run M2** — the redundancy inventory. Its position here is a default, not a dependency: it reads no pipeline artifacts and touches nothing either lock freezes, so it may run at any point after the relation inventory exists.
10. **Generate artifacts** A1–A4 for both arms via a committed pipeline; resolve anchors and assign the A4 chunk per instance.
11. **Randomize coding order** across specimens, stages, and arms with the recorded seed; artifacts renamed to opaque IDs, mapping sealed until analysis.
12. **Run M1a.** Answer options only; source consulted only at scoring.
13. **Re-code a 20% sample after ≥7 days**; compute intra-rater kappa. Below ~0.6 the instrument is too noisy to support conclusions — report the failure, not the findings.
14. *(Phase 2)* **Generate A5** and **run M1b** across models; record model IDs, versions, temperature, toolchain versions.
15. **Analyze per plan.** Everything else is exploratory and labeled.

### Blinding, honestly

The manipulation is visible in the artifact — a step component versus a prose paragraph *is* the treatment — so no procedure makes the coder blind to arm, and this design does not claim one. What the controls actually do:

- **Locked closed-form probes remove scoring discretion.** The coder picks from pre-written options; the room for motivated interpretation is the choice among them, not a free-text judgment.
- **Randomized order and opaque IDs** prevent drift and specimen-level anchoring, which is what they can actually prevent.
- **Delayed 20% re-code with kappa** measures whether the instrument is consistent. It does not measure bias, and the publication says so.
- **A second coder for a 20% sample remains the single largest available credibility improvement.** Preferred if available; the design does not depend on it.

## Threats to validity

| Threat | Severity | Mitigation |
| ------ | -------- | ---------- |
| Experimenter bias — author codes own hypotheses | **High** | Closed-form probes locked before artifacts; exact-match scoring; sealed mapping; kappa; published dataset |
| Strawman implicit variant | **High** | Mechanical rules only; inserted language drawn from a frozen template set; relational content preserved in words; per-probe gate against both A0 variants; exceptions logged and reported |
| Training-data familiarity favors the explicit arm in M1b | **High** | M1a carries the primary claim; M1b reported by stratum with the confound named; M1a–M1b consistency is the evidence |
| Foils prime the corrupted reading | Medium | Symmetric across arms and stages; endorsement framing stated in publication |
| Chunker parameters determine A4 | Medium | Parameters recorded, script committed; chunk-selection rule fixed before artifacts exist; reported as a configured choice |
| Nested data — instances cluster within pages | Medium | Per-specimen reporting alongside pooled; minimum instances per cell set in advance |
| Ceiling — Astro's docs are genuinely good | Medium | The design measures divergence under degradation, not doc quality; chunk-level stages break structure regardless |
| Model stochasticity at A5 / M1b | Medium | Multiple runs with a pre-recorded reducer; multi-model replication; only the divergence claimed |
| Small sample | Medium | Distributions reported; claims scoped as mechanism demonstration, not population estimate |
| Corpus drift | Low | SHA-pinned; artifacts archived |

## Disconfirming outcomes

Committed in advance. Each is publishable and will be published.

- **H1 fails — trajectories parallel.** The central practical recommendation is unsupported as stated; the practical-implications material across the series becomes hypothesis, not advice. The outcome that most changes the series.
- **The gap opens only at A5.** The argument is about summarization, not transduction generally; Kress framing weakens; part 3 narrows.
- **The gap is fully present at A3 and grows no further.** The argument is about naive text extraction, which the tooling ecosystem has partly moved past; scope the claim accordingly.
- **Deixis survives well.** The convergence — currently the strongest single citation pairing in the research — is unsupported by direct measurement. Downgrade it.
- **Absence dominates corruption.** The silent-failure argument and the CEM framing built on it are weaker than claimed.
- **Prior intrusion is negligible.** Contamination was not the concern it appeared to be — worth stating, since the field currently has no number for this at all.
- **Kappa below ~0.6.** The instrument failed. Report the failure; report no findings as if they held.

A null result here is worth more to the series than a confirmation, because nobody has measured this at all.

## Annex: the server-mediated snapshot

*Observational, explicit-arm only, no hypothesis.* The dominant delivery path for this corpus is Astro's MCP server — a third-party retrieval service the docs team does not control, which replaced the `llms.txt` files Astro published and then [removed](https://github.com/withastro/docs/pull/13538). That history is itself citable for part 5: the trade conversation's previous answer lasted about a year and was deleted in favor of another syntactic-layer protocol.

The annex, if run: submit a locked query set targeting the specimen pages; archive every request and response verbatim in one tight window with dates. Score in two steps — **first a retrieval gate** (do the returned snippets contain the relation's host passage at all?), then rubric scoring **only for retrieved instances**. Retrieval misses are reported as their own category, never pooled with transduction loss. Findings are a dated snapshot of one vendor's service, framed as the category *server-mediated retrieval the author does not control* — not a claim about MCP and not a benchmark of anyone's product.

This cannot test the marking factor and never will — the server indexes only the docs as authored. That limit is structural, which is exactly why 0.2's comparative hypotheses about it were cut.

## Future work

**The channel-availability experiment.** The best idea in the 0.2 design: for a human, documentation is one of three redundant sign channels — docs, CLI surface, runtime behavior — and for an agent on a retrieval chunk the other two are gone, so explicit marking should matter little with full product access and a lot without it. That predicts why evaluations run with full product access keep concluding documentation is not the bottleneck.

It is deferred, not abandoned, because it cannot share this experiment's spine: testing marking × channels requires serving *both* arms through the delivery path, which forces a study-controlled retriever and an agent-task outcome measure (sandbox, machine-checked build success, multi-model runs) — a second experiment's worth of apparatus and its own design document. This experiment's M2 redundancy map is its natural starting point, and its machine-checked outcomes would remove the single-coder limitation this design can only mitigate.

## Deliverables

| Output | Feeds |
| ------ | ----- |
| Survival trajectory figure, both arms overlaid (H1) | Part 3; referenced by parts 1 and 2 |
| Survival by relation type and stage (H2) | Part 3, part 4 |
| Corrupted-versus-absent breakdown at A4 (H3) | Part 4 |
| Prior-intrusion rate on version-change probes (H4) | Part 4 |
| Redundancy map (M2) | Part 2 |
| Worked before/after of one corrupted relation | Part 3 opener |
| M1a–M1b divergence note | Part 4 |
| Server-mediated snapshot (annex, if run) | Part 3, part 5 |
| Coded dataset, logs, analysis scripts | Published with part 3 |
| Run log with all deviations | Published as an appendix |

## Phasing

**Phase 1 — M1a + M2.** Analyst-side, fully offline, zero model dependencies, no sandbox. Stages A1–A4, both arms. This is a complete part 3 on its own and satisfies the series' model-independence rule cleanly. **Ship it.**

**Phase 2 — A5 + M1b + version-change probes.** Adds models: summary generation, model-judged probes, contamination measurement. Feeds part 4. If phase 2 never happens, the series still has its original contribution — that asymmetry is the reason for the split.

## Data management

In the experiment repository:

```
DESIGN.md              Copy of this document, frozen at L1
AMENDMENTS.md          Amendment log
runlog.md              Chronological, including every deviation

── Code ──
src/                   Python: pipeline stages, anchor resolution, coding harness,
                       analysis; phase 2 Inspect tasks, solvers, scorers, A5 prompt
pipeline/demark/       Node: the de-marking transform, and the D2/D3/D4 template
                       set frozen at L2

── Data and outputs ──
corpus/                Pinned SHA; selected specimens, both arms
instruments/           Taxonomy; instances (with anchors and host passages);
                       probes.csv (questions, answers, foils); gate exclusions; rubric
artifacts/             A1–A4 output for both arms; mapping sealed until analysis
coding/                M1a records, append-only; re-code rows with timestamps
logs/                  Inspect eval logs, published
figures/               Generated figures
```

Code and data are kept separate so that a reader of the published repository can tell an instrument from a result without reading either. Engineering scaffolding — the implementation plan, decision records, and spikes — also lives in the repository and is marked as no part of the registration.

Coding records are append-only: never overwrite a score; add a re-code row with its own timestamp so the intra-rater comparison is reconstructable.

## Limitations to state in publication

Write these into part 3 rather than leaving a reader to discover them.

- One product, one documentation team, one house style. Results demonstrate a mechanism, not a population estimate.
- One coder, who selected the specimens, wrote the probes, and holds the hypotheses. Closed-form probes and kappa constrain this; they do not substitute for independent coding.
- Implicit variants are constructed, not found. They show what happens to one kind of under-marking — structure demoted to competent prose — not to all bad documentation.
- The chunker and summary prompt are configured by the experimenter and are not the only configurations in use.
- Forced-choice probes measure endorsement of a wrong relation, which may overestimate spontaneous corruption.
- The corpus is in training data. Phase 1 is immune; phase 2 treats it as a measured condition and a named confound.
- Phase 2 results reflect specific models on specific dates. Only the H1 divergence is claimed as durable, and only to the extent it replicates across models.

## Amendment log

Every change after registration: date, what changed, why, and whether results had been seen. An amendment made after seeing results is not disqualifying, but an unlabeled one is the difference between a study and a story.

| Date | Change | Rationale | Results seen? |
| ---- | ------ | --------- | ------------- |
| 2026-08-02 | **A1** — Added de-marking rule D8: prerequisite-heading blocks lose their heading; content stays in place, introduced by a template sentence asserting the precondition relation. | The corpus's dominant R4 idiom — "Prerequisites" headings, 48 of 417 English pages — had no applicable rule after D6 was cut at 0.3. Without D8 the manipulated R4 cell draws only from aside-carried preconditions and ~3 table pages and cannot approach its minimum. D8 avoids D6's flaw: nothing relocates. | No |
| 2026-08-02 | **A2** — Repaired stale D4 wording in *The marking manipulation*: two paragraphs still prescribed the 0.3 paraphrase mapping (`MUST` → "needs to"), contradicting the 0.4 lowercasing rule and ADR-0001. | Internal inconsistency in the registered text, discovered while drafting A1. The rule table and 0.4 changelog were correct; the templates paragraph was not. No behavior of the study changes — the transform was always specified to lowercase. | No |

## Execution checklist

- [ ] Experiment repository created; this document copied in as `DESIGN.md`
- [ ] **L1 — design frozen; date and SHA in `registered` / `registration_commit`**
- [ ] Astro docs repository pinned to SHA
- [ ] Specimens selected per rules; rationale and change-versions recorded
- [ ] Relation inventory built from A0 (R1–R4, O1–O2); anchors and host passages assigned; cell minimums checked
- [ ] Implicit variants generated mechanically; transformation script and template set committed
- [ ] Propositional equivalence verified per specimen; de-marking exceptions logged
- [ ] Probes written with foils; gated against both A0 variants; version-change subset designated
- [ ] **L2 — instrument locked; date and SHA in `instrument_locked` / `instrument_lock_commit`**
- [ ] M2 redundancy inventory complete
- [ ] Artifacts A1–A4 generated for both arms; pipeline committed; A4 chunk assigned per instance with `spans_chunks` recorded
- [ ] Coding order randomized with recorded seed; mapping sealed
- [ ] M1a coding complete
- [ ] 20% re-code after ≥7 days; kappa computed and reported
- [ ] **Phase 1 analysis run; part 3 draftable**
- [ ] *(Phase 2)* Inspect tasks written; Inspect version pinned alongside model IDs
- [ ] *(Phase 2)* A5 generated across ≥3 models, ≥2 vendors
- [ ] *(Phase 2)* M1b run; closed-book covariate collected
- [ ] *(Phase 2)* analysis per plan
- [ ] Run log complete including deviations
- [ ] Dataset, logs, and scripts published
