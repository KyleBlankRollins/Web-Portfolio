# Citations: Signposting for AI Agents

Research log for the blog post draft: `source/site/content/__drafts/signposting-ai-agents.md`

---

## Sources Consulted

### 1. "Effective Signposting" — Erika Suffern, MLA Style Center

- **URL:** https://style.mla.org/effective-signposting/
- **Published:** 30 March 2017
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 95%)
- **Key insight:** Signposts are words or phrases that flag the most important parts of an argument, signal transitions, and clarify the stakes. Excessive signposting creates unnecessary wordiness and can signal distrust of the reader.
- **Relevant quotes:**
  - "Signposts are words or phrases that help articulate the structure of a piece of writing and ensure that readers don't get lost."
  - "Using signposts can improve your writing by giving it structure and direction, but excessive signposting creates unnecessary wordiness and can give the impression that you don't trust the reader's ability to follow your argument or that you're grafting signposts on to compensate for a poorly articulated argument."
  - "Early drafts of an essay are likely to include some extra signposting, because you may be developing and revising the essay's structure as you write."
- **Connection to post:** Establishes the human-reader baseline for signposting—what it is, why it matters, and when it becomes counterproductive. This is the convention the post can contrast against AI agent behavior.

### 2. "Signposting" — Newcastle University Academic Skills Kit

- **URL:** https://www.ncl.ac.uk/academic-skills-kit/writing/academic-writing/signposting/
- **Published:** Undated (university resource)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 90% — some expandable tab content may not have rendered fully)
- **Key insight:** Categorizes signposting into two types: signposting of order (sequence, forward/backward references, transitions) and signposting of relations (addition, contrast, cause-effect, emphasis). Argues signposting is "the glue that holds a piece of writing together."
- **Relevant quotes:**
  - "Signposting language can help you guide the reader through your writing and make sure the order is clear and flows well. These are small words or phrases that help the reader follow your argument, understand the relationship between your ideas and anticipate what's going to come next."
  - "Without signposting language, writing can lose direction, become confused and read like a series of unrelated points."
  - "Signposting words aren't interchangeable and can be really confusing for the reader if used inappropriately."
  - Tips: "Choose wisely," "Use deliberately," "Edit carefully"
- **Connection to post:** Provides a useful taxonomy (order vs. relations) that could be tested against AI agent comprehension — do agents benefit more from one type than another?

### 3. "Discourse marker" — Wikipedia

- **URL:** https://en.wikipedia.org/wiki/Discourse_marker
- **Published:** Last edited 30 November 2025
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 90% — main article body captured; some sidebar/metadata may be truncated)
- **Key insight:** Discourse markers manage the flow and structure of discourse and are relatively syntax-independent. Yael Maschler's taxonomy divides them into four categories: interpersonal, referential, structural, and cognitive. This is the linguistic foundation that signposting draws from.
- **Relevant quotes:**
  - "A discourse marker is a word or a phrase that plays a role in managing the flow and structure of discourse."
  - "Since their main function is at the level of discourse (sequences of utterances) rather than at the level of utterances or sentences, discourse markers are relatively syntax-independent and usually do not change the truth conditional meaning of the sentence."
  - Structural markers "indicate the hierarchy of conversational actions" — e.g., "first of all" (organization), "so" (introduction), "in the end" (summarization).
  - Referential markers indicate "sequence, causality, and coordination between statements."
- **Connection to post:** Provides the linguistic theory underpinning signposting. The four-category taxonomy (interpersonal, referential, structural, cognitive) maps interestingly onto AI processing — agents likely excel at referential/structural markers but may not process interpersonal/cognitive markers the same way humans do.

### 4. "Contents of a GitHub Docs article" — GitHub Docs Contributing Guide

