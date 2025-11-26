# Blog Writing Agents

This directory contains custom GitHub Copilot agents designed to streamline your blog writing workflow. Each agent is a specialist that handles a specific stage of the content creation process.

## Available Agents

### @research-agent

**Purpose:** Gathers and synthesizes information for blog post topics  
**Use when:** Starting a new post, need sources and supporting evidence  
**Outputs:** Annotated bibliography, key insights, potential analogies

**Example prompts:**

```
@research-agent I'm writing about "intentional work patterns" for remote workers.
Find research on remote work boundaries, home office ergonomics, and
productivity rituals. Focus on sources from last 3 years.

@research-agent What are some compelling analogies or frameworks from
non-tech domains that relate to setting professional development goals?
```

---

### @outline-agent

**Purpose:** Transforms ideas into structured outlines  
**Use when:** You have research/ideas but need organizational structure  
**Outputs:** Detailed outlines with narrative flow

**Example prompts:**

```
@outline-agent I want to write about dealing with ambiguity in
documentation projects. Here's my rough idea: [paste ideas].
Create an outline that follows the pattern from rule-of-thirds.md.

@outline-agent Review this outline for "Code example philosophy" and
suggest improvements to the flow and structure.
```

---

### @draft-agent

**Purpose:** Generates first drafts from approved outlines  
**Use when:** You have a solid outline and need prose  
**Outputs:** Complete markdown drafts with frontmatter

**Example prompts:**

```
@draft-agent Write a first draft based on this outline: [paste outline].
Write to source/site/content/__drafts/intentional-work-patterns.md.

@draft-agent Expand section 3 of the current draft with more concrete
examples. Maintain the conversational tone from my published posts.
```

---

### @editor-agent

**Purpose:** Refines and polishes draft content  
**Use when:** Draft is complete, needs editorial review  
**Outputs:** Specific suggestions for improvements

**Example prompts:**

```
@editor-agent Review source/site/content/__drafts/code-example-advice.md
and provide feedback on structure, content, style, and technical accuracy.

@editor-agent This section feels weak: [paste section]. Suggest specific
improvements for clarity and impact.
```

---

### @example-agent

**Purpose:** Generates examples, analogies, and illustrations  
**Use when:** Concept needs clarification or real-world grounding  
**Outputs:** Specific examples, analogies, scenarios

**Example prompts:**

```
@example-agent I'm explaining why artificial constraints help with
decision-making. Suggest 3 analogies from different domains.

@example-agent This section about documentation workflows is too abstract:
[paste]. What's a concrete example that would make this click?
```

---

### @backlog-agent

**Purpose:** Manages blog post pipeline and priorities  
**Use when:** Planning next post, reviewing overall progress  
**Outputs:** Status reports, recommendations, priorities

**Example prompts:**

```
@backlog-agent What's the current status of my blog backlog? What should
I focus on next?

@backlog-agent Move "Intentional work patterns" from Researching to
Outlining in the backlog.

@backlog-agent I have 3 posts stuck in "Outlining" for over a month.
What should I do?
```

---

## Typical Workflow

### Starting a New Post

1. **Idea Generation** → Add to backlog

   ```
   @backlog-agent Add new post idea: "Scaling yourself as a senior IC" to Planned section
   ```

2. **Research Phase**

   ```
   @backlog-agent Move "Scaling yourself" to Researching
   @research-agent Research strategies for individual contributors to increase impact
   without becoming a manager. Focus on delegation, documentation, and influence.
   ```

3. **Outlining Phase**

   ```
   @backlog-agent Move to Outlining
   @outline-agent Create outline for "Scaling yourself" based on this research: [paste]
   ```

4. **Writing Phase**

   ```
   @backlog-agent Move to Writing
   @draft-agent Write first draft from this outline: [paste]
   @example-agent This section needs a concrete example: [paste section]
   ```

5. **Editing Phase**

   ```
   @backlog-agent Move to Editing
   @editor-agent Review the complete draft and suggest improvements
   ```

6. **Publishing**
   ```
   Move file from __drafts/ to content/
   @backlog-agent Move "Scaling yourself" to Published
   ```

---

## Multi-Agent Workflows

### Stuck on an idea?

```
@research-agent Find compelling frameworks about [topic]
@example-agent Suggest 3 analogies for [concept from research]
@outline-agent Create outline using [best framework] and [best analogy]
```

### Draft feels flat?

```
@editor-agent What's not working in this draft?
@example-agent Suggest concrete examples for sections 2 and 4
@draft-agent Rewrite section 3 with more energy
```

### Need fresh perspective?

```
@outline-agent Suggest 2 alternative structures for this post
@example-agent Find examples from non-tech domains for this concept
@editor-agent What assumptions am I making that might not be universal?
```

---

## Agent Configuration Tips

### Updating an Agent

Edit the `.md` file in this directory. Changes take effect immediately in Copilot Chat.

### Adding Context

Agents can read your published posts to learn your style:

```
@draft-agent Read llm-as-sme.md and rule-of-thirds.md, then write a
draft that matches that voice and structure.
```

### Combining Agents

You can mention multiple agents in one conversation to get different perspectives:

```
@outline-agent @example-agent I need both a structure and compelling
analogies for a post about [topic]
```

---

## Best Practices

1. **Be specific:** "Review the intro" works better than "make it better"
2. **Provide context:** Reference your published posts as examples
3. **Use stages:** Don't skip from idea to draft—research and outline matter
4. **Iterate:** Agents work best with feedback and refinement
5. **Check output:** Always review and verify agent suggestions (especially citations)

---

## File Locations

- **Published posts:** `source/site/content/*.md`
- **Drafts:** `source/site/content/__drafts/*.md`
- **Backlog:** `source/site/content/__drafts/backlog.md`
- **Agent configs:** `.github/agents/*.md` (this directory)

---

## Validation Commands

These agents know about your project commands:

- `npm run lint:prose` - Lint changed markdown files with Vale
- `npm run lint:prose:all` - Lint all markdown files
- `npm run lint:prose:drafts` - Lint only drafts folder
- `npm run dev` - Preview site at localhost:3000

Agents will suggest running these when appropriate.

---

## Troubleshooting

**Agent not appearing in Copilot Chat?**

- Ensure file is in `.github/agents/` directory
- Check YAML frontmatter is valid (name and description)
- Reload VS Code window

**Agent giving generic responses?**

- Be more specific in your prompt
- Reference published posts for context
- Break complex requests into smaller steps

**Need different agent behavior?**

- Edit the agent's `.md` file
- Add more examples or constraints to the "Boundaries" section
- Include specific commands or references

---

## Related Resources

- [GitHub Blog: How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Blog content README](../../source/site/README.md)
- [Project Copilot instructions](../copilot-instructions.md)
