---
title: "Agent summaries and how they affect documentation retrieval"
description: ""
keywords: ""
date: "2026-04-04"
tags: []
---

- Agents use different retrival methods. How, exactly, those methods work isn't always clear.
- One of the retrieval methods is webfetch. Dachary has explored this.
- Two major issues can occur: summarization and truncation
- That happens because AI tool providers want to minimize token use (every token costs them more than they're making you pay for, so they're running at a loss and have no incentive to increase retrieval fidelity)
- Let's explore the effect that summarization has on an agent's decision making process when it tries to access product documentation
- Hypothesis: summarization negatively affects task outcomes compared to full documentation access. Documentation already practices minimalism, so summarization strips crucial information.