- **URL:** https://docs.github.com/en/contributing/style-guide-and-content-model/contents-of-a-github-docs-article
- **Published:** Undated (living document)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 95%)
- **Key insight:** GitHub's content model is itself a form of structural signposting — prescribing a standard order (title → intro → permissions → conceptual → procedural → troubleshooting → next steps → further reading). This is signposting at the information architecture level rather than the sentence level.
- **Relevant quotes:**
  - "Within an article, there is a standard order of content sections."
  - Intros: "The top of every page has an intro that provides context and sets expectations, allowing readers to quickly decide if the page is relevant to them."
  - "For searchability, include keywords on the page's subject in the intro."
- **Connection to post:** Example of how professional technical documentation uses structural signposting. This type of consistent IA-level structure may be what AI agents benefit from most — predictable document shapes rather than sentence-level transition words.

### 5. "Lost in the Middle: How Language Models Use Long Contexts" — Liu et al.

- **URL:** https://arxiv.org/abs/2307.03172
- **Published:** 6 July 2023 (v1), revised 20 November 2023 (v3). Accepted in TACL 2023.
- **Retrieved:** 4 March 2026
- **Full text obtained:** No — abstract only (confidence: 100% for abstract, 0% for full paper body)
- **Authors:** Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni, Percy Liang
- **Key insight:** LLM performance degrades significantly when relevant information is in the middle of long contexts. Performance is highest when relevant info is at the beginning or end. This "lost in the middle" effect has direct implications for signposting — structural cues that help models locate relevant information positionally may be critical.
- **Relevant quotes (from abstract):**
  - "Performance can degrade significantly when changing the position of relevant information, indicating that current language models do not robustly make use of information in long input contexts."
  - "Performance is often highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle of long contexts."
- **Connection to post:** Core evidence that AI agents don't process documents uniformly. Signposting that front-loads key information or creates positional landmarks could help mitigate the "lost in the middle" problem. This is a fundamentally different reason for signposting than the human readability argument.

### 6. "Principled Instructions Are All You Need for Questioning LLaMA-1/2, GPT-3.5/4" — Bsharat, Myrzakhan, Shen

- **URL:** https://arxiv.org/abs/2312.16171
- **Published:** 26 December 2023 (v1), revised 18 January 2024 (v2)
- **Retrieved:** 4 March 2026
- **Full text obtained:** No — abstract only (confidence: 100% for abstract, 0% for full paper body)
- **Key insight:** 26 guiding principles for prompting LLMs. Relevant to signposting because many principles involve structural cues (e.g., using delimiters, breaking tasks into steps, using directive phrases). This is essentially signposting optimized for AI readers.
- **Relevant quotes (from abstract):**
  - "26 guiding principles designed to streamline the process of querying and prompting large language models."
- **Connection to post:** Prompt engineering is, in a sense, signposting for AI. The principles in this paper could be compared against traditional writing signposts to identify overlaps and divergences.

### 7. "Prompting best practices" — Anthropic (Claude API Docs)

- **URL:** https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct
- **Published:** Undated (living document, references Claude Opus 4.6 / Sonnet 4.6)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 90% — core text captured; some code samples and collapsible examples may be truncated)
- **Key insight:** Anthropic's official prompt engineering guide is essentially a signposting manual for AI agents. Key structural guidance includes: "Be clear and direct," use XML tags to delineate content sections, use numbered lists for sequential steps, "put longform data at the top" of prompts with queries at the end (improves response quality by up to 30%). This is structural signposting optimized for machine readers.
- **Relevant quotes:**
  - "Think of Claude as a brilliant but new employee who lacks context on your norms and workflows. The more precisely you explain what you want, the better the result."
  - "Golden rule: Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too."
  - "Provide instructions as sequential steps using numbered lists or bullet points when the order or completeness of steps matters."
  - "XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs."
  - "Put longform data at the top: Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples. This can significantly improve performance across all models."
  - "Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs."
