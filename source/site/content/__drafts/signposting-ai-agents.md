---
title: "Signposting for AI Agents"
description: ""
keywords: "information architecture, ai agent, technical writing"
date: "2026-03-04"
tags: [information architecture, ai agent, technical writing]
---

Is there a difference in how humans and AI agents interpret signposting in writing? Does signposting help agents? If yes, why? If no, does it hinder and how can writers serve both human and agent audiences?

Example articles:

- https://style.mla.org/effective-signposting/
- https://www.ncl.ac.uk/academic-skills-kit/writing/academic-writing/signposting/

## Research Synthesis

### Answering the Draft's Central Questions

The draft asks: _"Is there a difference in how humans and AI agents interpret signposting in writing? Does signposting help agents? If yes, why? If no, does it hinder and how can writers serve both human and agent audiences?"_

#### 1. Is there a difference? — Yes, fundamentally.

Human signposting operates at the **discourse level** — transition words ("however," "furthermore"), topic sentences, forward/backward references (#1, #2, #3). These are linguistic cues that manage reading flow, set expectations, and signal argument structure. They're processed interpretively: a reader infers meaning from context and convention.

AI signposting operates at the **structural level** — Markdown headings, XML tags, explicit section ordering, numbered steps (#7, #8). These are parsed mechanistically: an AI system uses them as literal delimiters for chunking (#16, #17), retrieval (#19), and prompt structure. The distinction maps onto Maschler's discourse marker taxonomy (#3): AI excels at **referential** and **structural** markers but likely gains little from **interpersonal** and **cognitive** markers.

**Key evidence:**

- Anthropic recommends XML tags and document ordering, not transition words (#7)
- OpenAI recommends Markdown headers and XML tags to "communicate hierarchy to the model" (#8)
- Chunking systems literally use headings as chunk boundaries (#16, #17)
- Stripe's llms.txt uses blunt imperatives ("always," "never," "prioritize") rather than discourse markers (#11)

#### 2. Does signposting help agents? — Yes, but a different _kind_ of signposting.

**What helps AI agents:**

- **Structural markers**: Headings, lists, section breaks → define chunk boundaries (#16, #17), aid retrieval (#18, #19)
- **Positional cues**: Front-loading key information → mitigates "lost in the middle" effect (#5, #14)
- **Explicit context**: Self-contained units that establish their own context → enables accurate retrieval (#19, #20)
- **Architectural navigation**: llms.txt (#10, #11), MCP (#13) → machine-readable site maps and protocols
- **Directive language**: Explicit instructions about priority and scope (#7, #8, #11)

**What doesn't help (and may hinder) AI agents:**

- **Verbose transition words**: Increase token count without adding semantic content → dilute information density (#14)
- **Narrative flow connectors**: "As we discussed earlier..." adds redundancy that prompt compression removes (#14)
- **Implicit discourse markers**: Interpersonal markers ("frankly," "well") carry no retrievable information for AI

**Counter-argument evidence:**

- LongLLMLingua achieves 94% cost reduction by compressing prompts — most prose is informationally redundant for AI (#14)
- Dense X Retrieval shows atomic propositions outperform passages — AI prefers factoids over narrative flow (#18)
- But: Anthropic notes "more information can be distracting for models" — parallels MLA's warning about excessive signposting (#19, #1)

#### 3. Can writers serve both audiences? — Yes, through structural signposting.

The EPPO framework (#20) provides the theoretical bridge. Baker's principle that every topic must be self-contained and establish its own context was designed for human web foragers, but maps perfectly to AI retrieval needs. The Contextual Retrieval paper (#19) proves the same principle from the AI side: chunks fail when they lack context.

**The sweet spot: Markdown-structured, self-contained content.**

- Docs-as-code (#15) naturally produces AI-readable content by stripping visual presentation
- Markdown headings serve as both human navigation and AI chunk boundaries (#16, #17)
- GitHub's content model (#4, #22) is a form of structural signposting that works for both audiences
- The "golden rule" from Anthropic (#7) — "if a colleague with minimal context could follow your prompt, Claude can too" — suggests the two audiences aren't as different as they seem

### Proposed Thesis Arc for the Post

1. **Signposting is familiar** — writers already do it for human readers (#1, #2, #3)
2. **AI agents also need signposting, but different** — structural rather than linguistic (#7, #8, #5, #14)
3. **The spectrum**: Prose markers (human) → Structural markup (both) → Machine protocols (AI) (#10, #11, #13)
4. **The surprising overlap**: Self-contained, well-structured content serves both (#20, #19, #16, #17)
5. **The practical tension**: Verbose signposting helps humans but may hinder AI (#14, #18) — the answer is _structural_ signposting, not _more_ signposting
6. **The evolution**: From prose transitions to llms.txt to MCP — signposting is being unbundled from prose and encoded in protocols

### Potential Analogies / Frameworks

- **Signposting as wayfinding**: Humans need trail markers on a hiking path; AI needs GPS coordinates. Both navigate the same terrain, but with different tools.
- **The Rule of Thirds parallel** (from the author's previous post): Just as game design principles translate to documentation, signposting principles can be translated from human writing to AI interaction — but the translation isn't 1:1.
- **USB-C analogy** (from MCP #13): MCP is like USB-C for AI. Similarly, Markdown headings are like road signs — a standardized signposting format that both humans and machines can read.

### Gaps and Areas for Further Research

- **Empirical testing**: No study yet directly compares how LLMs perform on documents with/without traditional signposting (transition words). This would be a strong differentiator for the post if it could be tested.
- **Dual-audience writing guides**: No established style guide specifically addresses writing for both human and AI readers simultaneously. The post could propose principles.
- **Industry examples**: Beyond Stripe's llms.txt (#11), more examples of companies adapting their documentation for AI consumption would strengthen the argument.
- **Counter-argument strength**: The argument that verbose signposting hinders AI is inferential (based on prompt compression and retrieval research) rather than directly tested. Worth flagging as a hypothesis rather than proven fact.

### Source Quality Summary

| #   | Source                          | Confidence      | Relevance                                      |
| --- | ------------------------------- | --------------- | ---------------------------------------------- |
| 1   | MLA Effective Signposting       | 95%             | High — establishes human baseline              |
| 2   | Newcastle Signposting           | 90%             | High — taxonomy of signpost types              |
| 3   | Wikipedia Discourse Marker      | 90%             | Medium — linguistic theory                     |
| 4   | GitHub Content Model            | 95%             | High — structural signposting in practice      |
| 5   | Lost in the Middle (Liu et al.) | 100% (abstract) | High — positional bias in LLMs                 |
| 6   | Principled Instructions         | 100% (abstract) | Medium — prompt engineering as signposting     |
| 7   | Anthropic Prompt Engineering    | 90%             | Very High — AI signposting best practices      |
| 8   | OpenAI Prompt Engineering       | 85%             | Very High — AI signposting best practices      |
| 9   | Google Tech Writing             | 0% (dead)       | N/A                                            |
| 10  | llmstxt.org                     | 95%             | Very High — machine-readable signposting spec  |
| 11  | Stripe llms.txt                 | 95%             | Very High — real-world AI signposting          |
| 12  | NN/g AI IA                      | 0% (dead)       | N/A                                            |
| 13  | MCP Introduction                | 90%             | High — protocol-level signposting              |
| 14  | LongLLMLingua (Jiang et al.)    | 100% (abstract) | High — counter-argument on information density |
| 15  | Write the Docs Docs-as-Code     | 90%             | Medium — bridge to AI readability              |
| 16  | Pinecone Chunking Strategies    | 95%             | High — headings as AI signposts                |
| 17  | Unstructured Chunking for RAG   | 90%             | High — structural boundaries for AI            |
| 18  | Dense X Retrieval (Chen et al.) | 100% (abstract) | High — proposition-level retrieval             |
| 19  | Anthropic Contextual Retrieval  | 95%             | Very High — context as signposting             |
| 20  | Every Page is Page One (Baker)  | 60% (outline)   | Very High — dual-audience theory               |
| 21  | NN/g Write for AI               | 0% (dead)       | N/A                                            |
| 22  | GitHub Style Guide              | 95%             | Medium — structural signposting rules          |
| 23  | mPLUG-Owl                       | 100% (abstract) | None — wrong paper                             |
