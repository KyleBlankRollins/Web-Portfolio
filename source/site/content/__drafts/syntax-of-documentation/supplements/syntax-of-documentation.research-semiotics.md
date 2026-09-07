+++
title = "The Syntax of Documentation"
description = "Semiotics research: prior art connecting syntactics, semantics, and pragmatics to information systems, agent communication, and documentation for AI."
published = true
+++

## What this document is

The research base for a **five-part blog series**. The series is the artifact — there is no paper, and no single piece ever assembles the whole argument. Each installment stands alone.

Two documents feed it: `syntax-of-documentation.research.md` works out the argument, and this one establishes the prior art. The series plan lives below in [The series](#the-series); everything after it is reference material organized by lineage.

The short version of the research: the syntax/semantics/pragmatics triad has an author and a lineage, and it has already been applied to information systems, interface design, and machine-to-machine communication. Four separate literatures are relevant, and they largely do not cite each other.

One of them reached technical communication directly — semiotic engineering was presented at an ACM computer documentation conference in 2001 — and then the thread went quiet. Nothing in it appears to have been carried forward to documentation read by agents. That gap, rather than a total absence of prior art, is the opening.

### How to use this document

Read [The series](#the-series) first. It assigns each finding below to a specific piece and records what must be read in full before that piece can be written. The lineage sections are evidence, not an outline — do not try to write from them in order.

## The series

### The spine claim

One sentence every piece serves, stated differently in each:

> A document is not one artifact. It is a family of representations produced by transformations you do not control, and only the relationships you make explicit survive the trip.

No single piece proves this. Each one establishes a different part and points at its siblings.

### Design rules

Because the series is the artifact, the constraints are different from a paper's.

- **Every piece is Page One.** A reader arriving at part 4 from a search result gets a complete argument. This is Baker's principle from the signposting research, and it is also the exact self-containment problem the series is about. **Say so explicitly, once, in whichever piece ships first** — the series practicing its own thesis is worth a paragraph and no more.
- **Redundancy is deliberate, not sloppy.** Each piece restates the spine claim in its own words and defines its own key terms. Do not write "as I explained in part 2."
- **Cross-links are lateral, never load-bearing.** Link siblings as further reading. A reader who follows none of them still gets the whole point of the piece they are on.
- **No piece depends on a claim about current models.** Tooling changes; the argument should not need reissuing when it does.
- **Ship order is not argument order.** Any piece can go first. Order below is by conceptual dependency, which is a drafting aid, not a schedule.

### Part 1 — Prose is not a notation

**Claim:** Natural language fails the formal requirements for reliable identification, and that is why documentation degrades under transformation. It is a property of the sign set, not a failure of writing quality.

**Uses:** Goodman's five notation criteria; Table 1 scoring verbal language (passes both syntactic, fails all three semantic); "computers do not use these sign sets. They work by protocols, which are notations"; RFC 2119 and RFC 8174 as the worked example — capitalizing MUST manufactures syntactic disjointness, defining each keyword manufactures semantic unambiguity; the musical score as anchor image.

**Open on RFC 2119, not on Goodman.** "Why does that spec shout MUST at you? There is a real answer and it is from 1968" earns the theory. Leading with analytic philosophy loses the reader in a paragraph.

**Must not contain:** any AI argument. This piece's power is that it is entirely true without agents, and it makes the rest of the series non-arbitrary. Mention agents in the final two sentences at most.

**Gate:** Goodman, _Languages of Art_ — the notation chapter, read directly. Do not cite him secondhand through Jorna and van Heusden in the piece that depends on him most.

### Part 2 — Documentation is metacommunication

**Claim:** Marking scope, force, and permission is not editorial polish added on top of someone else's design. It is the defining function of the sign class technical writers own.

**Uses:** de Souza's metacommunication framing; the three sign classes with documentation occupying the metalinguistic slot; communicability as a quality attribute distinct from usability; the 2001 SIGDOC paper as evidence this reached technical communicators twenty-five years ago and stalled.

**Must not contain:** the experiment and its results (part 3) or the benchmark evidence (part 4). This piece is about whose job it is.

**Gate — heaviest in the series.** de Souza, _The Semiotic Engineering of Human-Computer Interaction_ (MIT Press, 2005), at minimum the sign-class material; and the Silveira, de Souza, and Barbosa 2001 SIGDOC paper. Three claims in this piece currently rest on secondary sources and each is doing real work: the metalinguistic sign definition, the CEM tag list, and the "best chance to express their vision" paraphrase. The first is the piece's foundation.

### Part 3 — Every delivery is a transduction

**Claim:** Each stage of the pipeline remakes the message. Here is what actually drops out, measured.

**Uses:** Kress on transduction versus transformation, including his position that meaning is always remade rather than transferred; the revised thesis that loss is guaranteed and the writer controls only what is lost; communicability as the property being measured.

**This piece carries the series' original contribution.** The experiment runs the Astro framework's documentation through the delivery chain — authored MDX, compiled HTML, accessibility tree, text extraction, retrieval chunk, model summary — and publishes what dropped at each stage. Using a third party's documentation rather than this site's is deliberate: the pages were not written by the person testing them. Everything else in the series is synthesis. This is the only piece that produces data, and it is the reason the series is worth writing rather than reading.

**Gate:** none external. The gate is running the experiment, designed in [the experiment doc](./syntax-of-documentation.experiment-semiotics.md). Secondary sources on Kress are adequate at blog length, though one primary text would strengthen the framing.

**The experiment gates more than part 3.** Its H1 result — whether explicit marking matters more when the product's other sign channels are unavailable — determines whether part 2's practical advice is supported. H5 feeds part 1's argument that component syntax manufactures what prose lacks, and the corrupted-versus-absent split feeds part 4's account of silent failure. Run phase 1 before drafting any part; a null result on H1 changes what the whole series can claim.

### Part 4 — The layer machines are worst at

**Claim:** The semiotic layer models handle worst is the same layer documentation most often leaves implicit.

**Uses:** Morris's definition of pragmatics as relations between signs and their interpreters; the LLM pragmatic competence benchmarks; the deixis convergence — a 2016 paper argued SIM needed a deictic sign category, and the benchmarks independently name deixis among the weakest phenomena; presupposition, deixis, and implicature as the concrete failure modes; "Looks fine to me" from the CEM taxonomy as the name for silent agent failure; the experiment's corrupted-versus-absent split as direct evidence that the failure is silent rather than loud.

**Must not contain:** the "do LLMs really understand" debate. One sentence declining it is correct at blog length — the argument is representation-level and holds under either answer. Do not build a methodological section defending the bracket; that was paper-scale advice and does not apply.

**Gate:** the PUB paper, read directly. The example count is deliberately absent from this document; two conflicting figures appeared in search summaries and neither was verified. Get it from the paper before printing one. Also the 2016 deictic signs paper, which is paywalled and currently abstract-level only.

### Part 5 — We already solved this once

**Claim:** The last time we designed communication for machine agents, we reached straight for pragmatics. Then we replaced it with prose and forgot.

**Uses:** KQML from DARPA's Knowledge Sharing Effort; FIPA-ACL's 22 performatives with pre- and post-condition semantics; speech act theory underneath both; the observation that MCP, ACP, A2A, and ANP are re-solving the problem at the syntactic layer; Jorna's 1993 _Signs, Search and Communication_ as corroboration that the expert-systems era reached for semiotics too.

**Strong closer** because it recontextualizes the whole series: not a new idea, a forgotten one. Works as an opener instead if the series needs a hook more than a foundation — flagged as an open decision below.

**Gate:** the FIPA ACL specification, which is free and short. Verify Winograd and Flores, _Understanding Computers and Cognition_ (1986) before including it; it is currently in this document from memory.

### Open decisions

- **Series title, and what happens to "The Syntax of Documentation."** It currently names the whole project. It could become the series title with each part subtitled, or it could be retired in favor of something that signals the spine claim about representation. The existing `syntax-of-documentation.md` stub and its frontmatter need a decision either way.
- **Whether part 5 opens instead of closes.** Foundation-first or hook-first. Both defensible.
- **Whether part 3 ships first regardless of order.** It is the only piece with original material, and shipping it early establishes the series is worth following.

### What stays cut

Length is not a reason to include these. Recorded here so they do not get re-litigated:

- Jorna's organizational forms and the tacit/coded/theoretical knowledge taxonomy
- The multi-actor systems material — still a false friend, still not about software agents
- "Beyond Tokens: Introducing Large Semiosis Models" — non-peer-reviewed preprint
- Saussure and Derrida readings of LLMs, except as the thing being explicitly bracketed
- The signposting draft's foreground/sub-agent architecture and "narrative flow is dead" claims

## Name the framework

The triad comes from Charles W. Morris, _Foundations of the Theory of Signs_ (1938), which established syntactics, semantics, and pragmatics as the three branches of semiotics:

- **Syntactics:** relations among signs.
- **Semantics:** relations between signs and what they denote.
- **Pragmatics:** relations between signs and their **interpreters**.

Morris's definition of pragmatics is the one to quote. "Relations between signs and their interpreters" is broader than intent or tone, and it already includes non-human interpreters without straining. The current research draft uses the trichotomy unattributed. Citing Morris costs one sentence, buys ninety years of pedigree, and sets up everything below.

## Lineage 1: Semiotics has already been applied to information systems

Ronald Stamper's **organizational semiotics** extends Morris's three layers into a six-rung **semiotic ladder**:

1. Physical world
2. Empirics
3. Syntactics
4. Semantics
5. Pragmatics
6. Social world

Kecheng Liu carried the work forward in _Semiotics in Information Systems Engineering_ (Cambridge, 2000) and through the International Conference on Informatics and Semiotics in Organisations.

**Why it matters:** the ladder's central empirical claim is that information systems projects reliably succeed at the lower rungs and fail at the upper ones. Teams solve encoding and structure, then discover the project failed on meaning, intent, and commitment.

That maps directly onto the current state of AI-ready documentation. The industry has largely solved the syntactic rungs — Markdown, `llms.txt`, MCP, structured metadata, semantic markup — and has barely touched pragmatics or the social layer, where permissions and commitments live. This gives the series a structural argument with a fifty-year pedigree instead of a topical observation.

Stamper's addition of a **social world** rung is also useful on its own. It is the layer where a document creates obligations: what a reader is now licensed to do, what they are accountable for, what the organization has committed to. Documentation operates there constantly and rarely marks it.

## Lineage 2: Semiotic engineering is the theory `docs-as-interface` was reaching for

Clarisse de Souza (PUC-Rio) treats an interface as a **metacommunication artifact**: a one-shot message from designer to user that says, in effect, _here is my understanding of who you are, what you want, and how you can interact with this._ The system speaks on behalf of its designers, and the message includes the language in which the user will reply. Communication about communication.

This is the formal apparatus behind the argument in `docs-as-interface.md`. Documentation is metacommunication: the writer's message about how the product should be understood and used.

### Documentation is a named category inside the theory

This is the most useful finding in this research pass. SIM analyzes three classes of signs:

- **Metalinguistic signs** — signs that refer to _other signs_. De Souza's definition explicitly names instructions, warnings, help text, and user manuals.
- **Static signs** — interface elements whose meaning does not depend on interaction; readable in a frozen snapshot.
- **Dynamic signs** — elements whose meaning emerges through interaction over time.

Documentation is not an _analogy_ to an interface in this framework. It occupies a defined slot: documentation is the metalinguistic layer, the signs a designer uses to explain the product's other signs. That reframes the technical writer's role in the theory's own terms — the writer is the person operating the layer where the designer's intent is stated explicitly rather than implied by the interface.

De Souza's related claim is worth quoting in part 2: the online help system is where designers have their **best chance to explicitly express their vision**, because everywhere else that vision must be inferred from the interface.

### Communicability is a distinct quality attribute

Semiotic engineering defines **communicability** as the degree to which designers succeed in conveying their design intent through the interface. It is deliberately distinct from usability: a system can be usable and still fail to communicate why it works the way it does, or what the designer expected the user to do next.

For technical writers this supplies a third axis alongside accuracy and usability. A page can be factually correct and easy to read while still failing to transmit scope, force, or intent. Communicability names that failure and makes it assessable.

### The evaluation methods

- **Semiotic Inspection Method (SIM)** — analyst-side, no users involved. Five steps: inspect the documentation, analyze static signs, analyze dynamic signs, compare the three sign classes against each other, and produce an overall evaluation of the designer's meta-message. The comparative step is the interesting one: it looks for places where the metalinguistic signs (the docs) contradict what the static or dynamic signs actually communicate.
- **Communicability Evaluation Method (CEM)** — user-side. Five phases: test preparation, test application, tagging, interpretation, and semiotic profiling. Tagging annotates observed breakdowns with a fixed set of 13 stereotypical utterances.

SIM has been adapted repeatedly across contexts — games, education, web, mobile — and there is an INTERACT 2025 paper surveying those adaptations. Adapting it further is normal methodological practice, not a stretch.

### Correction: this ground is less open than I first reported

My earlier note said applying semiotic engineering to documentation appeared unclaimed. That was wrong, and the correction is more useful than the original claim:

- **Silveira, de Souza, and Barbosa (2001)**, "Semiotic engineering contributions for designing online help systems," published at the **19th annual international conference on computer documentation** — an ACM SIGDOC venue. Semiotic engineering was presented to technical communicators twenty-five years ago. Follow-up work continued through 2002 and 2003, plus "Augmenting the Affordance of Online Help Content" (2001).
- **Afonso, Bastos, de Souza, and Cerqueira (2018)** extended SIM to APIs as **API-SI**, with worked examples from Keras. Documentation is one of the explicit channels analyzed alongside API structure and behavior.

So the lineage runs GUI → online help → API. What remains genuinely unclaimed is the next step: documentation whose interpreter is an agent rather than a person. That is a narrower and much more defensible claim, and the existing chain of adaptations is what makes it credible rather than speculative.

### The other semiotic engineering: René Jorna's branch

Two people invented "semiotic engineering" independently and meant different things by it. Wikipedia's summary:

> René Jorna and Clarisse de Souza independently developed two different kinds of "semiotic engineering." Jorna's was originally closer to Artificial Intelligence and Cognitive Science. His ideas were later developed and applied to decision support systems and organizational semiotics rather than HCI.

René J. Jorna was Professor of Knowledge Management and Cognition at the University of Groningen. His branch started from AI and cognitive science rather than interface design, and it stayed on the cognition side.

**Most of it is not useful here, and it is worth saying so plainly.** The trajectory runs through organizational forms, knowledge management, and simulation of organizational behavior. Two specific traps:

- **"Multi-actor systems" is a false friend.** Jorna's MAS work simulates _human_ actors to study social sustainability and organizational dynamics. It is not about software agents reading documents. Citing it as agent research would be a straightforward misreading.
- **The knowledge-types taxonomy is off-topic.** Jorna distinguishes tacit, coded, and theoretical knowledge and maps their dominance onto organizational forms — machine bureaucracy, simple structure, professional bureaucracy, market. Genuinely interesting, entirely about organizational theory. Do not chase it.

#### The one find that justifies the search — now read in full

**Jorna, René J. and van Heusden, Barend (2003). "Why representation(s) will not go away: Crisis of concept or crisis of theory?" _Semiotica_ 143–1/4, 113–134. Walter de Gruyter.**

Read from the PDF rather than from search results, which matters: **the claims previously recorded here from search snippets are not in this paper.** There is no "instructional material" finding, no numbered types 5/6/8/9, and no sentence about "a unique interpretation for each representation by a shared decoding mechanism." Those came from somewhere else — possibly a paper citing Jorna — and were wrong to attribute here.

What the paper actually contains is more useful.

**1. The positivist position, precisely located.** The paper maps five positions on representation by how many domains they admit — material, symbolic, mental (Figure 2). The **first two-domain position** admits the material and symbolic domains while deliberately excluding the mental or cognitive one. That position is the one the authors say "has been called positivist, empiricist, rationalist, or realist." They reject it and side with the mental-domain positions, on the grounds that "leaving cognition out would dehumanize semiotics" and that signs by definition require interpretation.

This is a sharper tool than the paraphrase it replaces. The "just add markup" argument is exactly a two-domain position: documents on one side, the system they describe on the other, correspondence assumed, no interpreter modeled. Jorna and van Heusden name that position, label it positivist, and argue it cannot account for how representations actually work.

**2. Representation is a three-place predicate.** From Peirce: not "y is a representation of x" but **"y is a representation of x for z."** The paper notes that the analytical distinction between _representation as_, _representation for_, and _representation of_ "has rarely been used, with the exception of Charles S. Peirce's semiotics," and concludes that "representing implies a (cognitive) system that does the work."

For the series, this is the cleanest available formulation of why the same page can be correct for a human and useless for an agent. It is not that the document changed. It is that `z` changed, and `z` was always part of the representation. That reframes the thesis one more time, and it is Peirce rather than a contemporary invention.

**3. Goodman's notation criteria — the strongest find in the paper.** The authors work through Nelson Goodman's requirements for a sign set to qualify as a **notation**:

- _Syntactic disjointness_ — no mark may belong to more than one character.
- _Syntactic finite differentiation_ — for any two characters, it is decidable which one a mark belongs to.
- _Semantic unambiguity_ — one sign, one extension; no element refers to different things.
- _Semantic disjointness_ — no redundancy; two signs must not share a compliance class.
- _Semantic finite differentiation_ — whatever a sign denotes must be theoretically distinguishable.

Their Table 1 scores verbal language against these. Language passes **both syntactic** requirements and **fails all three semantic** ones.

Then the sentence part 1 should probably be built around:

> Neither the pictorial nor the verbal signs are notations. They cannot be used for error-free communication. As is well-known, computers do not use these sign sets. They work by protocols, which are notations.

That is the series' entire problem, stated in 1968 vocabulary and published in 2003. **Prose is a notation syntactically and not semantically.** Which is precisely why structure survives transformation and meaning does not — the syntactic layer meets the criteria for reliable identification and the semantic layer never did.

It also explains *why RFC 2119 works.* Capitalizing MUST manufactures **syntactic disjointness** — `MUST` and `must` become different characters rather than one ambiguous mark. Defining each keyword against a single conformance level manufactures **semantic unambiguity**. RFC 2119 is an attempt to carve a small notation out of a sign set that is not one. That is a much deeper account than "it's a useful convention," and it predicts the limit: you can only do this for a small closed vocabulary, never for prose in general.

**4. The musical score.** Goodman's example, quoted in the paper: a score "has as a primary function the authoritative identification of a work from performance to performance." That is the transduction problem in one line, from 1968 — how a work stays identifiable across renderings. It is a better anchor image than the Markdown-to-HTML pipeline, and a reader will hold onto it.

**5. Knowledge types, resolved.** The taxonomy is tacit-or-sensory, coded, and theoretical, defined by how many semiotic dimensions a representation involves: one-dimensional transformation, two-dimensional conventional substitution, three-dimensional structural relation. This resolves the earlier open question — "tacit" and "sensory" are the same category, not competing labels. Still organizational theory, still background.

#### Where this leaves the convergence argument

Jorna and van Heusden supply two of the four corners — the positivist diagnosis and the three-place predicate — and they are the route by which Goodman enters the series at all. See [The four-way convergence](#the-four-way-convergence) for how the corners are distributed across the parts.

#### Jorna as the connective node

Two smaller structural points.

Jorna co-chaired the International Conference on Informatics and Semiotics in Organisations with Kecheng Liu. That means Lineage 1 and Lineage 2 in this document are not as independent as they first appeared — the organizational semiotics community and this branch of semiotic engineering share people and venues. Worth knowing so the series does not overstate how disconnected the traditions are.

Jorna also co-edited _Signs, Search and Communication: Semiotic Aspects of Artificial Intelligence_ (de Gruyter, 1993, with van Heusden and Roland Posner), which grew out of an "Expert Systems, Culture and Semiotics" conference in Groningen in 1990. Its three sections are Signs and Representations; Abduction and Reasoning in Expert Systems; and Communication with Expert Systems.

That pairs neatly with the KQML and FIPA-ACL point in Lineage 3. Same era, same instinct: when the field last built AI systems in earnest, it reached for semiotics and speech act theory. Then both threads went quiet for thirty years. The post can use this as corroboration that the current moment is a rerun, not a novelty — but one sentence is enough. The book is a 1993 expert-systems artifact and its technical content has not aged into relevance.

## Lineage 3: We already built pragmatics-first languages for agents, then abandoned them

This is the strongest historical hook available.

**KQML** (Knowledge Query and Manipulation Language) came out of DARPA's Knowledge Sharing Effort in the 1990s. **FIPA-ACL** followed and codified **22 performatives** — `inform`, `request`, `agree`, `refuse`, `propose`, and others — with formal pre- and post-condition semantics grounded in agent beliefs, desires, and intentions.

Both are built directly on speech act theory (Austin, Searle): representatives assert, directives try to get the hearer to act, commissives commit the speaker to future action.

**The turn for part 5:** the last time we designed communication for machine agents, we went straight to pragmatics. Not syntax. Illocutionary force, as a first-class primitive. We have since replaced that with natural-language prose and are rediscovering the same problem from scratch — and the current answer (MCP, ACP, A2A, ANP) is once again mostly at the syntactic layer.

Almost nobody in the docs-for-AI conversation knows this history. It reframes part 5 from "here is a new idea" to "here is a solved problem we forgot about," which is a stronger and more durable claim.

**Unverified thread worth chasing:** Winograd and Flores, _Understanding Computers and Cognition_ (1986), applied speech act theory to system design and is probably part of this lineage. I did not verify this against a source; confirm before citing.

## Lineage 4: Kress supplies part 3's central term — and a fight worth having

Gunther Kress's social semiotics distinguishes:

- **Transformation:** rearranging meaning-material _within_ a mode.
- **Transduction:** moving meaning-material _across_ modes — writing remade as image, speech remade as action.

Kress coined "transduction" in 1997 specifically to name the process of moving meaning across modes.

The delivery chain the experiment measures — authored MDX, compiled HTML, accessibility tree, text extraction, retrieval chunk, model summary — is a **transduction chain**. There are twenty-five years of theory on exactly this, and the series can borrow the vocabulary directly.

### The productive tension

Kress argues that transduction **always remakes meaning**. It is never neutral transfer. Some of the original message is always lost or changed.

That contradicts the working thesis as currently worded:

> Good information design makes meaning survive changes in representation.

The contradiction improves the argument. The honest claim is not that meaning survives intact — Kress would say that is not available. It is that **loss is guaranteed, and what the writer controls is which relationships are explicit enough to be re-encoded and which get silently dropped.**

Revised thesis to consider:

> Every transformation remakes meaning. Information design determines what gets remade faithfully and what gets lost silently.

Engaging Kress directly is what makes this credible rather than hedged. Dodging him leaves part 3 asserting something a semiotician would immediately reject.

## The empirical evidence part 4 rests on

The research draft flags that "explicit structure is more likely to survive extraction and transformation" is the load-bearing claim and is unsupported. The signposting draft flags the same gap. There is now a real literature on **LLM pragmatic competence** that supplies a defensible version.

Key work:

- **PUB (Pragmatics Understanding Benchmark)**, Sravanthi et al. 2024 — a large multi-task benchmark across four phenomena: implicature, presupposition, deixis, and reference. Finds consistent weakness in inferential reasoning. **These four phenomena are the experiment's relation taxonomy**, which is why the benchmark does structural work here rather than only evidentiary work.
- **Manner implicatures in large language models**, _Scientific Reports_ 2024 — models handle implicature when it follows frequent, recognizable patterns, and degrade otherwise.
- **On the Same Wavelength?** (arXiv 2509.06952) and **Are LLMs good pragmatic speakers?** (arXiv 2411.01562) — both evaluate against the **Rational Speech Act** framework (Frank and Goodman), which models pragmatic inference as recursive reasoning about speaker and listener intent.

The consistent finding across this work: models are strongest at syntax and measurably weaker at **intention recognition, presuppositional reasoning, and indirect meaning**.

### Why this is the right evidence

It supplies a mechanism for the "semantic drift" section instead of an assertion. Documentation is saturated with exactly the phenomena models handle worst:

- **Presupposition** — "the key," "your existing configuration," "the previous step" all presuppose a referent established elsewhere.
- **Deixis** — "as described above," "this step," "the following section," "see below." These are pointers into surrounding context. They break the instant a chunk is extracted. Deixis is the single most citable failure mode for retrieval, and it is invisible to the author because the referent is right there on the page.
- **Implicature** — "you may want to rotate keys regularly" implies a recommendation without stating its force. Is that optional? Advised? Required?

The claim part 4 can now make precisely:

> The semiotic layer models are measurably weakest at is the same layer documentation most often leaves implicit.

That is an argument, not an assertion, and it does not depend on any particular tool or vendor.

## RFC 2119: part 1's worked example

**RFC 2119.** MUST / SHOULD / MAY / REQUIRED / OPTIONAL — a standardized vocabulary for **illocutionary force** in technical specifications. Published 1997. Since escaped into W3C specifications, OpenAPI, JSON Schema, vendor API docs, and internal engineering standards.

The detail that makes it perfect for part 1: **RFC 8174** (2017) closed a gap by ruling that the keywords carry normative weight **only when written in all capitals**. A lowercase "must" is just English. A capitalized "MUST" is a conformance requirement.

The pragmatic force is marked **syntactically**, deliberately, so it survives being read by someone who does not share the author's context.

That is the entire thesis of the series in a single artifact that predates the AI conversation by twenty years. It also proves the argument is not AI-driven hype: engineers hit this exact problem with human readers and solved it with syntax.

**Adjacent prior art:** [Diátaxis](https://diataxis.fr/) (Daniele Procida) is already a pragmatics-first framework. Its founding question is "what is the reader trying to do?", and the four types — tutorial, how-to, reference, explanation — follow from user intent rather than content type. It organizes documentation by pragmatics without using the word. Worth one paragraph as evidence that the field already reaches for pragmatics when it wants to be rigorous.

## One swamp to avoid

There is a growing "LLMs as semiotic machines" literature:

- Vromen, _Language Models as Semiotic Machines_ (2024) — reads LLMs through Saussure and Derrida, arguing they model _writing_ rather than thought.
- Gudwin's **computational semiotics** — Peircean, aimed at _building_ intelligent agents rather than writing for them.
- Webb Keane, _Journal of the Royal Anthropological Institute_ — semiotic ideology and how authority and intention get attributed to chatbots.

Most of this argues about whether LLMs mean anything: masters of the signifier, disconnected from the signified, and so on.

**Do not enter this argument.** It is a philosophy-of-mind debate with no bottom, and the series' question is orthogonal: how do I encode relationships that survive a processing pipeline? That question holds whether or not anything "understands." Explicitly declining the debate in one line is a strength, and it keeps the argument practical.

## The gap, and the position to take

The 2026 trade conversation about AI-ready documentation is **entirely syntactic**. `llms.txt`, MCP servers, structured Markdown, metadata, semantic markup, controlled terminology. Cherryleaf's 2026 survey found only 27% of respondents had adapted their content for AI agents, with 44% having no plans.

Meanwhile the semiotics-of-AI academics are not writing about documentation practice at all, and the one tradition that _did_ write about documentation — semiotic engineering, at an ACM computer documentation conference in 2001 — stopped before agents existed.

The position available to the series:

> The industry is optimizing the layer that was never the bottleneck. Four decades of information systems theory say systems fail at the top of the semiotic ladder, not the bottom. There is now benchmark evidence that pragmatics is exactly where the models are weakest. And the one field that solved this — agent communication languages — solved it with performatives, not markup.

The strength of this position is that almost none of it is new. The series is not proposing a theory; it is pointing out that several mature literatures already answered the question the industry is currently asking badly.

**Phrase the gap honestly.** This document's claim that nobody occupies the middle rests on targeted keyword searching, not a systematic review. A blog series does not need a methods section, but it should not overclaim either. Write "I could not find anyone connecting these" rather than "nobody has connected these." The first is true and checkable; the second invites a reply linking three papers, and one of them will exist.

## Practical implications for technical writers

Most of these recommendations are not new practices for technical writers. Good documentation has always named its referents, stated prerequisites, distinguished requirements from suggestions, and told readers how to verify an outcome. The new pressure comes from the delivery chain. Documentation is metacommunication: a message from the product's designers, carried by the writer, about who the reader is, what they are trying to do, and how the system can be used. That message now passes through more interpreters and transformations before it reaches an agent.

The practical question is therefore not only whether an agent can retrieve a passage. It is whether the agent can recover what the passage means, what it authorizes, and what it expects. Documentation intended for both people and agents should make the following explicit:

- **What a concept refers to.** Name the resource, configuration, version, or error rather than relying on "this," "the key," or "the previous step."
- **Which action is being requested.** Separate explanation from instruction, and state the action in a form that can be followed without reconstructing the writer's intent.
- **How mandatory the action is.** Use an established vocabulary such as `MUST`, `SHOULD`, and `MAY` when the distinction matters.
- **What assumptions must already hold.** State prerequisites, prior configuration, permissions, and environment requirements instead of leaving them as presuppositions.
- **What permissions are required.** Say what the reader or agent is authorized to change, access, or disclose, and identify actions that require approval.
- **What success and failure look like.** Include observable outcomes, validation steps, and recovery paths so the agent can distinguish completion from a plausible-looking partial result.
- **Which audience and task the passage serves.** Identify whether the material is a tutorial, how-to guide, reference, or explanation, and keep those purposes distinct.

These choices do not make documentation mechanical. They mark the relationships most likely to disappear when prose is transformed into HTML, an accessibility tree, a retrieval chunk, or an agent-generated summary. In Kress's terms, these are transductions, not neutral transfers. Each stage remakes the message according to the affordances and constraints of its medium. A heading may survive extraction while the scope of a warning does not. A link may remain technically valid while losing the reason the reader was sent there. A sentence may retain its words while losing whether it describes, recommends, or requires an action.

### Why this is the writer's job specifically

Semiotic engineering supplies the argument for why these choices belong to the technical writer rather than to the interface designer or the platform team.

In the theory's own vocabulary, documentation is the **metalinguistic** layer: the signs whose job is to explain the product's other signs. Static and dynamic signs — the interface itself — communicate design intent only by implication, and the reader has to infer it. Metalinguistic signs are where intent can be stated outright. De Souza's position is that online help and documentation are the designer's best opportunity to express the product's rationale explicitly, because nowhere else is it available in words.

That gives the writer a defensible claim on the pragmatic layer. Marking scope, force, prerequisites, and permissions is not an editorial embellishment on top of someone else's design decisions. It is the specific function of the sign class technical writers own. When an agent misreads what a procedure authorizes, the failure is in the metalinguistic layer, and that is the writer's layer.

### Control the delivery chain

Semiotic engineering suggests a useful design question at each stage: what part of the writer's message can this medium express, and what part might it erase? The writer cannot control every transformation, but can make important relationships easier to carry forward:

- **Give structure semantic work to do.** Use headings, lists, tables, code blocks, admonitions, and metadata to mark relationships such as scope, sequence, alternatives, and warnings. Structure should expose meaning, not merely decorate the page.
- **Keep force close to the action.** Put prerequisites, permissions, warnings, and validation beside the step they qualify. Do not make the next interpreter reconstruct scope from distant prose or visual layout.
- **Make passages independently intelligible.** Retrieval systems and agents may receive a section without its surrounding page. Repeat the necessary subject and context, replace positional references with named ones, and make links meaningful outside their original location.
- **Preserve the message across representations.** Check the source Markdown, rendered HTML, accessibility tree, and representative retrieval chunks for the same hierarchy and relationships. A successful build proves that the document was transformed, not that its communication survived.
- **Evaluate communicability, not only correctness.** Semiotic engineering's distinction between inspecting the designer's message and evaluating whether that message arrives gives documentation teams two separate checks: did we encode the intended instruction, and can the intended reader or agent recover it?

### A failure taxonomy that already exists

The Communicability Evaluation Method tags observed breakdowns with a fixed vocabulary of stereotypical user utterances. Verified examples include:

| Tag                      | Breakdown                                     |
| ------------------------ | --------------------------------------------- |
| "What's this?"           | Cannot interpret a sign at all                |
| "Where is it?"           | Cannot locate the needed function             |
| "Where am I?"            | Disoriented about current state               |
| "Help!"                  | Needs assistance to continue                  |
| "I can do otherwise"     | Deliberately chooses a different path         |
| "I can't do it this way" | Blocked from the intended action              |
| "Oops!"                  | Unintended action, immediately recognized     |
| "What happened?"         | Cannot interpret the system's response        |
| "Why doesn't it?"        | Expected action produced an unexpected result |
| "Looks fine to me"       | Declares completion without verifying         |
| "I give up"              | Abandons the goal                             |

Two of these are worth part 4's full attention, because the literature draws a distinction between them that maps precisely onto agent behavior.

**"What's this?" versus "Why doesn't it?"** — the first means the reader could generate _no_ interpretation. The second means the reader believed they understood the signs and generated the _wrong_ interpretation. The first failure is loud and recoverable. The second is silent and expensive.

**"Looks fine to me"** — the user declares the task complete without verifying it. This is the failure mode described in `docs-as-interface.md`: the agent performs impressive mental gymnastics, produces a plausible-looking result, and reports success without flagging that it never found what it was looking for.

This is a strong finding for part 4. An HCI taxonomy developed around 2000, for observing humans clicking through GUIs, already named the exact failure mode that makes agent-consumed documentation risky. Part 4 does not need to invent a vocabulary for agent failure. One exists, it is grounded in a theory of designer-to-user communication, and it was built for a different interpreter entirely — which is itself evidence that the problem is about communication rather than about AI.

Worth noting the honest limit: CEM is a method for observing users in a controlled setting with screen capture. Applying the tag vocabulary to agent transcripts is an adaptation, not a straight application. The experiment treats it as descriptive vocabulary, not as a method it claims to run.

### What semiotic engineering actually contributes

The experiment is **not** an application of SIM or CEM, and no part of the series may describe it as one. SIM compares three sign classes within one system at one time, qualitatively, to reconstruct a designer's meta-message; the experiment compares representations of one sign class across a pipeline, quantitatively. CEM requires an interpreter acting under observation. Claiming to run either would raise the standard of proof on primary sources this project has not read — see [Verification caveats](#verification-caveats).

What the theory supplies instead is worth more than a borrowed procedure:

- **Communicability is the construct being measured.** Not accuracy, not readability — whether the intended interpreter can recover the writer's intent. That is the citation, and it belongs to the theory rather than to either method.
- **The analyst-side stance.** SIM inspects without users on purpose. A judgment about what an artifact affords is a claim about the artifact, and it does not expire when models change — which is how the series honors its own rule that no piece depends on a claim about current models.
- **The three sign classes are a manipulable variable**, not just a description. See below.
- **The loud/silent breakdown distinction** decides how loss must be scored. A relation replaced by a *wrong* relation is a worse outcome than one that is merely absent, and any rubric that collapses both into "lost" discards the finding.

### Redundancy collapse — the argument part 2 should be built on

This is the strongest claim available to the series, it comes straight out of the sign-class trichotomy, and it costs one paragraph.

For a human reader, documentation is one of **three redundant channels**. The docs are metalinguistic signs. The product's surface — command names, flags, error strings — is static signs. What the product actually does is dynamic signs. If the docs are unclear you run `--help`, you try it, you read the error. Meaning gets triangulated across three sources, which is why mediocre documentation often still works.

For an agent operating on a retrieval chunk, **two of those three channels are gone.** The channel that was one of three supports becomes the only one.

That explains why documentation matters *more* for agents than for humans, in the theory's own vocabulary, **without any appeal to model capability** — which is exactly what the series' design rules demand. It also generates the experiment's central hypothesis: explicit marking should matter little when the product is available and a great deal when it is not. If that holds, it explains why the trade conversation keeps concluding documentation is not the bottleneck. Evaluations are run with full product access, where redundancy masks the loss.

### The deixis convergence

One detail worth flagging because it connects two lineages that do not cite each other. A 2016 paper argued that SIM's three sign classes were insufficient and proposed adding a category for **deictic signs** — signs that establish an indexical relation to their object, locating it in person, time, or space relative to the moment of communication.

Independently, the LLM pragmatics benchmarks identify deixis as one of the four phenomena models handle worst.

Two separate research communities, working on different problems with different methods, both landed on deixis as the fragile category. That convergence is a genuinely strong piece of evidence for the series' argument about "this step," "as described above," and "the following section," and it costs one paragraph to make.

The goal is not to preserve every word. It is to preserve enough structure, meaning, and pragmatic force for the next interpreter to act correctly. AI agents make the delivery problem conspicuous, but the underlying discipline is broader: design documentation so its message remains recoverable as it moves through the system that delivers it.

## The four-way convergence

Not assigned to a single part — it is the reason the spine claim holds, and each piece can invoke its own corner of it.

- **Morris:** pragmatics is the relation between signs and their _interpreters_. Drop the interpreter and you have deleted a third of semiotics.
- **Kress:** transduction always remakes meaning; there is no neutral transfer.
- **Jorna and van Heusden:** admitting only the material and symbolic domains while excluding the cognitive one is the positivist position — and representation is a three-place predicate whose third place is the interpreter.
- **Goodman:** natural language is not a notation; only protocols are.

Four vocabularies, one conclusion: a representation without a modeled interpreter is not a complete description of anything. Linguistics, social semiotics, cognitive science, and analytic philosophy arrive there independently.

For a series this matters more than it would for one post. A reader who rejects Kress as too literary, or Goodman as too formal, still has to deal with the other three — and because each part leans on a different corner, no single objection takes down the whole series.

## Sources

### Foundational

- [Syntax, Semantics, Pragmatics (Rapaport)](https://cse.buffalo.edu/~rapaport/675w/synsemprag.html): University at Buffalo. Use this as the accessible gloss on Morris's 1938 trichotomy, including the definition of pragmatics as relations between signs and their interpreters.
- [Organisational semiotics](https://en.wikipedia.org/wiki/Organisational_semiotics): Use this for Stamper's semiotic ladder and the six rungs. The claim that projects fail at the upper rungs is the structural argument for the series.
- [Semiotics in Information Systems Engineering](https://www.researchgate.net/publication/200026800_Semiotics_in_Information_Systems_Engineering): Kecheng Liu, Cambridge University Press, 2000. Use this as the citable book-length treatment of semiotics applied to information systems.

### Semiotic engineering

- [A semiotic engineering approach to HCI](https://dl.acm.org/doi/10.1145/634067.634104): Clarisse de Souza, CHI '01. Use this for the metacommunication framing — the interface as a one-shot message from designer to user.
- [The Semiotic Engineering of Human-Computer Interaction](https://direct.mit.edu/books/monograph/2475/The-Semiotic-Engineering-of-Human-Computer): de Souza, MIT Press, 2005. The canonical book. Use this for the citable statement of the theory.
- [Semiotic engineering (overview)](https://en.wikipedia.org/wiki/Semiotic_engineering): Use this for the summary of SIM and CEM as evaluation methods.
- [Semiotic Engineering Methods for Scientific Research in HCI](https://link.springer.com/book/10.1007/978-3-031-02185-5): de Souza and Leitão. Use this if the series needs the methods in more detail.
- [Semiotic engineering: bringing designers and users together at interaction time](https://www.sciencedirect.com/science/article/abs/pii/S0953543805000202): Use this for the argument that designers must be present in the interface to explain its signs.

### Semiotic engineering applied to documentation and APIs

This is the chain that makes the series' claim credible: the theory has already moved GUI → online help → API.

- [Semiotic engineering contributions for designing online help systems](https://www.researchgate.net/publication/220961419_Semiotic_engineering_contributions_for_designing_online_help_systems): Silveira, de Souza, and Barbosa, 2001, 19th annual international conference on computer documentation (ACM SIGDOC). **The key citation.** Semiotic engineering was presented to technical communicators twenty-five years ago. Use this to establish that documentation is inside the theory's scope, not an extension of it.
- [Augmenting the Affordance of Online Help Content](https://link.springer.com/chapter/10.1007/978-1-4471-0353-0_17): Silveira, Barbosa, and de Souza, 2001. Companion work on help content.
- [The Case for API Communicability Evaluation: Introducing API-SI with Examples from Keras](https://arxiv.org/abs/1808.05891): Afonso, Bastos, de Souza, and Cerqueira, 2018. Use this as the precedent for adapting SIM to a developer-facing artifact where documentation is one of the analyzed channels.
- [SigniFYI-CDN: merged communicability and usability methods to evaluate notation-intensive interaction](https://arxiv.org/pdf/1808.08138): Use this if the series needs precedent for applying these methods to notation-heavy material rather than graphical interfaces.

### Semiotic engineering methods in detail

- [The semiotic inspection method](https://www.researchgate.net/publication/228621249_The_semiotic_inspection_method): Use this for the three sign classes — metalinguistic, static, dynamic — and the five-step procedure. The definition of metalinguistic signs as instructions, warnings, help text, and manuals is the single most useful sentence in this research pass.
- [Methods and tools: a method for evaluating the communicability of user interfaces](https://interactions.acm.org/archive/view/jan.-feb.-2000/methods-and-tools-a-method-for-evaluating-the-communicability-of-user-): ACM _interactions_, 2000. Use this as the original accessible description of CEM.
- [Communicability evaluation case study](https://id-book.pages.dev/thirdedition/casestudy_14-3_2): Companion material to Preece, Rogers, and Sharp's _Interaction Design_. Use this for the tag list and the five CEM phases.
- [Categorizing communicability evaluation breakdowns](https://www.researchgate.net/publication/228817560_Categorizing_communicability_evaluation_breakdowns_in_groupware_applications): Use this for the distinction between "What's this?" (no interpretation generated) and "Why doesn't it?" (wrong interpretation generated). This is the distinction that maps onto silent agent failure.
- [An analysis of deictic signs in computer interfaces: contributions to the Semiotic Inspection Method](https://www.sciencedirect.com/science/article/abs/pii/S1045926X16300337): 2016. Use this for the argument that SIM needed a deictic sign category, and pair it with the LLM deixis findings.
- [Adaptations of the Semiotic Inspection Method (SIM) Across Different Contexts](https://dl.acm.org/doi/10.1007/978-3-032-05008-3_32): INTERACT 2025. Use this to show that adapting SIM to a new context is established practice.
- [Application of the Communicability Evaluation Method: a case study in Web domain](https://link.springer.com/chapter/10.1007/978-3-319-40409-7_45): Use this for the definition of communicability as the degree to which designers convey design intent, and its distinction from usability.

### Jorna's branch of semiotic engineering

Mostly background. The first entry is the one to actually use.

- **Jorna, René J. and van Heusden, Barend (2003). "Why representation(s) will not go away: Crisis of concept or crisis of theory?" _Semiotica_ 143–1/4, 113–134. Walter de Gruyter.** [PhilPapers record](https://philpapers.org/rec/JORWRW). **The one to use, and read in full.** Local copy: `JornaandVanHeusdenWhyRepresentationsWillNotGoAway2003.pdf`. Use it for four things: the five positions on representation and the location of the positivist one (pp. 121–124); representation as a three-place predicate, "y is a representation of x for z" (p. 117); Goodman's five notation criteria and Table 1 scoring verbal language (pp. 118–120); and the claim that verbal signs are not notations while computer protocols are (p. 120). The musical score as "authoritative identification of a work from performance to performance" is Goodman quoted on p. 118.
- [Signs, Search and Communication: Semiotic Aspects of Artificial Intelligence](https://www.degruyterbrill.com/document/doi/10.1515/9783110871579/html?lang=en): Jorna, van Heusden, and Posner, de Gruyter, 1993. Use this only as period evidence that semiotics and AI were joined once before, alongside the KQML and FIPA-ACL point.
- **Goodman, Nelson. _Languages of Art_ (1981 [1968]).** Not consulted directly, but the source of the notation criteria and the musical-score example that Jorna and van Heusden build on. **Worth getting.** If part 1 uses the "prose is not a notation" argument as its spine — and it should — this is the primary source, and citing it directly is stronger than citing it secondhand.
- **Van Heusden, Barend and Jorna, René J. (2000). "Toward a semiotic theory of cognitive dynamics in organizations."** In _Organizational Semiotics_, Kecheng Liu (ed.), 83–113. Amsterdam: Kluwer. Hard confirmation that Jorna published inside Liu's organizational semiotics program — Lineages 1 and 2 in this document share authors and venues.
- [Cognition, Actors and Organizations, or Why Organizations are about Managing Knowledge](https://research.rug.nl/en/publications/actors-and-organiations-or-why-organizations-are-about-managing-k): Jorna, _SEED Journal_, 2002. Source for "management of knowledge is management of representations" and the tacit/coded/theoretical taxonomy. Organizational theory — background only.
- [Semiotic engineering, modeling and the use of multi-actor systems (MAS) for studying social sustainability](https://www.researchgate.net/publication/281612848_Semiotic_engineering_modeling_and_the_use_of_multi-actor_systems_MAS_for_studying_social_sustainability_theoretical_background_and_specifications): Jorna. **Do not cite as agent research.** "Multi-actor" here means simulated human actors in sustainability modeling.
- [Semiotic engineering (Wikipedia)](https://en.wikipedia.org/wiki/Semiotic_engineering): Use this for the sourced statement that Jorna and de Souza developed the term independently. Note that the page cites no Jorna publications directly.

### Agent communication languages

- [FIPA Agent Communication Language specification](http://www.fipa.org/specs/fipa00003/OC00003A.html): Foundation for Intelligent Physical Agents. Use this as the primary source for performatives and speech-act-based agent communication. The 22 performatives are the concrete detail worth naming.
- [A survey of agent interoperability protocols: MCP, ACP, A2A, ANP](https://arxiv.org/pdf/2505.02279): 2025. Use this to show that current agent protocols are re-solving the same problem at the syntactic layer.

### Transduction and multimodality

- [Transduction — Glossary of multimodal terms](https://multimodalityglossary.wordpress.com/transduction/): Use this for Kress's definition of transduction as movement of semiotic material across modes, coined 1997.
- [Transformation, transduction and the transmodal moment](https://www.researchgate.net/publication/306154080_Transformation_transduction_and_the_transmodal_moment): Use this for the distinction between transformation and transduction, and for the claim that meaning is always remade rather than transferred.

### LLM pragmatic competence

- [PUB: A Pragmatics Understanding Benchmark for LLMs](https://arxiv.org/pdf/2401.07078): Sravanthi et al., 2024. Use this as the primary evidence that models are weakest at implicature, presupposition, deixis, and reference, and as the source of the four-phenomenon taxonomy the experiment codes against.
- [Manner implicatures in large language models](https://www.nature.com/articles/s41598-024-80571-3): _Scientific Reports_, 2024. Use this for the nuance that models handle implicature when it follows recognizable patterns and degrade otherwise. Peer-reviewed, which matters here.
- [On the Same Wavelength? Evaluating Pragmatic Reasoning in Language Models across Broad Concepts](https://arxiv.org/pdf/2509.06952): Use this for breadth across pragmatic phenomena.
- [Are LLMs good pragmatic speakers?](https://arxiv.org/pdf/2411.01562): Use this for the Rational Speech Act evaluation angle.
- [The Rational Speech Act Framework](https://www.researchgate.net/publication/365228143_The_Rational_Speech_Act_Framework): Frank and Goodman lineage. Use this only if part 4 needs to explain what RSA models.

### Pragmatic force in practice

- [RFC 2119](https://www.rfc-editor.org/errata/rfc2119) and [RFC 2119 explained](https://rfc-explained.com/en/2119): Use these for MUST/SHOULD/MAY as a standardized vocabulary for illocutionary force. Note RFC 8174's 2017 rule that keywords are normative only in all capitals — syntax marking pragmatics.
- [W3C RfcKeywords](https://www.w3.org/wiki/RfcKeywords): Use this to show the convention escaping beyond IETF into W3C, OpenAPI, and JSON Schema.
- [Diátaxis](https://diataxis.fr/): Daniele Procida. Use this as prior art for organizing documentation by what the reader is trying to do.

### Context on the current conversation

- [AI in technical communication: 2026 survey](https://www.cherryleaf.com/2026/06/ai-in-technical-communication-2026/): Cherryleaf. Use this for the adoption numbers — 27% adapted, 44% with no plans.
- [Prepare APIs for AI agent consumption](https://buildwithfern.com/post/prepare-apis-documentation-ai-agent-consumption): Fern, 2026. Use this as a representative example of the trade conversation operating entirely at the syntactic layer.

### Optional, use with care

- [Language Models as Semiotic Machines](https://arxiv.org/abs/2410.13065): Elad Vromen, 2024. Saussure and Derrida applied to LLMs. Interesting, but it leads into the "do LLMs mean anything" debate. Cite only to decline the debate.
- [Computational Intelligence and Semiotics](https://see.library.utoronto.ca/SEED/Vol3-3/Introduction.htm) and [Towards an introduction to computational semiotics](https://www.researchgate.net/publication/4142360_Towards_an_introduction_to_computational_semiotics): Gudwin. Peircean semiotics aimed at building agents, not writing for them. Adjacent, not central.
- [From talking tools to metahumans](https://rai.onlinelibrary.wiley.com/doi/10.1111/1467-9655.70133): Webb Keane, _Journal of the Royal Anthropological Institute_. Semiotic ideology and attributed authority in chatbots. Promising but unverified — see caveats.

## Verification caveats

Track these before citing anything above in the published post.

- **Webb Keane article:** the full text returned HTTP 403 and could not be read. The summary above comes from search results only. Read it before citing.
- **"Beyond Tokens: Introducing Large Semiosis Models":** appeared in search results, hosted on preprints.org, could not be retrieved (403). Not peer-reviewed. Recommend leaving it out entirely.
- **Winograd and Flores, _Understanding Computers and Cognition_ (1986):** included from memory as a likely part of the speech-act-to-system-design lineage. Not verified against a source in this research pass.
- **Morris 1938:** the trichotomy and the definition of pragmatics are well attested in secondary sources cited above. The primary text was not consulted directly.
- **PUB benchmark size:** two conflicting figures (22,000 and 28,000) came from search summaries and neither was verified against the paper. The count has been removed from this document rather than guessed — read the paper before printing one. The four-phenomenon taxonomy itself is well attested and is what the experiment depends on.
- **CEM tag list:** the literature consistently says there are **13** tags. The table above lists 11, taken from a verified secondary source; the remaining two were not confirmed. Get the full canonical list from de Souza's book or the original _interactions_ article before publishing the table.
- **Silveira, de Souza, and Barbosa (2001):** confirmed via search results as appearing at the 19th annual international conference on computer documentation. The full text was not retrieved. Verify the venue name and page numbers before citing formally — SIGDOC's proceedings naming has changed over the years.
- **API-SI:** abstract and author list retrieved and confirmed. The claim that documentation is one of the analyzed channels comes from the abstract-level summary; read the full paper before describing the method in detail.
- **de Souza on online help as the "best chance to express design vision":** this is a paraphrase assembled from secondary sources, not a verified direct quotation. Do not put it in quotation marks without checking the original.
- **Metalinguistic sign definition:** the gloss "instructions, warnings, help text, and user manuals" comes from secondary descriptions of SIM. Confirm against de Souza's own wording before building part 2's central reframe on it.
- **Deictic signs paper (2016):** abstract-level only; the full text is paywalled at ScienceDirect. The convergence argument is sound at the level of "both literatures name deixis," but do not claim more detail than that without reading it.
- **Jorna and van Heusden (2003): RESOLVED — read in full from PDF.** Citation confirmed as _Semiotica_ 143–1/4, 113–134. The earlier entries here were wrong: the paper contains no "instructional material" finding, no numbered representation types 5/6/8/9, and no "shared decoding mechanism" sentence. Those search-snippet claims have been removed from the body. Everything now attributed to this paper was read directly. Quotations are from a script-based text extraction, so **re-check exact wording and page numbers against the PDF before publishing any of them as direct quotes** — ligatures were dropped in extraction (for example "difference" rendered as "dierence"), which means the extraction is lossy even where it is legible.
- **Jorna's knowledge types: RESOLVED.** The paper says "tacit or sensory knowledge, coded knowledge, and theoretical knowledge." Tacit and sensory are the same category, not competing labels.
- **Goodman's notation criteria:** taken from Jorna and van Heusden's presentation of them, including their page citations to _Languages of Art_ (1981 [1968]). If part 1 leans on Goodman heavily, cite him directly rather than through this paper.
- **_Signs, Search and Communication_ section titles:** taken from a publisher listing, not from the book. Chapter-level contents were not retrieved.
- **Jorna and Liu co-chairing ICISO:** from a conference call-for-papers page. Fine as background, but verify the year if the series states one.
