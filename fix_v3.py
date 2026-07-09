#!/usr/bin/env python3
"""
Angular 17+ Control Flow Nuclear Fixer v3
Completely rewrites the template structure fixing:
  1. Stray } that break HTML contexts
  2. Inline @if inside step-n divs
  3. Unclosed @empty blocks
  4. Missing } at EOF
"""

import os
import re
import sys
import shutil
from pathlib import Path

# ── Configuration ──────────────────────────────────────────────
BASE_PATH = r"C:\Users\Admin\Desktop\Paymo Angular\paymo\src\app\business-portal"
DRY_RUN = False

# Files to fix (from your error log)
TARGETS = [
    "multi-currency/multi-currency.html",
    "open-banking/open-banking.html",
    "payroll-compliance/payroll-compliance.html",
    "settings-account/settings-account.html",
    "support-disputes-refunds/support-disputes-refunds.html",
    "treasury-management/treasury-management.html",
    "virtual-accounts/virtual-accounts.html",
]

# ── Helpers ────────────────────────────────────────────────────
def read_lines(p): return open(p, "r", encoding="utf-8").readlines()
def write_lines(p, ls): open(p, "w", encoding="utf-8").writelines(ls)
def indent(s): return len(s) - len(s.lstrip())

# ── Fix 1: Nuke all standalone stray } ─────────────────────────
def remove_stray_closers(lines):
    """
    Remove any line that is JUST a closing brace }
    if there is no matching @if/@for/@switch open above it.
    """
    out = []
    stack = []
    removed = 0

    for line in lines:
        s = line.strip()

        # Track opens
        if re.match(r'^@if\s*\(', s):
            stack.append('if')
        elif re.match(r'^@for\s*\(', s):
            stack.append('for')
        elif re.match(r'^@switch\s*\(', s):
            stack.append('switch')
        elif re.match(r'^\}\s*@else\s+if\s*\(', s):
            if stack and stack[-1] in ('if', 'elif'):
                stack.pop()
            stack.append('elif')
        elif re.match(r'^\}\s*@else\s*\{', s):
            if stack and stack[-1] in ('if', 'elif'):
                stack.pop()
            stack.append('else')
        elif re.match(r'^\}\s*@empty\s*\{', s):
            # @empty closes a @for, then opens empty block
            if stack and stack[-1] == 'for':
                stack.pop()
            stack.append('empty')

        # Check standalone }
        if s in ('}', '};'):
            if stack:
                # Has matching open → keep it
                stack.pop()
                out.append(line)
            else:
                # No matching open → STRAY, nuke it
                removed += 1
                continue
        else:
            out.append(line)

    return out, removed

# ── Fix 2: Inline step-n @if → block level ────────────────────
def fix_step_n_inline(lines):
    out = []
    fixed = 0
    pat = re.compile(
        r'^(.*<div\s+class="step-n"\s*>)'
        r'\s*@if\s*\(([^)]+)\)\s*\{\s*'
        r'(<i[^>]*>.*?</i>)\s*'
        r'\}\s*@else\s*\{\s*'
        r'(\{\{\s*[^}]*\}\})\s*'
        r'\}\s*'
        r'(</div>.*)$'
    )

    for line in lines:
        m = pat.match(line)
        if m:
            pre, cond, icon, interp, post = m.groups()
            sp = " " * indent(line)
            out.append(f"{pre}\n")
            out.append(f"{sp}  @if ({cond}) {{\n")
            out.append(f"{sp}    {icon.strip()}\n")
            out.append(f"{sp}  }} @else {{\n")
            out.append(f"{sp}    {interp.strip()}\n")
            out.append(f"{sp}  }}\n")
            out.append(f"{sp}{post}\n")
            fixed += 1
        else:
            out.append(line)

    return out, fixed

# ── Fix 3: Close unclosed @empty ──────────────────────────────
def close_empty_blocks(lines):
    out = []
    fixed = 0
    empty_open_line = -1

    for i, line in enumerate(lines):
        out.append(line)
        s = line.strip()

        if re.match(r'^\}\s*@empty\s*\{', s):
            empty_open_line = i
            continue

        if empty_open_line >= 0:
            # Look for </tr> which typically ends the empty content
            if s.startswith('</tr>') or s.startswith('</div>'):
                sp = " " * indent(lines[empty_open_line])
                out.append(f"{sp}}}\n")
                fixed += 1
                empty_open_line = -1

    # If still open at end of file
    if empty_open_line >= 0:
        sp = " " * indent(lines[empty_open_line])
        out.append(f"{sp}}}\n")
        fixed += 1

    return out, fixed

