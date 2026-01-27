# Basic Setup Example

This guide walks you through setting up claude-recall for the first time.

## Prerequisites

- Node.js 18+ or Bun 1.0+
- Claude Code installed and authenticated

## Installation

```bash
# Install via Claude Code plugin marketplace
/plugin marketplace add nhevers/claude-recall
/plugin install claude-recall
```

## Configuration

Create a settings file at `~/.claude-recall/settings.json`:

```json
{
  "CLAUDE_RECALL_PROVIDER": "claude",
  "CLAUDE_RECALL_MODE": "code",
  "CLAUDE_RECALL_WORKER_PORT": 37777
}
```

## Verify Installation

```bash
# Check worker status
claude-recall status

# View web interface
open http://localhost:37777
```

## First Session

1. Start a new Claude Code session
2. Work on your project as usual
3. When you end the session, claude-recall automatically captures observations
4. View your session history at `http://localhost:37777`

## Troubleshooting

### Worker not starting

```bash
# Check logs
tail -f ~/.claude-recall/logs/worker-$(date +%Y-%m-%d).log

# Restart worker
claude-recall restart
```

### Port already in use

Change the port in settings:

```json
{
  "CLAUDE_RECALL_WORKER_PORT": 37778
}
```

## Next Steps

- [Custom Modes](../custom-modes/README.md) - Create custom observation modes
- [API Usage](../api-usage/README.md) - Use the HTTP API directly