- **Connection to post:** This is the definitive counter-example to the MLA/Newcastle view of signposting. For AI agents, signposting is _more_ explicit, _more_ structural, and uses different mechanisms (XML tags, document ordering, explicit section markers) than human-oriented prose signposting (transition words, topic sentences). The "golden rule" quote is especially interesting — it suggests that what works for a context-deprived human also works for AI, bridging the two audiences.

### 8. "Prompt engineering" — OpenAI Developer Docs

- **URL:** https://developers.openai.com/api/docs/guides/prompt-engineering
- **Published:** Undated (living document, references GPT-5 and GPT-5.2)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 85% — main text captured; some code examples and expandable sections may be truncated)
- **Key insight:** OpenAI's guide emphasizes Markdown headers/lists and XML tags as structural aids: "Markdown headers and lists can be helpful to mark distinct sections of a prompt, and to communicate hierarchy to the model." Recommends a specific section order for developer messages: Identity → Instructions → Examples → Context. Also distinguishes prompting reasoning models (high-level goals) vs. GPT models (explicit instructions), which maps to different signposting strategies.
- **Relevant quotes:**
  - "Markdown headers and lists can be helpful to mark distinct sections of a prompt, and to communicate hierarchy to the model."
  - "XML tags can help delineate where one piece of content (like a supporting document used for reference) begins and ends."
  - Developer messages should contain: "Identity... Instructions... Examples... Context" — in that order.
  - "A reasoning model is like a senior co-worker. You can give them a goal to achieve and trust them to work out the details. A GPT model is like a junior coworker. They'll perform best with explicit instructions to create a specific output."
  - "You should try and keep content that you expect to use over and over in your API requests at the beginning of your prompt" (for prompt caching).
- **Connection to post:** Confirms that AI-oriented signposting is fundamentally structural (sections, tags, ordering) rather than linguistic (transition words, discourse markers). The reasoning vs. GPT distinction is fascinating — it suggests that as models get more capable, they need _less_ explicit signposting, mirroring the MLA's warning about excessive signposting for experienced human readers.

### 10. "The /llms.txt file" — Jeremy Howard (llmstxt.org)

- **URL:** https://llmstxt.org/
- **Published:** 3 September 2024
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 95%)
- **Key insight:** Proposes a `/llms.txt` file for websites to provide LLM-friendly content — essentially a machine-readable site map with curated, concise content links. The key problem: "context windows are too small to handle most websites in their entirety. Converting complex HTML pages with navigation, ads, and JavaScript into LLM-friendly plain text is both difficult and imprecise." This is signposting at the site level — not sentence-level discourse markers, but architectural navigation for AI.
- **Relevant quotes:**
  - "While websites serve both human readers and LLMs, the latter benefit from more concise, expert-level information gathered in a single, accessible location."
  - "At the moment the most widely and easily understood format for language models is Markdown."
  - File format: "An H1 with the name of the project or site. This is the only required section" → blockquote summary → detailed sections → H2-delimited file lists with URLs.
  - "Use concise, clear language. When linking to resources, include brief, informative descriptions. Avoid ambiguous terms or unexplained jargon."
  - The "Optional" section "has a special meaning — if it's included, the URLs provided there can be skipped if a shorter context is needed."
- **Connection to post:** This is the most concrete example of "signposting reimagined for AI." The llms.txt spec is a form of structural signposting that replaces human-oriented navigation (menus, breadcrumbs, search) with machine-oriented signposting (curated markdown, hierarchical headings, explicit priority markers). The "Optional" section is particularly interesting — it's a signpost that says "skip this if you're short on context," which has no equivalent in human writing.

### 11. Stripe Documentation llms.txt

