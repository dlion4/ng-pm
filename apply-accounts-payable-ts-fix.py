#!/usr/bin/env python3
from pathlib import Path
import re

root = Path('src/app/business-portal/accounts-payable')
if not root.exists():
    root = Path('.')

ts_files = list(root.rglob('accounts-payable.ts')) if root.is_dir() else []
html_files = list(root.rglob('accounts-payable.html')) if root.is_dir() else []

# Also support running directly inside the component folder.
if Path('accounts-payable.ts').exists():
    ts_files.append(Path('accounts-payable.ts'))
if Path('accounts-payable.html').exists():
    html_files.append(Path('accounts-payable.html'))

def add_prop_to_object_type(source: str, type_name: str, prop_line: str) -> str:
    """Adds prop_line to interface/type object by brace matching, robust to one-line interfaces."""
    # interface QuickAction { ... }
    for pattern in [rf'(export\s+)?interface\s+{type_name}\s*\{{', rf'(export\s+)?type\s+{type_name}\s*=\s*\{{']:
        m = re.search(pattern, source)
        if not m:
            continue
        open_idx = source.find('{', m.start())
        depth = 0
        close_idx = -1
        for i in range(open_idx, len(source)):
            if source[i] == '{':
                depth += 1
            elif source[i] == '}':
                depth -= 1
                if depth == 0:
                    close_idx = i
                    break
        if close_idx == -1:
            continue
        block = source[open_idx + 1:close_idx]
        prop_name = prop_line.split(':', 1)[0].replace('?', '').strip()
        if re.search(rf'\b{re.escape(prop_name)}\??\s*:', block):
            return source
        insertion = ('\n  ' + prop_line.rstrip(';') + ';')
        if block.strip() and not block.endswith('\n'):
            insertion = insertion + '\n'
        return source[:close_idx] + insertion + source[close_idx:]
    return source

for ts in sorted(set(ts_files)):
    s = ts.read_text(encoding='utf-8', errors='ignore')
    original = s
    s = add_prop_to_object_type(s, 'QuickAction', 'modalId?: string')
    # expenseClaims actionModal is optional in your current model; make it non-failing in template by keeping TS flexible too.
    s = add_prop_to_object_type(s, 'ExpenseClaim', 'actionModal?: string')
    s = add_prop_to_object_type(s, 'ExpenseClaim', 'actionLabel?: string')
    if s != original:
        ts.write_text(s, encoding='utf-8')
        print(f'patched TS: {ts}')
    else:
        print(f'no TS change needed or QuickAction not found: {ts}')

for html in sorted(set(html_files)):
    s = html.read_text(encoding='utf-8', errors='ignore')
    original = s
    s = s.replace('openModal(claim.actionModal)', "openModal(claim.actionModal || 'expenseClaimModal')")
    # keep modalId usage, now valid after TS patch; fallback handles blank data.
    s = s.replace("openModal(action.modalId)", "openModal(action.modalId || 'genericActionModal')")
    s = s.replace("openModal(item.modalId)", "openModal(item.modalId || 'genericActionModal')")
    if s != original:
        html.write_text(s, encoding='utf-8')
        print(f'patched HTML: {html}')
    else:
        print(f'no HTML change needed: {html}')
