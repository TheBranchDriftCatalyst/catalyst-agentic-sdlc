#!/usr/bin/env bash
# Runs as SessionStart hook with matcher "compact"
# Re-injects persistent context after compaction so the agent can recover

echo "# Post-Compaction Context Recovery"
echo ""
echo "Context was just compacted. To recover session state:"
echo "1. Use memory_search with keywords related to your current task to recall relevant decisions"
echo "2. Check beads for active issues (bd prime already ran)"
echo "3. Re-read any files you were actively editing before compaction"
echo ""

# Show codebase graph status
echo "## Indexed Codebases"
codebase-memory-mcp list-projects 2>/dev/null | head -10 || echo "codebase-memory: unavailable"
