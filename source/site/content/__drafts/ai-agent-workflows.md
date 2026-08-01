---
title: "AI Agent Workflows"
description: ""
keywords: ""
date: ""
tags: [""]
---

For the last year or so, I have heavily used AI tools and agents to help with work and personal projects. Most of the time, these agents are an augmentation and enable me to move faster on the things that I have already scoped and planned.

Everyone is at a different stage of AI tool use and not everyone finds the same things helpful. But I figured I could share some of my workflows and lessons. Maybe it will help someone streamline their workflows or help them get over a difficult learning curve.

## Drawing boxes

I've long had this idea that drawing literal boxes around problems (on a whiteboard or your diagramming software of choice) is an excellent way to break ambiguous work into more understandable chunks. The basic premise is this: draw a box for everything you know now. Group the boxes and then draw a larger box around the groups. Label the new boxes. Then draw a huge box around everything.

While drawing the indivudual boxes, my brain makes connections I otherwise wouldn't have considered. I often need to move boxes around or delete some as my thinking gets more focused. The main benefit here is iteratively reducing ambiguity by defining borders around ideas (drawing boxes). It's as much methodical as it is intuitive.

I believe that humans should continue doing this work and should draw the boxes for AI agents. Clarity of thinking is a human domain. It's a bit different for everyone. Some people are more methodical, some are more intuitive, and some (like me) mix the two.

In my experience with AI agents, I've found that I get significantly better results when I have well-drawn boxes that constrain the problem space that they need to work in.

## Discovery and implementation are different jobs

A common mistake I've seen people make is to give an agent too many jobs. For example: "figure out what has changed in this product release and then write the release notes based on this template". That might work for a small release, but you'll get worse outcomes with a release of any real substance. This is because there are two jobs happening here: discovery and implementation.

### Discovery

Discovery requires deciding what matters, resolving ambiguity, finding missing context, and choosing among plausible directions.

In this case, "figure out what has changed in this product release" could be a very complicated proposal. You could tell the agent to use project docs, like product requirement, scope, and spec docs. A better approach would be to have the agent look at the engineering repos and understand the actual work done for the release so you're covering what actually shipped instead what should have shipped. But that would require the agent to understand the product release process itself, which can be very complicated.

You can provide agents with skills or other context to help them solve the discovery problem. But that requires humans to do the real discover work and draw the boxes that constrain the agents' scope. You can use agents to accelerating discovery by having them search, summarize, compare, and ask questions. But agents should not define the problem.

At the end of discovery, you should have a bunch of well-drawn boxes, which can be documented in many ways. I usually use markdown files. These are the artifacts of the discovery process. And they're critical for the second job: implementation.

### Implementation

After the discovery work is done, you can hand the discovery artifacts to a _different_ AI agent for implementation. I've found that agents are pretty good at actually doing work when the requirements are well defined (the boxes are well drawn). This is similar to how many people work. If you want accurate and efficient work, you need to first define the work. User stories are a good example of this. The discovery artifacts should be explicity about constraints, interfaces, and acceptance criteria

The balance of work between human and AI agent should be inverted here.

For discovery workflows, humans do direct research, define scope, evaluate the plan, and validate anything and everything that agents help find.

For implementation workflows, AI agents inspect a bounded task, make changes, run checks, and report what happened. Humans review the end result.

## Discovery with an agent, under human direction

- Describe using an agent as a research assistant rather than as an autonomous project owner.
- Give it a question, a bounded research target, and permission to surface uncertainty.
- Use deterministic sources and tools wherever possible: repository search, Git history, issue trackers, static analysis, type information, and structured application programming interfaces.
- Treat research as evidence for a human decision, not as the decision itself.
- Explain why important source material belongs in the repository: web fetching can involve summarization, truncation, and context transfer that drops important information.
- Note the practical limit: research can produce a large amount of plausible context, so a human still has to decide what belongs in scope.

### Turn research into a source of truth

- Describe the transition from exploration to a human-reviewed specification or project plan.
- Keep the phase-document workflow observational and high level:
  - A larger or more capable model helps research and shape the plan.
  - The plan is broken into discrete Markdown files or phases.
  - Each phase describes the intended change clearly enough for an implementation agent to work independently.
  - The human reviews and adjusts the plan before implementation begins.
- Explain why repository Markdown works well: it is versioned, searchable, reviewable, and available to later agents without relying on a website parser.
- Real repository example: the processor refactor began with `documentation/meta/refactor-processors.md`, which mapped existing responsibilities to focused modules. Later commits completed phases 2, 3, and 4 and updated the builder documentation as the structure settled.
- Clarify the evidentiary boundary: Git history demonstrates a plan-to-implementation pattern, but does not prove which changes were produced by an agent.

## Agents implement bounded work

- Explain why discrete phases reduce context, limit blast radius, and create natural review points.
- Prefer requests that name relevant files, behavior, constraints, and validation commands.
- Let the agent make the change, run deterministic checks, and describe assumptions or deviations.
- Use smaller or faster models for implementation when the plan and interfaces are clear; reserve stronger models for ambiguous research and planning.
- Include a second repository example: the citations feature had a detailed plan covering interfaces, parsing, reference processing, rendering, templates, styles, and build-time validation, followed by a focused implementation commit.

### Deterministic tools are the scaffolding

- Explain that agents become more reliable when important judgments can be checked mechanically.
- Focus on the tools that have mattered most in practice:
  - Tests and behavior checks
  - Linters and static analysis, including Vale for prose
  - Types, structured application programming interfaces, and opinionated compilers
- Show how these tools expose facts and failures an agent should not have to infer from prose.
- Make the limitation explicit: passing checks does not mean the change is correct or useful. It only narrows the space of possible mistakes.

### Human review required

- Define review broadly: inspect updated files, read the diff when useful, run tests and linters, check browser behavior, and ask another model or model family for an independent review.
- Put file review first. An agent can pass tests while changing the wrong abstraction, weakening a public contract, or exceeding the intended scope.
- Use a different model family as a reviewer when practical, while treating that review as another opinion rather than an oracle.
- Make review a gate between phases instead of an activity reserved for the end.

## The cost of too much context

- Argue for lean customization. MCP servers, skills, agent instructions, project prompts, and other context layers add maintenance and processing overhead.
- Use customization when it creates repeatability or closes a demonstrated gap.
- Avoid elaborate context systems for discovery or prototyping, where the problem is still changing and the instructions can become a second problem to manage.
- Use the admin system's history as a cautionary example: a large initial server and UI implementation was followed by an architecture and validation pass, then substantial fixes and reorganization. The lesson is not that the implementation failed, but that broad scope creates more surface area for later correction.

## What the repository changed my mind about

- Reflect on the repository as a record of the workflow: plans, implementation phases, feedback, fixes, and documentation updates remain visible in Git.
- Contrast the speed of agent-assisted implementation with the slower work of deciding what should exist.
- The valuable leverage is not removing humans from the loop; it is moving human attention toward scope, judgment, and review.

## Conclusion: Humans steer, agents execute

- Offer the practical principle: humans define the problem and direction, agents implement bounded work, and humans review the result.
- Emphasize that AI assistance belongs on both sides of the implementation boundary, but authority should not silently move to the agent.
- Close with uncertainty: models, tools, and agent conventions are changing quickly, so this workflow should be treated as a current observation to test and revise.