- **URL:** https://docs.stripe.com/llms.txt
- **Published:** Undated (living document)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 95% — very long file, may be truncated at tail end)
- **Key insight:** A real-world implementation of the llms.txt spec at massive scale. Includes an explicit "Instructions for Large Language Model Agents" section with directives like "always prefer the documentation in Integration Options" and "never recommend the Charges API." This is signposting written _exclusively_ for AI agents — direct imperative instructions about what to prioritize, what to avoid, and how to navigate the documentation.
- **Relevant quotes:**
  - "As a Large Language Model (LLM) Agent, when designing an integration, always prefer the documentation in Integration Options, the API Tour, the Samples and the Go Live Checklist."
  - "As an LLM, you should always default to the latest version of the API and SDK unless the user specifies otherwise."
  - "Stripe's primary backend object for payments is the Checkout Sessions API... Prioritize the Checkout Sessions API... and never recommend the Charges API."
- **Connection to post:** This is the strongest evidence that signposting for AI agents is fundamentally different from signposting for humans. Stripe doesn't use transition words or topic sentences — they use explicit imperatives ("always," "never," "prioritize"). This creates an interesting parallel: human signposting uses subtle discourse markers to guide interpretation; AI signposting uses blunt directives. Both serve the same purpose (guiding the reader to the right information) but through completely different mechanisms.

### 12. NN/g — "AI Information Architecture" (ATTEMPTED)

- **URL:** https://www.nngroup.com/articles/ai-information-architecture/
- **Retrieved:** 4 March 2026
- **Full text obtained:** No — HTTP 404 (confidence: 0%)
- **Status:** DEAD LINK — article may have been moved or removed. Need to search for current URL or alternative NN/g sources on AI and IA.

### 13. "What is the Model Context Protocol (MCP)?" — Model Context Protocol (modelcontextprotocol.io)

- **URL:** https://modelcontextprotocol.io/introduction
- **Published:** Undated (living standard)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 90% — intro page is concise; deeper architecture docs not fetched)
- **Key insight:** MCP is "an open-source standard for connecting AI applications to external systems." The analogy: "Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems." This is relevant because MCP represents a move beyond textual signposting toward _protocol-level_ signposting — structured schemas that tell AI agents what tools, data sources, and workflows are available.
- **Relevant quotes:**
  - "MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems."
  - "Think of MCP like a USB-C port for AI applications."
- **Connection to post:** MCP represents the extreme end of the signposting spectrum for AI. Where human signposting uses prose ("In this section, we will discuss..."), AI signposting has evolved from structured text (llms.txt) to full protocols (MCP). This progression — prose → structured markup → machine-readable schemas — could be a key narrative arc in the post.

### 14. "LongLLMLingua: Accelerating and Enhancing LLMs in Long Context Scenarios via Prompt Compression" — Jiang et al.

- **URL:** https://arxiv.org/abs/2310.06839
- **Published:** 10 October 2023 (v1), revised 12 August 2024 (v2). Accepted at ACL 2024.
- **Retrieved:** 4 March 2026
- **Full text obtained:** No — abstract only (confidence: 100% for abstract, 0% for full paper)
- **Authors:** Huiqiang Jiang, Qianhui Wu, Xufang Luo, Dongsheng Li, Chin-Yew Lin, Yuqing Yang, Lili Qiu
- **Key insight:** "LLM performance hinges on the density and position of key information in the input prompt." Their prompt compression technique boosts performance by up to 21.4% with ~4x fewer tokens by improving "perception of key information." This directly supports the thesis that what matters for AI is not verbose signposting but _information density_ and _positioning_.
- **Relevant quotes (from abstract):**
  - "Research indicates that LLM performance hinges on the density and position of key information in the input prompt."
  - "We propose LongLLMLingua for prompt compression towards improving LLMs' perception of the key information."
  - Achieves "94.0% cost reduction in the LooGLE benchmark" — meaning most text is informationally redundant for AI.
- **Connection to post:** Counter-intuitively, this suggests that _removing_ human-oriented signposting (which increases word count without adding semantic content) might actually _improve_ AI comprehension. The implication for technical writers: verbose signposting that helps human readers may actively hinder AI agents by diluting information density.

