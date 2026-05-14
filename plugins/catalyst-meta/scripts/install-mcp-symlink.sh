#!/usr/bin/env bash
# Symlink ~/.mcp.json -> this plugin's .mcp.json so the bundled MCP servers
# load globally (every Claude Code session), not just when this plugin is enabled.
#
# Usage:
#   ./scripts/install-mcp-symlink.sh           # link the source-tree .mcp.json
#   ./scripts/install-mcp-symlink.sh --uninstall   # restore from backup if present

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE="$PLUGIN_ROOT/.mcp.json"
TARGET="$HOME/.mcp.json"
BACKUP="$HOME/.mcp.json.pre-catalyst-meta"

if [[ "${1:-}" == "--uninstall" ]]; then
  if [[ -L "$TARGET" ]]; then
    rm "$TARGET"
    echo "removed symlink: $TARGET"
  fi
  if [[ -f "$BACKUP" ]]; then
    mv "$BACKUP" "$TARGET"
    echo "restored backup: $TARGET"
  fi
  exit 0
fi

if [[ ! -f "$SOURCE" ]]; then
  echo "error: source .mcp.json not found at $SOURCE" >&2
  exit 1
fi

# Already a symlink pointing where we want? Nothing to do.
if [[ -L "$TARGET" ]] && [[ "$(readlink "$TARGET")" == "$SOURCE" ]]; then
  echo "already linked: $TARGET -> $SOURCE"
  exit 0
fi

# Existing file/dir/symlink -> back it up
if [[ -e "$TARGET" || -L "$TARGET" ]]; then
  if [[ -e "$BACKUP" ]]; then
    echo "error: backup already exists at $BACKUP — refusing to overwrite" >&2
    echo "       move or remove it, then re-run" >&2
    exit 1
  fi
  mv "$TARGET" "$BACKUP"
  echo "backed up existing: $TARGET -> $BACKUP"
fi

ln -s "$SOURCE" "$TARGET"
echo "linked: $TARGET -> $SOURCE"
echo ""
echo "Remember: ensure OPENAI_API_KEY is exported in your shell (this file references it as \${OPENAI_API_KEY})."
