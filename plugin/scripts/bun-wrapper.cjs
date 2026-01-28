#!/usr/bin/env node
/**
 * Bun Wrapper - Finds bun executable and runs command
 * 
 * This wrapper ensures bun can be found even when not in PATH.
 * Used by hooks when Claude Code's environment doesn't have bun in PATH.
 */

const { spawnSync, execSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');
const { homedir } = require('os');

const IS_WINDOWS = process.platform === 'win32';

/**
 * Get the Bun executable path (from PATH or common install locations)
 */
function getBunPath() {
  // Try PATH first
  try {
    const result = spawnSync('bun', ['--version'], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: IS_WINDOWS
    });
    if (result.status === 0) return 'bun';
  } catch {
    // Not in PATH
  }

  // Check common installation paths
  const bunPaths = IS_WINDOWS
    ? [join(homedir(), '.bun', 'bin', 'bun.exe')]
    : [join(homedir(), '.bun', 'bin', 'bun'), '/usr/local/bin/bun', '/opt/homebrew/bin/bun'];

  for (const bunPath of bunPaths) {
    if (existsSync(bunPath)) return bunPath;
  }

  return null;
}

// Get bun path and execute command
const bunPath = getBunPath();
if (!bunPath) {
  console.error('❌ Bun not found. Please install Bun:');
  if (IS_WINDOWS) {
    console.error('   powershell -c "irm bun.sh/install.ps1 | iex"');
  } else {
    console.error('   curl -fsSL https://bun.sh/install | bash');
  }
  process.exit(1);
}

// Get all arguments after the script name
const args = process.argv.slice(2);

// Quote bun path if it contains spaces (Windows)
const bunCmd = IS_WINDOWS && bunPath.includes(' ') ? `"${bunPath}"` : bunPath;

// Execute bun with the provided arguments
const result = spawnSync(bunCmd, args, {
  stdio: 'inherit',
  shell: IS_WINDOWS
});

process.exit(result.status || 0);
