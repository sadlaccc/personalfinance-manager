import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(process.cwd(), 'src');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

describe('no orphaned financials artifacts', () => {
  const files = walk(SRC);

  it('removed files do not exist', () => {
    expect(existsSync(join(SRC, 'components/UserFinancialsDialog.tsx'))).toBe(false);
    expect(existsSync(join(SRC, 'hooks/useAdminUserFinancials.ts'))).toBe(false);
  });

  it('no source file imports the removed financials modules', () => {
    const offenders: string[] = [];
    const bad = /from\s+['"][^'"]*(UserFinancialsDialog|useAdminUserFinancials)['"]/;
    for (const f of files) {
      if (bad.test(readFileSync(f, 'utf8'))) offenders.push(relative(SRC, f));
    }
    expect(offenders, `Found stale imports in:\n${offenders.join('\n')}`).toEqual([]);
  });

  it('no source file references removed financials symbols or routes', () => {
    const offenders: { file: string; match: string }[] = [];
    // Skip this test file and the sidebar test (which intentionally asserts on the strings).
    const skip = new Set([
      join(SRC, 'test/no-financials-orphans.test.ts'),
      join(SRC, 'components/__tests__/AppSidebar.test.tsx'),
    ]);
    const patterns = [
      /UserFinancialsDialog/,
      /useAdminUserFinancials/,
      /financialsDialogOpen/,
      /setFinancialsDialogOpen/,
      /\/user-financials/,
    ];
    for (const f of files) {
      if (skip.has(f)) continue;
      const src = readFileSync(f, 'utf8');
      for (const p of patterns) {
        const m = src.match(p);
        if (m) offenders.push({ file: relative(SRC, f), match: m[0] });
      }
    }
    expect(
      offenders,
      `Dead financials references:\n${offenders.map((o) => `${o.file}: ${o.match}`).join('\n')}`,
    ).toEqual([]);
  });
});
