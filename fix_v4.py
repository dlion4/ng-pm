#!/usr/bin/env python3
"""
Angular 17+ Control Flow FINAL Fixer v4
Fixes the remaining cascading errors:
  1. Stray } with whitespace (previous script missed indented ones)
  2. Inline @if in step-n divs
  3. @empty blocks with no parent @for
  4. Missing } at EOF
"""

import os
import re
import sys
import shutil
from pathlib import Path

BASE_PATH = r"C:\Users\Admin\Desktop\Paymo Angular\paymo\src\app\business-portal"
DRY_RUN = False

TARGETS = [
    "support-disputes-refunds/support-disputes-refunds.html",
    "treasury-management/treasury-management.html",
    "virtual-accounts/virtual-accounts.html",
]

def read_lines(p): return open(p, "r", encoding="utf-8").readlines()
def write_lines(p, ls): open(p, "w", encoding="utf-8").writelines(ls)
def ind(s): return len(s) - len(s.lstrip())

def process(filepath):
    name = Path(filepath).name
    print(f"\n{'='*60}")
    print(f"  Fixing: {name}")
    print(f"{'='*60}")
    
    lines = read_lines(filepath)
    out = []
    stack = []
    removed = 0
    fixed_steps = 0
    nuked_empty = 0

    for line in lines:
        s = line.strip()

        # 1. Fix inline step-n @if BEFORE pushing to stack
        step_pat = re.compile(
            r'^(.*<div\s+class="step-n"\s*>)\s*@if\s*\(([^)]+)\)\s*\{\s*(<i[^>]*>.*?</i>)\s*\}\s*@else\s*\{\s*(\{\{\s*[^}]*\}\})\s*\}\s*(</div>.*)$'
        )
        m = step_pat.match(line)
        if m:
            pre, cond, icon, interp, post = m.groups()
            sp = " " * ind(line)
            out.append(f"{pre}\n")
            out.append(f"{sp}  @if ({cond}) {{\n")
            out.append(f"{sp}    {icon.strip()}\n")
            out.append(f"{sp}  }} @else {{\n")
            out.append(f"{sp}    {interp.strip()}\n")
            out.append(f"{sp}  }}\n")
            out.append(f"{sp}{post}\n")
            fixed_steps += 1
            continue

        # 2. Nuke orphaned @empty (no @for on stack)
        if re.match(r'^\}\s*@empty\s*\{', s):
            if not stack or stack[-1] != 'for':
                nuked_empty += 1
                continue
            else:
                if stack and stack[-1] == 'for': stack.pop()
                stack.append('empty')
                out.append(line)
                continue

        # 3. Track opens
        if re.match(r'^@if\s*\(', s):
            stack.append('if')
            out.append(line)
            continue
        if re.match(r'^@for\s*\(', s):
            stack.append('for')
            out.append(line)
            continue
        if re.match(r'^@switch\s*\(', s):
            stack.append('switch')
            out.append(line)
            continue
        
        # 4. Track else/elif
        if re.match(r'^\}\s*@else\s+if\s*\(', s):
            if stack and stack[-1] in ('if', 'elif'): stack.pop()
            stack.append('elif')
            out.append(line)
            continue
        if re.match(r'^\}\s*@else\s*\{', s):
            if stack and stack[-1] in ('if', 'elif'): stack.pop()
            stack.append('else')
            out.append(line)
            continue

        # 5. Handle standalone } (WITH OR WITHOUT INDENTATION)
        if re.match(r'^\s*\}\s*$', s):
            if stack:
                stack.pop()
                out.append(line)
            else:
                removed += 1
            continue

        out.append(line)

    # 6. Close any remaining open blocks at EOF
    added = 0
    for _ in stack:
        out.append("}\n")
        added += 1

    total = removed + fixed_steps + nuked_empty + added
    if total == 0:
        print("  ✅ No issues found")
        return

    if removed: print(f"  [-] Removed {removed} stray closing braces")
    if nuked_empty: print(f"  [-] Nuked {nuked_empty} orphaned @empty blocks")
    if fixed_steps: print(f"  [~] Fixed {fixed_steps} inline step-n @if")
    if added: print(f"  [+] Added {added} closing braces at EOF")

    if DRY_RUN:
        print("  ⚠ DRY RUN")
    else:
        shutil.copy2(filepath, filepath + ".bak")
        write_lines(filepath, out)
        print("  ✅ Written (backup → .bak)")

def main():
    global DRY_RUN
    if "--dry" in sys.argv: DRY_RUN = True

    base = Path(BASE_PATH)
    print("=" * 60)
    print("  ANGULAR CONTROL FLOW FIXER v4")
    print(f"  Mode: {'DRY RUN' if DRY_RUN else 'LIVE'}")
    print("=" * 60)

    for rel in TARGETS:
        p = base / rel
        if p.exists():
            process(str(p))
        else:
            print(f"\n⚠ NOT FOUND: {p}")

    print(f"\n{'='*60}\n  DONE\n{'='*60}")

if __name__ == "__main__":
    main()