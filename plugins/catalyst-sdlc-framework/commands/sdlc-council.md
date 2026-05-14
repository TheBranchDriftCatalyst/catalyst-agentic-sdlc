---
description: Decompose an epic/feature into SDLC tasks using a 5-expert cognitive council
argument-hint: Epic or feature description to decompose
---

# SDLC Cognitive Council — Task Decomposition

You are initiating a Cognitive Council deliberation to decompose an epic or feature into structured, sequenced SDLC tasks. This uses a 5-expert parallel deliberation architecture where expert agents independently analyze, cross-critique, revise, and vote — then their outputs are synthesized into a unified task manifest.

## Input

Epic/Feature to decompose: $ARGUMENTS

## Process

### Step 1: Validate Input

If `$ARGUMENTS` is empty or unclear, ask the user to describe:

- What is the epic or feature to decompose?
- What project/codebase does it apply to?
- Any constraints or priorities to consider?

Do NOT proceed until you have a clear epic description.

### Step 2: Launch the Council Orchestrator

Delegate the entire deliberation to the `council-orchestrator` agent. Pass it:

- The epic description from the user
- The current working directory / project context
- Any constraints the user specified

The orchestrator handles everything:

1. Reading project context (CLAUDE.md, codebase structure)
2. Framing the PROBLEM_STATEMENT
3. Spawning 6 expert agents (Systems Architect, Implementation Engineer, QA Strategist, DevOps/Delivery, Product/Design, Red Team)
4. Managing all 5 phases (Problem Framing, Independent Hypothesis, Cross-Critique, Revision, Vote)
5. Applying the synthesis algorithm
6. Producing the COUNCIL_VERDICT

### Step 3: Present Results

Once the orchestrator returns the COUNCIL_VERDICT, present it to the user as a structured task manifest:

1. **Council Summary**: Consensus level, confidence distribution, quality metrics
2. **Unified Task Manifest**: Merged task list organized by delivery phase with:
   - Task title, type, scope
   - Dependencies (task-to-task)
   - Effort estimates
   - Risk ratings
   - Acceptance criteria
3. **Dissenting Views**: Any minority positions the user should consider
4. **Contested Items**: Areas where experts disagreed — highlight trade-offs for user decision
5. **Delivery Sequence**: Critical path and parallelizable work

### Step 4: User Decision Points

If the council produced a split or contested verdict on any aspect:

- Present the competing positions clearly
- Ask the user to decide between them
- Incorporate their decision into the final manifest

## Output

The final deliverable is a complete, actionable task manifest that a development team can use to plan and execute the epic. Each task should be ready to become a ticket in a project tracker.
