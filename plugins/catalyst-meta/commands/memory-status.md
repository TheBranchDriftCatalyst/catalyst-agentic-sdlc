---
description: Report status of all 3 memory architecture layers (semantic search, code graph, agent memory)
allowed-tools:
  [
    "mcp__memory-service__memory_health",
    "mcp__memory-service__memory_stats",
    "mcp__memory-service__memory_list",
    "mcp__memory-service__memory_search",
    "mcp__codebase-memory__index_status",
    "mcp__codebase-memory__get_architecture",
    "mcp__codebase-memory__list_projects",
    "mcp__claude-context__get_indexing_status"
  ]
model: haiku
---

# Memory Architecture Status Report

Run a full status check across all 3 memory layers and present a unified report. Call all tools in parallel where possible.

## Step 1: Gather Data (parallel calls)

Make these calls simultaneously:

1. **claude-context**: `get_indexing_status` for the current project directory
2. **codebase-memory**: `index_status` for the current project
3. **codebase-memory**: `get_architecture` with aspects `['languages', 'packages']`
4. **codebase-memory**: `list_projects` to show all indexed projects
5. **memory-service**: `memory_health`
6. **memory-service**: `memory_stats`
7. **memory-service**: `memory_list` with `page_size: 5` (most recent memories)

## Step 2: Present Report

Format as a unified status dashboard:

```
## Memory Architecture Status

### Layer 1: Semantic Search (claude-context)
| Metric | Value |
|--------|-------|
| Status | Ready / Indexing (N%) / Not Indexed |
| Path   | ... |

### Layer 2: Code Graph (codebase-memory)
| Metric | Value |
|--------|-------|
| Status       | ready / indexing / not found |
| Nodes        | N (functions, classes, modules) |
| Edges        | N (calls, imports, references) |
| Last indexed | ISO timestamp |
| Index type   | initial / incremental |
| Languages    | top languages from architecture |
| Top packages | top 5 packages by connectivity |

**All Indexed Projects:**
- project-name (N nodes, N edges, last indexed: ...)

### Layer 3: Agent Memory (memory-service)
| Metric | Value |
|--------|-------|
| Status          | healthy / degraded |
| Total memories  | N |
| DB size         | N MB |
| Embedding model | ... |
| Cache hit rate  | N% |
| Integrity       | healthy / N auto-repairs |

**Recent Memories (last 5):**
For each memory, show a compact summary:
- [type] **first 80 chars of content...** (tags: tag1, tag2) — created: relative time
```

## Rules

- Keep it concise — tables and bullet points only
- Flag anything unhealthy or missing with a warning prefix
- Show relative timestamps for recent memories (e.g., "2 hours ago", "yesterday")
- If any layer is not initialized, suggest the initialization command
- Do NOT explain what each layer does — the user knows
