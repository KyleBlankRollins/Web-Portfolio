# Architecture Fixes — Implementation Plan

Companion to `architecture-audit.md`. The audit is the findings registry; this is the execution order. Each phase has its own file, written to be handed to an AI agent that starts with no prior context.

## Phase map

| Phase                                                 | Findings covered                          | Depends on | Risk   | Status |
| ----------------------------------------------------- | ----------------------------------------- | ---------- | ------ | ------ |
| [1 — Safety net](phase-1-safety-net.md)               | AF-01, AF-25, AF-27, AF-30                | —          | Low    | done   |
| [8 — Toolchain](phase-8-toolchain.md)                 | AF-33 – AF-44                             | 1          | Low    | next   |
| [2 — Dead code](phase-2-dead-code.md)                 | AF-16 – AF-23                             | 1          | Low    | open   |
| [3 — Correctness](phase-3-correctness.md)             | AF-08 – AF-15                             | 1, 2       | Medium | open   |
| [4 — Metadata seam](phase-4-metadata-seam.md)         | AF-02                                     | 1, 2, 3    | High   | open   |
| [5 — Shared contracts](phase-5-shared-contracts.md)   | AF-03                                     | 1          | Medium | open   |
| [6 — Duplication](phase-6-duplication.md)             | AF-04, AF-05                              | 1          | Medium | open   |
| [7 — Facades and hygiene](phase-7-facades-hygiene.md) | AF-06, AF-07, AF-24, AF-26, AF-28 – AF-32 | 1, 3, 4    | Low    | open   |

All 44 findings are allocated. No finding appears in two phases.

The table is in **execution order**, which is why Phase 8 sits second despite its number. It was written after Phase 1 landed, in response to the dependency upgrade that came with it, and it belongs early: `AF-33` resolves three conflicting Node version contracts, and until that is settled a gate that passes locally and a gate that passes in CI are not making the same claim.

Phases 5, 6, and 8 depend only on Phase 1, so they can run in parallel with 2–4. Phases 2, 3, 4 and 7 are a strict chain.

## Gate discipline

Every phase file contains numbered **gates**. A gate is not a suggestion, a checklist item, or a reminder. It is a blocking condition.

The distinction that matters, from [Rules and Gates](https://blog.fsck.com/2026/04/07/rules-and-gates/):

> **Rules** contain an implicit opt-out. A rule lives in the agent's reasoning but lacks an objective verification point, which makes it easy to rationalize away — "I'll do it after this one thing."
>
> **Gates** eliminate the loophole. The next action is blocked until the gate condition is met.

The canonical shape is:

> When _[trigger]_ → _[action happens]_ → _[verification checkpoint]_ → then _[proceed]_

**The critical test for a gate:** its checkpoint must ask an objective question that cannot be answered by assertion alone. "Do I have the passing test count in front of me?" is a gate. "Did I verify this?" is not — it can be affirmed without any work having happened.

### Gate format used in these files

```
> ### GATE N.x — <short name>
>
> - **Trigger:** <the state that activates this gate>
> - **Action:** <exact command or observable operation>
> - **Checkpoint:** <objective, externally verifiable condition>
> - **Evidence:** <what must appear in your response>
> - **Blocked:** <what specifically may not happen until this passes>
```

### Rules for the implementing agent

These apply to every phase file:

1. **Never mark a gate passed without producing its evidence in your response.** A gate whose evidence is absent is a gate that did not pass.
2. **If a gate fails, stop and report.** Do not work around it, do not proceed to the next step, and do not widen scope to fix the cause unless the phase file says to. Report the failure with its output and wait.
3. **Do not skip ahead.** Steps within a phase are ordered because of the gates between them.
4. **Do not exceed the phase's scope.** Each file has an explicit "Out of scope" list. Findings assigned to other phases are out of scope even when you are looking straight at them.
5. **Do not modify `architecture-audit.md` except to update the Status column** for findings the phase completed.

## Shared conventions

**Commands.** All commands run from the repository root, `/Users/kylerollins/Documents/GitHub/Web-Portfolio`.

**Branch.** Work on a branch off `dev`, named `arch/phase-N-<slug>`. `prod` is trunk. Do not commit directly to `dev` or `prod`.

**Commit style.** Match existing history: `refactor(builder): ...`, `test(builder): ...`, `fix(site): ...`. One commit per numbered step unless the step says otherwise.

**Formatting.** Run `npx prettier --write` on every file you touch before committing. The repo has a `.prettierrc`; do not override it.

**Type checking.** `npx tsc --noEmit` must exit zero at the end of every phase. It exits zero today — a nonzero exit is something you introduced.

**Toolchain.** Vite 8 (Rolldown), TypeScript 7, Vitest 4, Express 5, Marked 18, Node 24 in CI. Several phase files were written before that upgrade and were revised after it; where a phase prescribes a pattern, it reflects the current majors. If you find yourself about to hand-roll something a framework now does natively, that is a signal the document is stale — say so rather than following it.

**Line references.** Every `file.ts:NN` in the audit and these phase files was verified against the working tree — `AF-01` – `AF-32` at commit `a28933aa`, `AF-33` – `AF-44` at `1f700841`. Phase 1 and the dependency upgrade have both landed since the first set was written, so those references have shifted. If a reference does not match what you find, re-locate the symbol by name and note the drift in your report rather than editing blindly.

## Baseline the phases depend on

Phase 1 produces a golden-file snapshot of the built site. Phases 2, 3, 4, 6, 7, and 8 all use it as their primary regression gate, because most of what they do should produce **byte-identical published HTML**.

That is the single most valuable artifact in this plan. If Phase 1 is skipped or its snapshot is unreliable, every later phase loses its objective checkpoint and degrades from a gate to a rule.

One property matters specifically for Phase 8: the snapshot normalizes asset filename fingerprints to `-HASH.js`. That is what lets bundler and compiler changes pass cleanly — but it also means the snapshot **cannot** detect a change to bundle _contents_ that leaves the HTML identical. Phase 8's gates therefore inspect the emitted chunks directly rather than relying on the snapshot alone.

## Historical note

`architecture-audit.md` references `design-fixes/design-audit.md` as its visual counterpart. That directory was removed from the working tree after the second design audit completed (see commits `6b397cb1` and `0e891ff2`); the files remain in git history. The reference is historical and does not need to resolve on disk.