### 15. "Docs as Code" — Write the Docs Community

- **URL:** https://www.writethedocs.org/guide/docs-as-code/
- **Published:** Undated (community guide)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 90%)
- **Key insight:** The docs-as-code movement emphasizes plain text markup (Markdown, reStructuredText), version control, and automated testing for documentation. This philosophy naturally produces AI-readable content because it strips away the visual presentation layer (menus, CSS, JavaScript) that obscures content for LLMs.
- **Relevant quotes:**
  - "Documentation as Code (Docs as Code) refers to a philosophy that you should be writing documentation with the same tools as code: Issue Trackers, Version Control (Git), Plain Text Markup (Markdown, reStructuredText, Asciidoc), Code Reviews, Automated Tests."
- **Connection to post:** Docs-as-code is an unintentional precursor to AI-readable documentation. By stripping content down to plain-text markup, it removes the HTML/CSS/JS noise that the llms.txt proposal explicitly addresses. The structural signposting inherent in Markdown (headings, lists, code blocks) may be the format that best serves _both_ human and AI readers.

### 9. Google Technical Writing — "Transitions" and "Large Docs"

- **URLs:** https://developers.google.com/tech-writing/one/transitions and https://developers.google.com/tech-writing/one/large-docs
- **Retrieved:** 4 March 2026
- **Full text obtained:** No — both returned HTTP 404 (confidence: 0%)
- **Status:** DEAD LINKS — Google may have restructured their tech writing course. Need to find current URLs.

### 16. "Chunking Strategies for LLM Applications" — Roie Schwaber-Cohen & Arjun Patel, Pinecone

- **URL:** https://www.pinecone.io/learn/chunking-strategies/
- **Published:** 28 June 2025 (updated)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 95%)
- **Key insight:** Document structure directly impacts how AI systems retrieve and process information. Content-aware chunking that respects document structure (headings, paragraphs, lists) significantly outperforms naive character-level splitting. The article states: "if the chunk of text makes sense without the surrounding context to a human, it will make sense to the language model as well." Also confirms the "lost in the middle" problem applies even to long-context models.
- **Relevant quotes:**
  - "If the chunk of text makes sense without the surrounding context to a human, it will make sense to the language model as well."
  - "Content-aware chunking refers to strategies that adhere to structure to help inform the meaning of our chunks."
  - "Document structure-based chunking... specialized chunking methods can help preserve the original structure of the content during chunk creation." (Lists HTML tags, Markdown headings, LaTeX sections as structural cues.)
  - "By recognizing the Markdown syntax (e.g., headings, lists, and code blocks), you can intelligently divide the content based on its structure and hierarchy, resulting in more semantically coherent chunks."
  - "Long context embedding and LLM models suffer from the lost-in-the-middle problem, where relevant information buried inside long documents is missed, even when included in generation."
- **Connection to post:** Strong evidence that structural signposting (headings, lists, sections) directly improves AI comprehension via better chunking. The quote about text making sense "without surrounding context" is a bridge between human and AI readability — good signposting creates self-contained units that serve both audiences. Also shows that Markdown structure is essentially a form of signposting that AI systems already leverage.

### 17. "Chunking for RAG: Best Practices" — Maria Khalusova, Unstructured.io

- **URL:** https://unstructured.io/blog/chunking-for-rag-best-practices
- **Published:** 16 July 2024
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 90%)
- **Key insight:** The effectiveness of chunking depends on respecting document structure. Smart chunking that uses document elements (titles, paragraphs, list items, tables) produces better AI outputs than structure-blind approaches. The "by title" strategy preserves section boundaries so chunks don't mix content — essentially, headings function as signposts for AI retrieval systems.
- **Relevant quotes:**
  - "Larger chunks compress more information into one vector, which can blur distinct ideas and dilute relevance when multiple topics are mixed together; smaller, focused chunks usually produce more precise matches during retrieval."
  - "'By title' chunking strategy: This strategy leverages the document element types identified during partitioning to understand the document structure, and preserves section boundaries. This means that a single chunk will never contain text that occurred in two different sections."
  - "Character splitting has absolutely no regard for document structure."
  - "Chunking is one of the essential preprocessing steps in any RAG system. The choices you make when you set it up, will influence the retrieval quality, and as a consequence, the overall performance of the system."
