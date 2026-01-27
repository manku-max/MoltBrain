/**
 * Light Theme
 * 
 * Light theme for claude-recall.
 */

import type { Theme } from './ThemeManager.js';

export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  mode: 'light',
  colors: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f6f8fa',
    bgTertiary: '#eaeef2',
    textPrimary: '#1f2328',
    textSecondary: '#656d76',
    textMuted: '#8c959f',
    borderColor: '#d0d7de',
    borderLight: '#eaeef2',
    accentPrimary: '#0969da',
    accentSecondary: '#218bff',
    accentSuccess: '#1a7f37',
    accentWarning: '#9a6700',
    accentError: '#cf222e',
    accentInfo: '#8250df',
  },
  customCss: `
    /* Light theme specific styles */
    
    /* Observation type colors */
    .observation-type-discovery { color: #0969da; }
    .observation-type-decision { color: #8250df; }
    .observation-type-implementation { color: #1a7f37; }
    .observation-type-issue { color: #cf222e; }
    .observation-type-learning { color: #9a6700; }
    .observation-type-reference { color: #218bff; }
    
    /* Code blocks */
    pre, code {
      background: #f6f8fa;
      border: 1px solid #d0d7de;
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f6f8fa;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #d0d7de;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #afb8c1;
    }
    
    /* Selection */
    ::selection {
      background: #ddf4ff;
      color: #1f2328;
    }
    
    /* Focus states */
    *:focus-visible {
      outline: 2px solid #0969da;
      outline-offset: 2px;
    }
    
    /* Links */
    a {
      color: #0969da;
    }
    
    a:hover {
      color: #218bff;
    }
    
    /* Buttons */
    .btn-primary {
      background: #1f883d;
      color: #ffffff;
    }
    
    .btn-primary:hover {
      background: #1a7f37;
    }
    
    .btn-secondary {
      background: #f6f8fa;
      color: #1f2328;
      border: 1px solid #d0d7de;
    }
    
    .btn-secondary:hover {
      background: #eaeef2;
    }
    
    /* Cards */
    .card {
      background: #ffffff;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(31, 35, 40, 0.04);
    }
    
    .card:hover {
      border-color: #afb8c1;
    }
    
    /* Inputs */
    input, textarea, select {
      background: #ffffff;
      border: 1px solid #d0d7de;
      color: #1f2328;
    }
    
    input:focus, textarea:focus, select:focus {
      border-color: #0969da;
      box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
    }
    
    /* Tables */
    table {
      border-collapse: collapse;
    }
    
    th, td {
      border: 1px solid #d0d7de;
      padding: 8px 12px;
    }
    
    th {
      background: #f6f8fa;
    }
    
    tr:hover {
      background: #f6f8fa;
    }
    
    /* Shadows for depth */
    .shadow-sm {
      box-shadow: 0 1px 2px rgba(31, 35, 40, 0.04);
    }
    
    .shadow-md {
      box-shadow: 0 3px 6px rgba(31, 35, 40, 0.08);
    }
    
    .shadow-lg {
      box-shadow: 0 8px 24px rgba(31, 35, 40, 0.12);
    }
  `,
};
