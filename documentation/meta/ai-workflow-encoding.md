# AI Workflow Encoding

This document describes my typical AI workflow and a plan to generalize it into portable skills.

## Participants

- Me. A human who sets goals and does research and review of implmentations. Sometimes, I write my own code, but I often leave the implementation to AI agents.
- PLANNING AGENT. A planning agent that uses at least Opus-level models. The agent takes research notes or SPEC files as inputs and creates an implementation plan.
- BUILDER AGENT. An implementation agent. Usually uses a model like Codex 5.3 or GPT 5.6 Luna. They don't need to be super capable models because they're workin off of very well defined guidance in phase docs.
- REVIEWER AGENT. Another Opus-level agent that reviews both implementation plans and completed work. In other words, it validates outputs from both PLANNING AGENT and BUILDER AGENT.

## Workflow

1. I research the project. Write notes, sometimes use AI to help me. Then, I compile my notes into a single document. Sometimes, this turns into a full SPEC document. Sometimes, it's a structured file of findings and high-level direction.

- OUTCOME: At the end of my research, there's always ONE main artifact document in markdown format.

2. PLANNING AGENT: If working against a findings doc with high level guidance, I ask PLANNING AGENT to synthesize the findings and create an implementation plan. The plan turns the findings into real work. If working against a SPEC, I ask PLANNING AGENT to create an implementation plan based on the SPEC.

- OUTCOME: PLANNING AGENT creates a single-file implementation plan.

3. REVIEWER AGENT: I ask REVIEWER AGENT to look over the implementation plan. I specifically ask it to look for any gaps or assumptions that need to be clarified. Depending on the situation, I'll also ask it to look for software architecture best practices and greenfield project best practices.

- OUTCOME: A markdown file that contains a review of the implementation plan.

4. PLANNING AGENT: Implements feedback from the review.

- OUTCOME: The implementation plan is updated

5. PLANNING AGENT: I ask PLANNING AGENT to break the implementation plan into smaller chunks of work. My typical phrasing looks like this: "Break this plan into discrete phases of work. Each phase should have its own markdown file and be written for AI agent implmenetation. Include gates as details in this article: https://blog.fsck.com/2026/04/07/rules-and-gates/"

- OUTCOME: A set of markdown phase files that follow this naming convention: `00-some-topic`, `01-some-topic`, etc. Typically, these live within a dedicated directory.

6. BUILDER AGENT: I create a builder agent and ask it to implement the first phase of the project, giving it a direct link to the respective phase file.

- OUTCOME: The phase work is implemented and the specified gates pass

7. REVIEWER AGENT: I ask the REVIEWER AGENT to review the implemented work.

- OUTCOME: A markdown file that contains a review of the phase's work

8. BUILDER AGENT: I ask the builder agent to implement feedback from the phase review

- OUTCOME: The phase work is updated

9. BUILDER AGENT: I clear the BUILDER AGENT's context or start a new BUILDER AGENT and continue until all phase work is complete. Repeating the review cycle for each phase.

- OUTCOME: All phase work is completed and reviewed. All gates pass.

10. REVIEW AGENT: I ask the REVIEW AGENT to review ALL of the completed project work. This last review is important for identifying drift.

- OUTCOME: A markdown file that contains a review of the project's work

11. BUILDER AGENT: I ask the builder agent to implement feedback from the project review

## Portable Skill Architecture

The workflow should be encoded as skills that transform one durable artifact into
another. Agent roles and harness features are orchestration concerns: any capable
agent can activate the appropriate skill for its current artifact and assignment.

Each skill should be independently usable. A user should be able to give an agent a
single artifact and request the skill's output without first running the whole
workflow.

### Shared Artifact Contract

The skills use Markdown files as their handoff format. Each artifact should contain:

- A clear title and status (`draft`, `ready for review`, `approved`, or `complete`)
- The source artifacts, repository areas, and external references it relies on
- Explicit assumptions, open questions, and decisions where applicable
- Acceptance criteria or validation evidence when it proposes or reports work

Artifacts should be specific enough that a fresh agent can continue the work without
access to the previous agent's conversation. Links and repository-relative paths are
portable; references to a particular model, editor, agent framework, or tool are not.

### Recommended Skills

