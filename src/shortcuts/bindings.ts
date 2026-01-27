/**
 * Default Key Bindings
 * 
 * Default keyboard shortcuts for claude-recall.
 */

import type { KeyBinding } from './KeyboardManager.js';

export const defaultBindings: KeyBinding[] = [
  // Navigation
  {
    key: 'j',
    action: 'navigate.next',
    description: 'Next item',
    category: 'Navigation',
  },
  {
    key: 'k',
    action: 'navigate.previous',
    description: 'Previous item',
    category: 'Navigation',
  },
  {
    key: 'g',
    action: 'navigate.top',
    description: 'Go to top',
    category: 'Navigation',
  },
  {
    key: 'G',
    shift: true,
    action: 'navigate.bottom',
    description: 'Go to bottom',
    category: 'Navigation',
  },
  {
    key: 'Enter',
    action: 'navigate.open',
    description: 'Open selected item',
    category: 'Navigation',
  },
  {
    key: 'Escape',
    action: 'navigate.close',
    description: 'Close / Go back',
    category: 'Navigation',
  },

  // Search
  {
    key: '/',
    action: 'search.focus',
    description: 'Focus search',
    category: 'Search',
  },
  {
    key: 'f',
    ctrl: true,
    action: 'search.focus',
    description: 'Focus search',
    category: 'Search',
  },
  {
    key: 'n',
    action: 'search.next',
    description: 'Next search result',
    category: 'Search',
  },
  {
    key: 'N',
    shift: true,
    action: 'search.previous',
    description: 'Previous search result',
    category: 'Search',
  },

  // Actions
  {
    key: 's',
    action: 'action.star',
    description: 'Star / Unstar item',
    category: 'Actions',
  },
  {
    key: 'e',
    action: 'action.export',
    description: 'Export item',
    category: 'Actions',
  },
  {
    key: 'c',
    action: 'action.copy',
    description: 'Copy to clipboard',
    category: 'Actions',
  },
  {
    key: 'd',
    action: 'action.delete',
    description: 'Delete item',
    category: 'Actions',
  },
  {
    key: 't',
    action: 'action.tag',
    description: 'Add tag',
    category: 'Actions',
  },

  // Views
  {
    key: '1',
    action: 'view.timeline',
    description: 'Timeline view',
    category: 'Views',
  },
  {
    key: '2',
    action: 'view.sessions',
    description: 'Sessions view',
    category: 'Views',
  },
  {
    key: '3',
    action: 'view.favorites',
    description: 'Favorites view',
    category: 'Views',
  },
  {
    key: '4',
    action: 'view.stats',
    description: 'Statistics view',
    category: 'Views',
  },

  // Filters
  {
    key: 'p',
    action: 'filter.project',
    description: 'Filter by project',
    category: 'Filters',
  },
  {
    key: 'y',
    action: 'filter.type',
    description: 'Filter by type',
    category: 'Filters',
  },
  {
    key: 'r',
    action: 'filter.dateRange',
    description: 'Filter by date range',
    category: 'Filters',
  },
  {
    key: 'x',
    action: 'filter.clear',
    description: 'Clear all filters',
    category: 'Filters',
  },

  // UI
  {
    key: '?',
    shift: true,
    action: 'ui.help',
    description: 'Show keyboard shortcuts',
    category: 'UI',
  },
  {
    key: ',',
    action: 'ui.settings',
    description: 'Open settings',
    category: 'UI',
  },
  {
    key: 'l',
    action: 'ui.toggleTheme',
    description: 'Toggle light/dark theme',
    category: 'UI',
  },
  {
    key: 'r',
    ctrl: true,
    action: 'ui.refresh',
    description: 'Refresh data',
    category: 'UI',
  },

  // Expand/Collapse
  {
    key: 'o',
    action: 'expand.toggle',
    description: 'Toggle expand/collapse',
    category: 'Expand',
  },
  {
    key: 'O',
    shift: true,
    action: 'expand.all',
    description: 'Expand all',
    category: 'Expand',
  },
  {
    key: 'z',
    action: 'expand.collapseAll',
    description: 'Collapse all',
    category: 'Expand',
  },
];

/**
 * Get bindings for a specific category
 */
export function getBindingsByCategory(category: string): KeyBinding[] {
  return defaultBindings.filter(b => b.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  for (const binding of defaultBindings) {
    if (binding.category) {
      categories.add(binding.category);
    }
  }
  return Array.from(categories);
}

/**
 * Find binding by action
 */
export function findBindingByAction(action: string): KeyBinding | undefined {
  return defaultBindings.find(b => b.action === action);
}

/**
 * Format binding for display
 */
export function formatBinding(binding: KeyBinding): string {
  const parts: string[] = [];

  if (binding.ctrl) parts.push('Ctrl');
  if (binding.alt) parts.push('Alt');
  if (binding.shift) parts.push('Shift');
  if (binding.meta) parts.push('⌘');

  // Format special keys
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    'Enter': '↵',
    'Escape': 'Esc',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
  };

  parts.push(keyMap[binding.key] || binding.key.toUpperCase());

  return parts.join('+');
}