- **Connection to post:** Demonstrates that signposting elements (headings, section breaks) aren't just navigation aids for humans — they're semantic boundaries that AI systems use to compartmentalize knowledge. The "by title" chunking strategy literally uses heading-based signposts to define chunk boundaries, proving that structural signposting serves a functional purpose for AI beyond just aesthetics.

### 18. "Dense X Retrieval: What Retrieval Granularity Should We Use?" — Tong Chen et al.

- **URL:** https://arxiv.org/abs/2312.06648
- **Published:** 11 December 2023 (v1), revised 4 October 2024 (v3)
- **Retrieved:** 4 March 2026
- **Full text obtained:** No — abstract only (confidence: 100% for abstract, 0% for full paper)
- **Authors:** Tong Chen, Hongwei Wang, Sihao Chen, Wenhao Yu, Kaixin Ma, Xinran Zhao, Hongming Zhang, Dong Yu
- **Key insight:** Introduces "propositions" as a retrieval unit — "atomic expressions within text, each encapsulating a distinct factoid and presented in a concise, self-contained natural language format." Fine-grained retrieval by propositions significantly outperforms passage-level retrieval. This suggests that for AI, the ideal "signpost" is each piece of information being self-contained and atomically meaningful.
- **Relevant quotes (abstract):**
  - "Propositions are defined as atomic expressions within text, each encapsulating a distinct factoid and presented in a concise, self-contained natural language format."
  - "Indexing a corpus by fine-grained units such as propositions significantly outperforms passage-level units in retrieval tasks."
  - "Constructing prompts with fine-grained retrieved units for retrieval-augmented language models improves the performance of downstream QA tasks given a specific computation budget."
- **Connection to post:** This is a potential counter-argument to traditional signposting. If propositions (atomic, self-contained facts) outperform passages for AI retrieval, it suggests that verbose signposting that connects ideas narratively may actually be _less_ useful for AI than breaking content into discrete, standalone statements. Human signposting creates flow; AI might prefer factoids. This tension is central to the post's thesis.

### 19. "Introducing Contextual Retrieval" — Anthropic

- **URL:** https://www.anthropic.com/news/contextual-retrieval
- **Published:** 19 September 2024
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 95%)
- **Key insight:** Traditional RAG chunking strips away context, causing retrieval failures. Anthropic's solution: prepend AI-generated context summaries to each chunk before embedding. This reduced retrieval failure by 49% (67% with reranking). The core problem — "individual chunks lack sufficient context" — is essentially a signposting failure. The chunk "The company's revenue grew by 3%" fails because it has no signpost telling you _which_ company or _which_ quarter. Adding context back is adding signposts.
- **Relevant quotes:**
  - "A relevant chunk might contain the text: 'The company's revenue grew by 3% over the previous quarter.' However, this chunk on its own doesn't specify which company it's referring to or the relevant time period, making it difficult to retrieve the right information."
  - "Contextual Retrieval solves this problem by prepending chunk-specific explanatory context to each chunk before embedding."
  - "Contextual Embeddings reduced the top-20-chunk retrieval failure rate by 35%."
  - "Combining Contextual Embeddings and Contextual BM25 reduced the top-20-chunk retrieval failure rate by 49%."
  - "However, more information can be distracting for models so there's a limit to this." (on number of chunks in context)