# ── Fix 4: Close any remaining @if at EOF ─────────────────────
def close_eof(lines):
    out = list(lines)
    stack = []

    for line in out:
        s = line.strip()
        if re.match(r'^@if\s*\(', s):
            stack.append('if')
        elif re.match(r'^@for\s*\(', s):
            stack.append('for')
        elif re.match(r'^@switch\s*\(', s):
            stack.append('switch')
        elif re.match(r'^\}\s*@else\s+if\s*\(', s):
            if stack and stack[-1] in ('if', 'elif'):
                stack.pop()
            stack.append('elif')
        elif re.match(r'^\}\s*@else\s*\{', s):
            if stack and stack[-1] in ('if', 'elif'):
                stack.pop()
            stack.append('else')
        elif re.match(r'^\}\s*@empty\s*\{', s):
            if stack and stack[-1] == 'for':
                stack.pop()
            stack.append('empty')
        elif s in ('}', '};'):
            if stack:
                stack.pop()

    added = 0
    for _ in stack:
        out.append("}\n")
        added += 1

    return out, added

# ── Fix 5: Remove @empty block entirely if it keeps breaking ──
def nuke_broken_empty(lines):
    """
    If an @empty block exists but has no opening @for above it,
    remove the @empty line entirely.
    """
    out = []
    nuked = 0
    stack = []

    for line in lines:
        s = line.strip()

        if re.match(r'^@if\s*\(', s):
            stack.append('if')
        elif re.match(r'^@for\s*\(', s):
            stack.append('for')
        elif re.match(r'^@switch\s*\(', s):
            stack.append('switch')
        elif re.match(r'^\}\s*@else\s+if\s*\(', s):
            if stack and stack[-1] in ('if', 'elif'):
                stack.pop()
            stack.append('elif')
        elif re.match(r'^\}\s*@else\s*\{', s):
            if stack and stack[-1] in ('if', 'elif'):
                stack.pop()
            stack.append('else')

        # Check @empty
        if re.match(r'^\}\s*@empty\s*\{', s):
            if not stack or stack[-1] != 'for':
                # No @for above → nuke this line
                nuked += 1
                continue
            else:
                stack.pop()
                stack.append('empty')

        if s in ('}', '};'):
            if stack:
                stack.pop()

        out.append(line)

    return out, nuked

# ── Process one file ──────────────────────────────────────────
def process(filepath):
    name = Path(filepath).name
    parent = Path(filepath).parent.name
    print(f"\n{'='*60}")
    print(f"  {parent}/{name}")
    print(f"{'='*60}")

    lines = read_lines(filepath)
    orig = len(lines)

    # Pipeline
    lines, n1 = remove_stray_closers(lines)
    if n1: print(f"  [-] Removed {n1} stray closing braces")

    lines, n2 = nuke_broken_empty(lines)
    if n2: print(f"  [-] Nuked {n2} orphaned @empty blocks")

    lines, n3 = fix_step_n_inline(lines)
    if n3: print(f"  [~] Fixed {n3} inline step-n @if patterns")

    lines, n4 = close_empty_blocks(lines)
    if n4: print(f"  [+] Closed {n4} @empty blocks")

    lines, n5 = close_eof(lines)
    if n5: print(f"  [+] Added {n5} closing braces at EOF")

    total = n1 + n2 + n3 + n4 + n5
    if total == 0:
        print("  ✅ No issues found")
        return

    print(f"  Total changes: {total} | Lines: {orig} → {len(lines)}")

    if DRY_RUN:
        print("  ⚠ DRY RUN - no file written")
    else:
        shutil.copy2(filepath, filepath + ".bak")
        write_lines(filepath, lines)
        print("  ✅ File written (backup → .bak)")

# ── Main ──────────────────────────────────────────────────────
def main():
    global DRY_RUN
    if "--dry" in sys.argv:
        DRY_RUN = True

    base = Path(BASE_PATH)
    if not base.exists():
        print(f"ERROR: {BASE_PATH} not found")
        sys.exit(1)

    print("=" * 60)
    print("  ANGULAR CONTROL FLOW NUCLEAR FIXER v3")
    print(f"  Mode: {'DRY RUN' if DRY_RUN else 'LIVE'}")
    print(f"  Files: {len(TARGETS)}")
    print("=" * 60)

    for rel in TARGETS:
        p = base / rel
        if p.exists():
            process(str(p))
        else:
            print(f"\n⚠ NOT FOUND: {p}")

    print(f"\n{'='*60}")
    print("  DONE")
    print("=" * 60)

if __name__ == "__main__":
    main()