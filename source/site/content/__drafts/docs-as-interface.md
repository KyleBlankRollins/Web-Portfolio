---
title: "Docs Are a Product Interface"
description: ""
keywords: "technical writing"
date: "2026-03-23"
tags: [technical writing]
---

## Premise

Technical Writers need a rallying cry. They need something that will help tech industry leaders understand that they already have people who are perfectly positioned to transition their companies into an AI agent world.

Establishing documentation as a product interface can do just that. And it's not something that can be automated. The information needs to be maintained. Writing skill files and agent files also needs the skills of trained technical writers.

## Question

I work in technical documentation in the software industry as a lead technical writer and engineer.

I'm trying to work out my thoughts on the importance of technical documentation in an AI world where agentic workflows are part of how software is built.

Documentation has always been a somewhat underrated product interface with a human audience. Technical writers have served robot audiences for SEO purposes, but only to give human audiences a better experience.

Now, AI agents are a primary audience. And technical documentation has become a more important product interface than ever.

A separate but related thought is that technical documentation has become a programming language. Natural language is the input for AI agents. This makes well-crafted documentation extremely valuable.

The imprecise nature of natural language is exactly what technical writers focus on. So, they're able to craft the best product interface for AI agents.

Are these ideas sound? Is there research to back these ideas up?

## Response

These are compelling ideas, Kyle, and they hang together well logically. Let me search for research and industry discussion that speaks to these claims.Your ideas are sound, and what's striking is how quickly the industry discourse has caught up to exactly these claims. Let me walk through each one.

**Documentation as a primary AI interface — yes, and the evidence is mounting.**

InfoWorld reports that GenAI coding assistants and AI agents now consume documentation to improve their relevance and accuracy, making this a new audience that devops teams need to explicitly consider. Andrew Filev of Zencoder is quoted making a strong version of this claim: when every code change is documented, AI agents can understand not just what the code does but why it was written that way, transforming AI from a coding assistant into a knowledgeable team member. He goes further, asserting that LLMs work three times better with detailed documentation because they can understand context, constraints, and intentions.

OpenAI's own Codex launch page states plainly that, like human developers, Codex agents perform best when provided with configured dev environments, reliable testing setups, and clear documentation. That's the maker of one of the most prominent coding agents explicitly naming documentation quality as a performance factor.

And the 2026 trends reporting from Document360 frames this shift well: by 2025, the companies that succeeded were the ones treating documentation as an adaptive system — metadata-rich, consistently updated, and chunkable for LLMs.

**Documentation as a programming language — this idea has real traction.**

This is perhaps your most provocative claim, and it's being articulated independently by several people. An ODSC piece argues that natural language serves as the fundamental communication medium throughout AI agent architecture, functioning as the primary interface between all components of the system, and that since LLMs inherently process and generate natural language, it becomes the native "programming language" for AI agents.

Waleed Kadous (formerly at Canva, Uber, Google) wrote a piece titled "Natural Language is Now Code" making essentially your exact argument: with AI agents writing our code, natural language has become the new high-level programming language, but we're still treating documentation like an afterthought. He describes how documents describing context and goals now drive the creation of code, much like C++ once drove assembly generation. He even created an INSTALL.md file written for AI agents to interpret rather than humans — natural language has become executable, and we need to bring the same rigor to documentation that we once reserved for code.

The academic world is exploring this too. Researchers behind the AIOS Compiler / CoRE framework proposed a system that takes LLMs as interpreters to process and execute instructions in natural language, enabling agent programming in natural language, arguing this follows the historical trend of programming languages toward increased usability and democracy.

**Technical writers as the right people for this — the strongest part of your argument.**

This is where I think your framing adds something the existing discourse mostly misses. Most of the industry conversation focuses on AI _generating_ documentation or on developers writing context files (CLAUDE.md, AGENTS.md, .cursorrules). But research from Packmind found that the hard part isn't writing these agent context files — it's keeping them accurate, because vagueness, missing feedback loops, contradictions, and drift quietly degrade agent performance. Those are precisely the problems technical writers are trained to solve: consistency, precision, maintenance, audience awareness.

Biel.ai's guide on optimizing docs for AI agents reinforces this, noting that AI performs better with focused, essential content than comprehensive but diluted documentation, and that too much content creates noise that confuses LLM-based retrieval systems. The discipline of knowing what to include and exclude, writing for a specific audience's comprehension model, managing ambiguity — that's the technical writing skill set.

A JetBrains survey of 481 developers across 71 countries found that "lack of context understanding" was among the top barriers to AI adoption, which directly relates to documentation quality.

**Where you could sharpen the argument:**

A few threads worth pulling on as you develop this further. First, the llms.txt movement — even though zero major LLM providers have officially committed to using the standard, the mere existence of this initiative (and the fact that Anthropic specifically requested llms.txt and llms-full.txt for their documentation) validates that the industry recognizes documentation needs to be structured for machine consumption.

Second, Model Context Protocol (MCP) is relevant to your argument. Through MCP, tools and their functionalities are made available to agents and described in natural language, enabling the LLM to understand what actions it can take. This is literally natural language as an interface definition — and writing good tool descriptions is a documentation problem.

Third, the METR study on AI developer productivity found something interesting: AI capabilities may be comparatively lower in settings with very high quality standards, or with many implicit requirements relating to documentation, testing coverage, or linting/formatting. This suggests that the gap between what agents can do and what organizations need is partly a documentation gap — implicit knowledge that hasn't been made explicit.

Your core thesis holds up well: documentation has shifted from describing software for humans to _instructing_ software via natural language, and the people best equipped to craft that instruction layer are technical writers who've spent their careers managing the imprecision of natural language. The research and industry commentary are converging on this view, even if no single paper has stated it as cleanly as you have.

## References

- The Importance of Natural Language in Building AI Agents: https://odsc.medium.com/the-importance-of-natural-language-in-building-ai-agents-0c118cf2bccb
- Natural Language is Now Code: https://waleedk.medium.com/natural-language-is-now-code-35e9b3379d42
- AIOS Compiler: LLM as Interpreter for Natural Language Programming and Flow Programming of AI Agents: https://arxiv.org/html/2405.06907v2
- Writing AI coding agent context files is easy. Keeping them accurate isn’t.: https://packmind.com/evaluate-context-ai-coding-agent/
- Practical tips to optimize technical documentation for LLMs, AI agents, and chatbots: https://biel.ai/blog/optimizing-docs-for-ai-agents-complete-guide
- Why Your AI Agents Need Contextual Documentation: https://hyperdev.matsuoka.com/p/why-your-ai-agents-need-contextual
- Is llms.txt Dead? The Current State of Adoption in 2025: https://llms-txt.io/blog/is-llms-txt-dead
- The Complete Guide to llms.txt: Should You Care About This AI Standard?: https://getpublii.com/blog/llms-txt-complete-guide.html
- The Importance of Natural Language in Building AI Agents: https://opendatascience.com/the-importance-of-natural-language-in-building-ai-agents/
- AI Documentation Trends Every Team Must Prepare for in 2026: https://document360.com/blog/ai-documentation-trends/
- Introducing Codex: https://openai.com/index/introducing-codex/
- How to improve technical documentation with generative AI: https://www.infoworld.com/article/4063551/how-to-improve-technical-documentation-with-generative-ai.html
