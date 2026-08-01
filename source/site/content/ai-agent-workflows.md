---
title: "AI Agent Workflows"
description: "AI agents are most useful when humans define the problem, guide the work, and review the result. These are the workflows that have worked for me."
keywords: "AI agents, coding agents, AI-assisted workflows, software development, technical writing, AI-assisted development"
date: "2026-07-31"
tags: [AI, coding agents, workflows]
citations:
  - id: refactor-plan
    title: "Refactor Plan: Processors Modularization"
    author: "Kyle Rollins"
    url: "https://github.com/KyleBlankRollins/Web-Portfolio/blob/prod/documentation/meta/refactor-processors.md"
  - id: anti-patterns
    title: "Agentic Engineering Patterns: Anti-Patterns"
    author: "Simon Willison"
    url: "https://simonwillison.net/guides/agentic-engineering-patterns/anti-patterns/"
  - id: admin-system
    title: "Web-Portfolio Admin System"
    author: "Kyle Rollins"
    url: "https://github.com/KyleBlankRollins/Web-Portfolio/tree/prod/source/admin"
---

<kbr-admonition type="note">
tl;dr: Humans define and review the work. Agents implement it. AI is most useful when a person draws the boundaries around a problem, an agent does the bounded work inside them, and a person reviews the result.
</kbr-admonition>

For the last year or so, I have used AI tools and agents to help with work and personal projects. Most of the time, they augment work that I have already scoped and planned. They help me move faster, but they don't decide what I should be working on.

Here are some of the workflows that have worked for me. Maybe they will help someone else streamline their work or get over a difficult learning curve.

## Drawing boxes

I've long thought that drawing literal boxes around problems is a good way to break ambiguous work into chunks. The premise is simple: draw a box for everything you know now. Group the boxes, draw a larger box around the groups, and label the new boxes. Then draw a box around everything to define the problem space.

While drawing the boxes, my brain makes connections I otherwise wouldn't have considered. I often move or delete boxes as my thinking gets more focused. The benefit is reducing ambiguity by defining borders around ideas. It is as much methodical as intuitive.

Humans should draw the boxes for AI agents. Some people are methodical, some are intuitive, and some (like me) mix the two.

In my experience with AI agents, I get significantly better results when I have well-drawn boxes that constrain the problem space.

## Discovery and implementation are different jobs

A common mistake is giving an agent too many jobs. For example: "Figure out what changed in this product release and then write the release notes using this template." That might work for a small release, but it is likely to produce worse results for a substantial release. There are two jobs here: discovery and implementation. Conflating them creates ambiguity instead of reducing it.

### Discovery

Discovery requires deciding what matters, resolving ambiguity, finding missing context, and choosing among plausible directions.

In this case, "figure out what changed in this product release" could be complicated. You could tell the agent to use project documents, such as requirements, scope, and specifications. A better approach might be to have it inspect the engineering repositories and understand what shipped. But then it would also need to understand the product's release process.

You can provide agents with skills or other context to help with discovery. But humans still need to define the problem and draw the boxes that constrain the agent's scope. Agents can accelerate discovery by searching, summarizing, comparing, and asking questions. They should not define the problem.

At the end of discovery, you should have a set of well-drawn boxes that can be documented in many ways. I usually use Markdown files. These artifacts are the input for implementation.

### Implementation

After discovery, hand the artifacts to a _different_ AI agent for implementation. Agents are good at doing work when the requirements are well defined. User stories are a good example. Discovery artifacts should be explicit about constraints, interfaces, and acceptance criteria.

For discovery, humans research, define scope, evaluate the plan, and validate what agents find. For implementation, agents inspect a bounded task, make changes, run checks, and report what happened. Humans review the result.

## Discovery with an agent, under human direction

Having separated the two jobs, here is how I do discovery. I use agents as research assistants rather than project owners. I'll give an agent a question, a bounded research target, and permission to surface uncertainty. I'll ask it to search a repository, compare approaches, summarize documents, or identify questions that I haven't thought to ask.

The agent's research is evidence for a human decision, not a decision itself. An agent can find plausible context quickly. That does not mean all of it belongs in the project, or that the agent understands which tradeoffs matter to me.

I also try to use deterministic sources and tools wherever possible. Repository search, Git history, issue trackers, static analysis, type information, and structured interfaces are all useful because they give the agent something concrete to inspect. The more the agent has to infer from vague prose or an incomplete memory of how a system works, the more room there is for it to confidently wander off course.

When accuracy matters, I prefer to bring important source material into the repository. Web pages are sometimes an unreliable way to provide context to an agent. Depending on the tool, a page may be summarized, truncated, or passed through another model before it reaches the agent doing the work. That can be OK for a quick question. It is a poor foundation for a detailed implementation when a small omitted detail can change the outcome.

Discovery is still discovery even when an agent helps with it. An agent can gather more information, but someone still needs to decide what matters and where the boundaries belong.

### Turn research into a source of truth

Once I understand the problem well enough, I turn the useful parts of the research into a project plan or specification. This is where the boxes become more concrete. I write down what needs to change, what should not change, which existing interfaces matter, and how I will know whether the work is complete.

For larger projects, I break that plan into discrete Markdown files or phases. I use a larger model for research and planning, then a smaller or faster model to implement individual phases. The implementation agent does not need to understand every direction the project could have taken. It needs to understand the intended outcome.

