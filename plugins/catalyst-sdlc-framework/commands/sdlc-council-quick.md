---
description: Quick single-pass task decomposition without full council deliberation — faster and cheaper for straightforward features
argument-hint: Epic or feature description to decompose
---

# SDLC Quick Decomposition (System 1 Mode)

You are performing a fast, single-pass task decomposition of an epic or feature. This is the lightweight alternative to the full Cognitive Council (`/catalyst-sdlc-framework:sdlc-council`) — use it for well-understood features within a single component, or as a first-pass before deciding if full deliberation is warranted.

**When to use Quick mode vs Full Council:**

| Use Quick Mode                             | Use Full Council                           |
| ------------------------------------------ | ------------------------------------------ |
| Feature touches 1-2 components             | Feature crosses 3+ system boundaries       |
| Well-understood domain, clear requirements | Novel architecture, ambiguous requirements |
| Low risk, no major trade-offs              | High-risk, genuine design trade-offs       |
| Small-medium scope (< 10 tasks)            | Large scope or contested requirements      |
| Time-sensitive, need a rough plan fast     | High-stakes, worth investing in rigor      |

## Input

Epic/Feature to decompose: $ARGUMENTS

## Process

### Step 1: Validate Input

If `$ARGUMENTS` is empty or unclear, ask the user to describe:

- What is the epic or feature to decompose?
- What project/codebase does it apply to?
- Any constraints or priorities to consider?

Do NOT proceed until you have a clear epic description.

### Step 2: Read Project Context

Before decomposing, gather context:

- Read CLAUDE.md files (project and global) for tech stack, conventions, architecture
- Explore relevant codebase areas using Glob, Grep, Read
- Identify existing patterns, dependencies, and constraints

### Step 3: Multi-Perspective Single-Pass Analysis

Analyze the epic from ALL 6 SDLC perspectives simultaneously in a single pass:

**Systems Architecture lens:**

- What components/services are affected?
- What interfaces or data models change?
- What are the integration boundaries?

**Implementation lens:**

- What's the practical coding sequence?
- What files need to be touched?
- What's a realistic effort estimate?

**QA lens:**

- What are the acceptance criteria for each task?
- What test types are needed?
- What regression risks exist?

**DevOps lens:**

- Any infrastructure or deployment changes needed?
- What environment configuration is required?
- What's the rollback plan?

**Product lens:**

- Does each task trace to user value?
- What's the minimum viable user journey?
- Are acceptance criteria user-facing?

**Red Team lens (self-critique):**

- Is any proposed task unnecessary? Apply YAGNI.
- Can any tasks be merged or simplified?
- Is the scope minimal for the stated epic?

### Step 4: Produce Task Manifest

Output a structured task manifest:

```
## Quick Decomposition: [Epic Name]

### Complexity Assessment
- Components affected: [count]
- Estimated total tasks: [count]
- Risk level: low | medium | high
- Recommendation: [quick mode sufficient | consider full council]

### Task Manifest

#### Phase 1: Foundation
- [ ] **Task 1.1**: [title]
  - Type: [feature | bugfix | refactor | chore | spike | schema | infra]
  - Effort: [XS | S | M | L | XL] (~[hours]h)
  - Risk: [low | medium | high]
  - Dependencies: none
  - Acceptance Criteria:
    - [ ] [criterion 1]
    - [ ] [criterion 2]

#### Phase 2: Core Implementation
- [ ] **Task 2.1**: [title]
  - Type: [type]
  - Effort: [size]
  - Risk: [level]
  - Dependencies: Task 1.1
  - Acceptance Criteria:
    - [ ] [criterion 1]

(continue for all phases)

#### Cross-Cutting
- [ ] [testing tasks]
- [ ] [infrastructure tasks]
- [ ] [documentation if needed]

### Delivery Sequence
[Critical path diagram showing parallel and sequential work]

### Scope Notes
- **Included**: [what's in scope]
- **Explicitly excluded**: [what's NOT in scope — be specific]
- **Deferred**: [tasks that could be done but aren't needed now]

### Confidence Assessment
- Overall confidence: [0.0-1.0]
- Biggest uncertainty: [what you're least sure about]
- If confidence < 0.6, recommend: "Consider running full council for deeper analysis"
```

### Step 5: Recommend Escalation if Needed

After producing the manifest, assess whether the full council would add value:

- If you identified genuine trade-offs between perspectives → recommend full council
- If the epic turned out to be more complex than expected → recommend full council
- If you found ambiguity you couldn't resolve alone → recommend full council
- Otherwise → the quick decomposition is sufficient

## Output

The final deliverable is a practical task manifest ready for sprint planning. Each task should be specific enough to become a ticket. If the quick decomposition reveals the feature is more complex than expected, recommend escalating to the full council.
