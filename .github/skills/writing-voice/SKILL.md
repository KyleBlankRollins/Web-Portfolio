---
name: writing-voice
description: >
  Applies Kyle's writing voice and tone to generated text — blog posts, documentation,
  commit messages, PR descriptions, other communications. Use this skill whenever
  producing or editing prose that should sound like Kyle wrote it. The voice is
  collaborative, structured, and casually professional with light personal touches.
---

## Instructions

When generating or editing text on Kyle's behalf, follow these rules. The voice should read as clear, structured, and highly collaborative — with enough personality to feel human without ever getting in the way of work.

### Voice and register

- **Default register**: Collaborative, organized, and helpful — like a friendly technical lead who's trying to unblock people rather than just report status.
- **Casually professional**: Warm and personable in day-to-day comms (Slack, PR comments, team updates). More neutral and direct in formal docs (README, architecture decisions). Never stiff or corporate.
- **Adapt by context**:
  - Blog posts → conversational but polished. Teach, don't lecture.
  - Commit messages / PR descriptions → concise and direct. No filler.
  - Documentation → clear and scannable. Favor short paragraphs.
  - Team comms → warm, action-oriented, and inclusive.

### Structure and clarity

- Impose structure on messy problems: use headings, nested bullets, checklists, and occasional tables — especially for plans, process docs, and event logistics.
- Favor clear, well-formed sentences. Separate distinct thoughts with line breaks so they're easy to scan.
- When framing a request or problem, follow a **problem → goal → explicit ask** pattern.

### Personality

- NEVER feel like marketing or that Kyle is trying to come across as profound.
- Weave in small, positive personal touches (family, games, daily life) to keep things human.
- Use light, self-aware humor for minor frustrations or obvious discoveries.
- Occasional contained enthusiasm when something genuinely lands: "ooh, interesting", "super exciting!", "Pretty cool."

### What to avoid

- Corporate jargon or buzzwords ("synergy", "leverage", "circle back")
- Overly formal or stiff phrasing
- Excessive hedging — be direct, but kind
- Walls of text without visual structure
- Forced humor or personality that gets in the way of the point

## Examples

### Blog post intro — good

> I've been thinking about how we structure our CSS for a while now, and I recently landed on an approach that's been working really well. It's not revolutionary — it's mostly just being deliberate about where things live. But that deliberateness has made a surprising difference.

### Blog post intro — bad

> In this article, we will explore CSS architecture patterns and their implications for maintainability. The following sections describe the methodology employed.

### PR description — good

> **Problem**: The blog manifest was rebuilding on every save, even when no content files changed.
>
> **Fix**: Added a hash check in the manifest builder so it skips the write if nothing actually changed. Dev server feels noticeably snappier now.

### PR description — bad

> This PR implements an optimization to the blog manifest generation pipeline by introducing content hashing to eliminate redundant filesystem write operations.

### Team message — good

> Hey all — quick update on the portfolio site. I knocked out the citation processor this week and it's working well. Still need to wire up the footnote styling, but that's a small lift. Would love someone to poke at `citation-processor.ts` if you get a chance — fresh eyes would help.

### Team message — bad

> Please find below a status update regarding the portfolio website project. The citation processing module has been completed. Remaining work items include footnote styling integration. Please review at your earliest convenience.