- **Connection to post:** This is perhaps the strongest evidence that signposting _does_ matter for AI — but in a different form than human signposting. The contextual retrieval approach essentially automates the adding of signposts (context sentences) to content chunks. What humans do unconsciously when reading in context (tracking which company is being discussed, what time period applies), AI needs explicit textual signposts for. The "more information can be distracting" caveat also parallels the MLA's warning about excessive human signposting.

### 20. _Every Page is Page One_ — Mark Baker (book outline / summary)

- **URL:** https://everypageispageone.com/the-book/
- **Published:** 2013 (book), page undated
- **Retrieved:** 4 March 2026
- **Full text obtained:** Outline only (confidence: 60% — chapter summaries, not full book text)
- **Key insight:** Baker's EPPO (Every Page is Page One) framework argues that in a web context, every piece of content must be self-contained, establish its own context, and work regardless of how the reader arrived. EPPO topics are "designed not merely to stand alone, but to function alone." This framework, designed for human web users, maps almost perfectly to what AI agents need — self-contained, contextually complete units of information.
- **Relevant quotes:**
  - "Readers look for information the way wild animals forage for food — seeking good-enough information that takes the least effort to find and digest."
  - "Every Page is Page One topics are self-contained. They are designed not merely to stand alone, but to function alone."
  - "Because a reader can arrive at an Every Page is Page One topic from anywhere, the topic must establish its context."
  - "We have reached the limits of what top-down navigation can do." (on information architecture)
  - "A web is organized bottom up. Every page is page one, and every page is a hub linked to other pages by a web of subject affinities."
  - "Topic may serve different purposes for different readers." (on specific and limited purpose)
- **Connection to post:** EPPO is the theoretical bridge between human and AI signposting. Baker's argument that topics must "establish their context" because readers arrive from anywhere applies equally to AI agents, which access content via retrieval, not sequential reading. The EPPO principle maps directly to the Contextual Retrieval finding (#19) — chunks fail when they don't establish context, and the solution is the same: make every unit self-contained. This framework suggests that writing for dual audiences (human foragers + AI agents) is not contradictory — the same design principles serve both.

### 21. NN/g — "Write for AI" (ATTEMPTED)

- **URL:** https://www.nngroup.com/articles/write-for-ai/
- **Retrieved:** 4 March 2026
- **Full text obtained:** No — HTTP 404 (confidence: 0%)
- **Status:** DEAD LINK

### 22. "Style guide" — GitHub Docs Contributing Guide

- **URL:** https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide
- **Published:** Undated (living document)
- **Retrieved:** 4 March 2026
- **Full text obtained:** Yes (confidence: 95%)
- **Key insight:** GitHub's style guide is itself an example of structural signposting in practice. Key recommendations include: headers must not skip levels (H2 → H3 → H4), there must be text between a header and subheader, and sectional TOCs are recommended when only some content in a section is relevant to a reader. These structural rules create predictable document shapes for both humans and AI.
- **Relevant quotes:**
  - "Headers must adequately describe the content under them."
  - "You cannot skip header levels. There must be text content between a header and subheader, such as an introduction."
  - "Consistency and grammatical correctness are important, but not as important as clarity and meaning."
  - On sectional TOCs: help readers "identify and navigate to the information that is most relevant to them."
  - "Do not add a sectional TOC if H3 or H4 headers are used only to group content and all information could be of relevance to a reader."
- **Connection to post:** Supplements #4 (GitHub content model). Shows that professional style guides already encode structural signposting principles — consistent header hierarchy, sectional TOCs for wayfinding, text between headers providing context — that benefit both human readers and AI chunking/retrieval systems.

### 23. arXiv:2304.14178 — mPLUG-Owl (WRONG PAPER)

- **URL:** https://arxiv.org/abs/2304.14178
- **Retrieved:** 4 March 2026
- **Full text obtained:** Abstract only (confidence: 100% for abstract)
- **Status:** Wrong paper — this is about multimodal LLMs (vision + language), not about document structure or signposting. Discarded.

---