| Skill | Input | Output | Owns |
| --- | --- | --- | --- |
| `research-synthesis` | Raw notes, links, code observations, and a goal | Findings document or specification | Reconciling evidence, recording constraints, identifying unknowns, and separating facts from recommendations |
| `implementation-planning` | Findings document or specification | Implementation plan | Translating desired outcomes into ordered changes, affected areas, risks, acceptance criteria, and validation strategy |
| `plan-review` | Implementation plan plus its source artifact | Plan review | Finding missing requirements, unsupported assumptions, dependency errors, architectural risks, and unclear validation |
| `plan-revision` | Implementation plan and one or more plan reviews | Revised implementation plan | Resolving review findings with explicit dispositions while preserving approved scope |
| `phase-design` | Approved implementation plan | Numbered phase files | Creating independently executable increments with prerequisites, file-level work, gates, rollback considerations, and handoff notes |
| `phase-implementation` | One phase file and the repository | Implemented change plus validation record | Executing one bounded phase, keeping scope controlled, running phase gates, and recording deviations or follow-up work |
| `implementation-review` | A phase or completed project, its requirements, and validation evidence | Implementation review | Evaluating correctness, regressions, security, maintainability, requirement coverage, and missing tests; never silently fixing work |
| `review-remediation` | Implementation review and the affected phase or project | Corrected implementation plus validation record | Applying accepted review findings, declining invalid findings with rationale, and rerunning the relevant gates |

This is eight skills rather than seven because review remediation deserves its own
boundary. Reviewing and changing code require different modes of work, different
permissions, and different evidence. Keeping them separate also prevents a reviewer
from grading its own edits.

### Why These Boundaries Work

- **Research synthesis is not planning.** It produces a trustworthy description of
	the problem space, including uncertainty. Planning makes commitments about how to
	act on that information.
- **Planning is not phase design.** A plan explains the whole change; phase files are
	executable work orders for a narrow slice. Combining them tends to make either the
	plan too operational or the phases too vague.
- **Review is not remediation.** A review is an independent assessment. Remediation
	is implementation work that should cite the assessment and provide new evidence.
- **Phase and project review use one skill.** Their review method is the same; only
	the review scope changes. The skill should accept an explicit `scope: phase | project`
	input rather than duplicating nearly identical instructions.

### Skill Contracts

Each `SKILL.md` should include the following sections, in this order:

1. **When to use**: Trigger phrases, expected inputs, and explicit non-goals.
2. **Required context**: The minimum artifacts and repository access needed to begin.
3. **Method**: The short, repeatable procedure the agent follows.
4. **Output contract**: Required headings, decision records, and validation evidence.
5. **Quality bar**: What makes the output actionable and what failure modes to avoid.
6. **Handoff**: Which downstream skill can consume the result and what must be true
	 before it does.

Keep harness-specific instructions out of the skill body. For example, say “inspect
the repository and run the narrowest relevant validation” rather than naming terminal
commands or proprietary tools. Put optional command examples in a reference file if
they are broadly useful, and let the active harness decide how to execute them.

### Suggested Directory Layout

```text
skills/
	research-synthesis/
		SKILL.md
		assets/findings-template.md
		assets/spec-template.md
	implementation-planning/
		SKILL.md
		assets/implementation-plan-template.md
	plan-review/
		SKILL.md
		assets/plan-review-template.md
	plan-revision/
		SKILL.md
	phase-design/
		SKILL.md
		assets/phase-template.md
		references/gates.md
	phase-implementation/
		SKILL.md
		references/validation-evidence.md
	implementation-review/
		SKILL.md
		assets/implementation-review-template.md
	review-remediation/
		SKILL.md
```

Templates belong with the skill that creates their artifact. A downstream skill may
read an artifact created from another skill's template, but it should not require that
template or depend on its exact wording.

### Workflow Traceability

| Current workflow step | Portable skill |
| --- | --- |
| 1. Research and consolidate notes | `research-synthesis` |
| 2. Create an implementation plan | `implementation-planning` |
| 3. Review the plan | `plan-review` |
| 4. Apply plan feedback | `plan-revision` |
| 5. Break the plan into phases | `phase-design` |
| 6. Implement a phase | `phase-implementation` |
| 7. Review phase work | `implementation-review` with `scope: phase` |
| 8. Apply phase-review feedback | `review-remediation` |
| 9. Repeat each phase | `phase-implementation`, `implementation-review`, and `review-remediation` |
| 10. Review completed project work | `implementation-review` with `scope: project` |
| 11. Apply project-review feedback | `review-remediation` |

### First Version Scope

Start with these four skills: `implementation-planning`, `plan-review`,
`phase-design`, and `phase-implementation`. They encode the highest-value loop and
can operate against the research notes you already create. Add `implementation-review`
and `review-remediation` next, then add `research-synthesis` and `plan-revision` when
you want more rigor at the document boundaries.

Avoid a top-level “workflow orchestrator” skill initially. It would either duplicate
the human's judgment about when to advance a project or become coupled to whichever
agent harness happens to run it. A lightweight checklist or prompt can coordinate the
portable skills without becoming a required dependency.