The repository for my website has an example in a refactor I did. I built a static site generator for the website. The plan[^refactor-plan] analyzed the two large processors and mapped their responsibilities to focused modules. It described the proposed interfaces, the logic to move, and the reasons for the change. Later commits completed phases 2, 3, and 4, and the builder documentation was updated as the architecture settled.

I can't prove from Git history which parts of that work were produced by an agent. That is not the point. The broad refactor became more manageable after I described the desired architecture and divided the work into independently reviewable phases.

Markdown in a Git repository works well because it is versioned, searchable, and reviewable. It can be available to later agents, too. A plan becomes part of the project rather than a temporary instruction that disappears after an agent session. It is not a contract, though. Update it when discovery changes the problem or the intended solution.

## Agents implement bounded work

Once the work is defined, coding agents are good at implementation. The agent inspects a bounded task, makes the changes, runs checks, and reports what happened. I review the result before the next phase.

Discrete phases reduce the context an agent has to hold, limit the blast radius of a mistake, and create review points. A phase does not need to be tiny, but it should have a coherent purpose. “Refactor the builder” is a poor implementation task. “Move citation parsing and validation into a focused module, preserve the existing public behavior, and run the builder checks” is easier to reason about.

I prefer implementation requests that name the relevant files, expected behavior, constraints, and validation commands. The agent can still make decisions within those boundaries, but they should concern implementation rather than redefining the work. If an agent can access private data, credentials, or production systems, the boundaries should also define what it may read and modify.

The citations feature in this repository is another example. The plan covered interfaces, frontmatter parsing, inline reference processing, generated HTML, templates, styles, and build-time validation. It mapped a feature that crossed several parts of the builder. The implementation could then proceed as concrete changes instead of one request to “add citations somehow.”

There is a temptation to use the most capable model for every part of this process. I don't think that is necessary. Stronger models are most valuable when the problem is ambiguous, the research is difficult, or the plan needs judgment. Once the interfaces and acceptance criteria are clear, a smaller model can often implement the work just as well, especially with deterministic checks.

### Deterministic tools are the scaffolding

Agents become more reliable when important parts of the work can be checked mechanically. Tests, linters, static analysis, types, structured interfaces, and opinionated compilers expose facts and failures an agent should not have to infer from prose.

For programming, an opinionated compiler can catch an entire class of mistakes before I review anything. Tests verify that a change does what was intended. Linters and static analysis identify problems that are easy to miss in a large diff. Large diffs are an anti-pattern, but they still happen[^anti-patterns]. For prose, Vale provides similar friction. It does not decide whether prose is good, but it can catch patterns that are inconsistent, unclear, or contrary to your style.

These tools turn part of the review into a repeatable workflow. An agent can run the checks, read the results, and fix straightforward problems without instructions from me.

Passing checks does not make a change correct or useful. It narrows the space of possible mistakes. A test suite can pass while the wrong feature is being built. A compiler can be satisfied while the interface is confusing. Vale can approve a technically correct sentence that is unhelpful. Deterministic tools are scaffolding, not judgment.

### Human review required

My most important review step is reading the updated files. Sometimes that means looking at a Git diff. Sometimes it means opening the whole file and reading the surrounding code or prose. Understanding what changed matters more than the form.

I also run tests and linters, check browser behavior for user interfaces, and ask another model to review the work. A reviewer from a different model family may be less likely to repeat the first agent's assumptions. I treat that review as another opinion, not an oracle.

I treat review as a gate between phases. If a phase is wrong, it is easier to correct it before the next phase builds on it.

## The cost of too much context

AI tools make it easy to keep adding context: an MCP server, a skill, an agent instruction file, a project prompt, a system prompt, and another document explaining how the others should be used. Some context is useful. Too much creates bureaucracy around a task that needed one clear paragraph.

My preference is lean customization. I add context when it creates repeatability or closes a demonstrated gap. A skill that describes a recurring workflow is valuable. An instruction file that captures stable repository conventions saves time. A deterministic tool that gives an agent reliable project data is more useful than another page of general advice.

During discovery and prototyping, I do little to manage context because the problem is still changing. Instructions that seem helpful at first can become a second system to design, maintain, and debug.

The history of this repository's admin system[^admin-system] illustrates the cost of broad scope. The initial implementation added a server and a basic user interface across many files. A later architecture and validation pass added structure and source-file validation. Subsequent commits fixed lifecycle behavior, formatting, and component organization.

I don't read that history as evidence that the implementation failed. It is a normal record of software taking shape. But it shows how much surface area a broad first pass creates. When decisions are bundled together, later work has to sort out the original problem and the assumptions in the first solution. Smaller, better-defined phases make those assumptions easier to see.

## Humans steer, agents execute

As a default, humans should define the problem and direction, agents should implement bounded work, and humans should review the result.

That does not mean humans should avoid agents during discovery. Research, comparison, summarization, and question generation are useful. An agent can support those activities, but a person still needs to decide what the work is, what constraints matter, and when it is complete. You should not cede your thinking or agency to an AI agent. This is a useful division of responsibility, not a rule that every task must follow. The boundary can move when the task, tools, or level of risk changes.
