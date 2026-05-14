# Tech Compare

Structured technology evaluation framework for making architectural decisions.

## When to Use

- Choosing between libraries/frameworks
- Evaluating implementation approaches
- Making infrastructure decisions
- Any decision with multiple viable options

## Process

### 1. Requirements Gathering

Define the evaluation criteria:

- **Must have**: Non-negotiable requirements
- **Should have**: Important but flexible
- **Nice to have**: Bonus features
- **Constraints**: Technical, timeline, budget limits

### 2. Alternative Discovery

Identify options to evaluate (minimum 2, maximum 5):

- Include the obvious choices
- Consider lesser-known alternatives
- Include "do nothing" or "build custom" if applicable

### 3. Evaluation Matrix

Score each option against criteria:

| Criterion          | Weight | Option A | Option B | Option C |
| ------------------ | ------ | -------- | -------- | -------- |
| Performance        | 3      | 4        | 3        | 5        |
| Ease of use        | 2      | 5        | 4        | 2        |
| Community          | 2      | 5        | 3        | 4        |
| Cost               | 1      | 5        | 5        | 3        |
| **Weighted Total** |        | **X**    | **Y**    | **Z**    |

Scale: 1 (poor) to 5 (excellent)

### 4. Risk Assessment

For each option, identify:

- **Technical risks**: Complexity, learning curve, edge cases
- **Operational risks**: Maintenance, scaling, monitoring
- **Business risks**: Vendor lock-in, licensing, support

### 5. Proof of Concept (optional)

For close decisions, build minimal PoCs:

- Time-boxed exploration
- Test critical requirements
- Document findings

### 6. Decision & Documentation

Record the decision in `.scratch/ticket-workflows/<type>/DEV-XXXX-<short-desc>/decisions/<topic>.md`:

```markdown
# Decision: <Topic>

**Date:** YYYY-MM-DD
**Status:** Decided | Proposed | Superseded
**Ticket:** DEV-XXXX

## Context

<Why this decision is needed>

## Options Considered

### Option A: <Name>

- Pros: ...
- Cons: ...

### Option B: <Name>

- Pros: ...
- Cons: ...

## Decision

We will use **Option X** because:

1. <Reason 1>
2. <Reason 2>
3. <Reason 3>

## Consequences

- <What changes as a result>
- <Follow-up tasks>
- <Future considerations>
```

## Context Update

After documenting:

1. Add summary to `context.md` Key Decisions section
2. Update beads issue with decision comment (if applicable)

## Output

Confirm:

- Decision documented at `decisions/<topic>.md`
- Context updated with summary
- Stakeholders informed (if applicable)
