// /src/utils/color-conversions.js
export const oklchToHexMap = {
  // Light mode colors
  'oklch(1 0 0)': '#ffffff',
  'oklch(0.129 0.042 264.695)': '#1f2937',
  'oklch(0.208 0.042 265.755)': '#1e40af',
  'oklch(0.984 0.003 247.858)': '#f9fafb',
  'oklch(0.968 0.007 247.896)': '#f3f4f6',
  'oklch(0.554 0.046 257.417)': '#6b7280',
  'oklch(0.577 0.245 27.325)': '#dc2626',
  'oklch(0.929 0.013 255.508)': '#d1d5db',
  'oklch(0.704 0.04 256.788)': '#9ca3af',
  
  // Chart colors
  'oklch(0.646 0.222 41.116)': '#ea580c',
  'oklch(0.6 0.118 184.704)': '#0d9488',
  'oklch(0.398 0.07 227.392)': '#2563eb',
  'oklch(0.828 0.189 84.429)': '#f59e0b',
  'oklch(0.769 0.188 70.08)': '#f97316',
  
  // Dark mode colors
  'oklch(0.279 0.041 260.031)': '#1e293b',
  'oklch(0.704 0.191 22.216)': '#ef4444',
  'oklch(1 0 0 / 10%)': 'rgba(255, 255, 255, 0.1)',
  'oklch(1 0 0 / 15%)': 'rgba(255, 255, 255, 0.15)',
  'oklch(0.551 0.027 264.364)': '#94a3b8',
  
  // Additional colors
  'oklch(0.488 0.243 264.376)': '#6366f1',
  'oklch(0.696 0.17 162.48)': '#14b8a6',
  'oklch(0.627 0.265 303.9)': '#a855f7',
  'oklch(0.645 0.246 16.439)': '#f43f5e'
};

// Utility function to convert oklch to hex
export const convertOklchToHex = (oklchValue) => {
  return oklchToHexMap[oklchValue] || oklchValue; // Returns original if not found
};