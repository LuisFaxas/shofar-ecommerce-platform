/**
 * Contrast Checker Utility
 * WCAG AA/AAA compliance validation
 * Work Order 2.5.2 - Accessibility Guardrails
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Calculate relative luminance
 * WCAG formula: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928
      ? val / 12.92
      : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard
 * Normal text: 4.5:1
 * Large text (18px+): 3:1
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard
 * Normal text: 7:1
 * Large text (18px+): 4.5:1
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Test suite for button contrast
 */
export interface ContrastTestResult {
  component: string;
  state: string;
  foreground: string;
  background: string;
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
}

/**
 * Run contrast tests for TOOLY button components
 */
export function runButtonContrastTests(): ContrastTestResult[] {
  const results: ContrastTestResult[] = [];

  // ButtonPrimary - Brand Orange
  const primaryTests = [
    { state: 'default', fg: '#FFFFFF', bg: '#FF6B35' },
    { state: 'hover', fg: '#FFFFFF', bg: '#FF5722' },
    { state: 'active', fg: '#FFFFFF', bg: '#F4511E' }
  ];

  primaryTests.forEach(test => {
    const ratio = getContrastRatio(test.fg, test.bg);
    results.push({
      component: 'ButtonPrimary',
      state: test.state,
      foreground: test.fg,
      background: test.bg,
      ratio: parseFloat(ratio.toFixed(2)),
      meetsAA: meetsWCAGAA(test.fg, test.bg),
      meetsAAA: meetsWCAGAAA(test.fg, test.bg)
    });
  });

  // ButtonSecondary - Glass on dark background
  // Note: Glass buttons rely on backdrop, testing against surface-bg
  const secondaryTests = [
    { state: 'default', fg: '#FFFFFF', bg: '#0b0e14' }, // Text on gunmetal
    { state: 'hover', fg: '#FFFFFF', bg: '#0d1218' }
  ];

  secondaryTests.forEach(test => {
    const ratio = getContrastRatio(test.fg, test.bg);
    results.push({
      component: 'ButtonSecondary',
      state: test.state,
      foreground: test.fg,
      background: test.bg,
      ratio: parseFloat(ratio.toFixed(2)),
      meetsAA: meetsWCAGAA(test.fg, test.bg),
      meetsAAA: meetsWCAGAAA(test.fg, test.bg)
    });
  });

  // ButtonDestructive - Error Red
  const destructiveTests = [
    { state: 'default', fg: '#FFFFFF', bg: '#ef4444' },
    { state: 'hover', fg: '#FFFFFF', bg: '#dc2626' },
    { state: 'active', fg: '#FFFFFF', bg: '#b91c1c' }
  ];

  destructiveTests.forEach(test => {
    const ratio = getContrastRatio(test.fg, test.bg);
    results.push({
      component: 'ButtonDestructive',
      state: test.state,
      foreground: test.fg,
      background: test.bg,
      ratio: parseFloat(ratio.toFixed(2)),
      meetsAA: meetsWCAGAA(test.fg, test.bg),
      meetsAAA: meetsWCAGAAA(test.fg, test.bg)
    });
  });

  return results;
}

/**
 * Format test results for console output
 */
export function formatContrastResults(results: ContrastTestResult[]): string {
  let output = '\n===== WCAG Contrast Test Results =====\n\n';

  results.forEach(result => {
    const status = result.meetsAA ? '✅' : '❌';
    const aaaStatus = result.meetsAAA ? '(AAA)' : '';

    output += `${status} ${result.component} - ${result.state}\n`;
    output += `   Ratio: ${result.ratio}:1 ${aaaStatus}\n`;
    output += `   FG: ${result.foreground} | BG: ${result.background}\n`;
    output += `   AA: ${result.meetsAA ? 'PASS' : 'FAIL'} | AAA: ${result.meetsAAA ? 'PASS' : 'FAIL'}\n\n`;
  });

  const passed = results.filter(r => r.meetsAA).length;
  const total = results.length;

  output += `===== Summary: ${passed}/${total} tests passed WCAG AA =====\n`;

  return output;
}

// Export default test runner
export default function testButtonContrast(): void {
  const results = runButtonContrastTests();
  console.log(formatContrastResults(results));

  // Throw error if any test fails
  const failures = results.filter(r => !r.meetsAA);
  if (failures.length > 0) {
    throw new Error(
      `Contrast test failed: ${failures.length} component(s) do not meet WCAG AA standards`
    );
  }
}