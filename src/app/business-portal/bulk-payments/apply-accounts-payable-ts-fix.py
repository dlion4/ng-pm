#!/usr/bin/env python3
from pathlib import Path
import re

root = Path('src/app/business-portal') if Path('src/app/business-portal').exists() else Path('.')

# 1) accounts-payable QuickAction modalId TS2353 fix
for p in root.rglob('accounts-payable.ts'):
    s = p.read_text(encoding='utf-8', errors='ignore')
    original = s
    # Add modalId to QuickAction interface if missing.
    m = re.search(r'interface\s+QuickAction\s*\{(?P<body>.*?)\n\}', s, flags=re.S)
    if m and 'modalId' not in m.group('body'):
        body = m.group('body').rstrip() + "\n  modalId?: string;"
        s = s[:m.start('body')] + body + s[m.end('body'):]
    # If QuickAction is a type alias object instead of interface.
    m = re.search(r'type\s+QuickAction\s*=\s*\{(?P<body>.*?)\n\}', s, flags=re.S)
    if m and 'modalId' not in m.group('body'):
        body = m.group('body').rstrip() + "\n  modalId?: string;"
        s = s[:m.start('body')] + body + s[m.end('body'):]
    if s != original:
        p.write_text(s, encoding='utf-8')
        print('patched', p)

# 2) multi-currency malformed notify expression fix if still present
for p in root.rglob('multi-currency.html'):
    s = p.read_text(encoding='utf-8', errors='ignore')
    original = s
    s = re.sub(r'activatePill\(\$event\);\s*notify\(\'Action handled: this\.classList\.add\(\'active\'\)\'\)', 'activatePill($event)', s)
    s = s.replace("notify('Action handled: this.classList.add('active')')", "notify('Action handled')")
    if s != original:
        p.write_text(s, encoding='utf-8')
        print('patched', p)
