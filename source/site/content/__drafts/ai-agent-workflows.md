---
title: "AI Agent Workflows"
description: ""
keywords: ""
date: ""
tags: [""]
---

- Discovery vs implementation. Agents aren't as good at the former, but are fantastic at the latter.
- Deterministic tools as much as possible. Audits, static analysis, querying tools like Jira. Very useful for helping agents in discovery work.
- Lean customization that relies on deterministic workflows. Only augment with skills, etc., when there's a clear gap.
- Source plan/spec. Use large, powerful model for research and planning. Break into discrete markdown phase files that are specifically written for AI agent implementation. Use smaller models to implement.
- Have an agent based on a different model family review the work.
- When accuracy is important, bring markdown files into your repo. Don't rely on agents parsing websites.
