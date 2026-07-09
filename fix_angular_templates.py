#!/usr/bin/env python3
"""
Angular Template Control Flow Fixer
Fixes unclosed @if/@else/@for/@switch blocks and TypeScript interface issues
"""

import os
import re
from pathlib import Path
from typing import List, Tuple, Optional
from dataclasses import dataclass

# Configuration
BUSINESS_PORTAL_PATH = r"C:\Users\Admin\Desktop\Paymo Angular\paymo\src\app\business-portal"
DRY_RUN = False  # Set to True to see changes without applying them


@dataclass
class BlockInfo:
    block_type: str  # 'if', 'else', 'else if', 'for', 'switch', 'case', 'default'
    line_num: int
    line_content: str
    expects_closing: bool = True


class AngularTemplateFixer:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.lines: List[str] = []
        self.fixed_lines: List[str] = []
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.fixes_applied: List[str] = []
        
    def read_file(self) -> bool:
        """Read file content into lines"""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.lines = f.readlines()
            return True
        except Exception as e:
            self.errors.append(f"Failed to read file: {e}")
            return False
    
    def write_file(self) -> bool:
        """Write fixed content back to file"""
        if DRY_RUN:
            print(f"\n[DRY RUN] Would write to: {self.file_path}")
            return True
        try:
            with open(self.file_path, 'w', encoding='utf-8') as f:
                f.writelines(self.fixed_lines)
            return True
        except Exception as e:
            self.errors.append(f"Failed to write file: {e}")
            return False
    
    def is_control_flow_start(self, line: str) -> Optional[Tuple[str, bool]]:
        """Check if line starts a control flow block"""
        stripped = line.strip()
        
        # @if (condition) {
        if re.match(r'^@if\s*\(', stripped):
            return ('if', True)
        
        # @for (item of items; track item.id) {
        if re.match(r'^@for\s*\(', stripped):
            return ('for', True)
        
        # @switch (expression) {
        if re.match(r'^@switch\s*\(', stripped):
            return ('switch', True)
        
        # @case (value) {
        if re.match(r'^@case\s*\(', stripped):
            return ('case', True)
        
        # @default {
        if re.match(r'^@default\s*\{', stripped):
            return ('default', True)
        
        return None
    
    def is_control_flow_continuation(self, line: str) -> Optional[str]:
        """Check if line is @else or @else if"""
        stripped = line.strip()
        
        if re.match(r'^\}\s*@else\s+if\s*\(', stripped):
            return 'else if'
        if re.match(r'^\}\s*@else\s*\{', stripped):
            return 'else'
        
        return None
    
    def is_standalone_closing_brace(self, line: str) -> bool:
        """Check if line is just a closing brace"""
        stripped = line.strip()
        return stripped == '}' or stripped == '};'
    
    def find_unclosed_blocks(self) -> List[BlockInfo]:
        """Find all unclosed control flow blocks"""
        block_stack: List[BlockInfo] = []
        unclosed: List[BlockInfo] = []
        
        for i, line in enumerate(self.lines):
            line_num = i + 1
            stripped = line.strip()
            
            # Check for control flow start
            start = self.is_control_flow_start(stripped)
            if start:
                block_type, expects_closing = start
                block_stack.append(BlockInfo(
                    block_type=block_type,
                    line_num=line_num,
                    line_content=stripped,
                    expects_closing=expects_closing
                ))
                continue
            
            # Check for @else/@else if (these close previous if/else if)
            continuation = self.is_control_flow_continuation(stripped)
            if continuation:
                # Pop the previous if/else if block
                if block_stack and block_stack[-1].block_type in ('if', 'else if'):
                    block_stack.pop()
                # Push the new continuation
                block_stack.append(BlockInfo(
                    block_type=continuation,
                    line_num=line_num,
                    line_content=stripped,
                    expects_closing=True
                ))
                continue
            
            # Check for closing brace that might close a control flow block
            if self.is_standalone_closing_brace(stripped):
                if block_stack:
                    # Find the innermost block that expects closing
                    for j in range(len(block_stack) - 1, -1, -1):
                        if block_stack[j].expects_closing:
                            block_stack.pop(j)
                            break
        
        # Any remaining blocks are unclosed
        unclosed = block_stack.copy()
        return unclosed
    
    def fix_template(self) -> bool:
        """Main method to fix template issues"""
        if not self.read_file():
            return False
        
        self.fixed_lines = self.lines.copy()
        unclosed_blocks = self.find_unclosed_blocks()
        
        if not unclosed_blocks:
            self.warnings.append("No unclosed control flow blocks found")
            return True
        
        print(f"\n{'='*60}")
        print(f"Fixing: {self.file_path}")
        print(f"Found {len(unclosed_blocks)} unclosed block(s)")
        print(f"{'='*60}")
        
        # Fix each unclosed block by adding closing braces
        # We need to add them in reverse order (innermost first)
        for block in reversed(unclosed_blocks):
            self.fix_unclosed_block(block)
        
        return len(self.errors) == 0
    
    def fix_unclosed_block(self, block: BlockInfo):
        """Fix a single unclosed block"""
        print(f"\n[UNCLOSED] {block.block_type.upper()} at line {block.line_num}")
        print(f"  Content: {block.line_content[:80]}...")
        
        # Strategy: Find the best place to add the closing brace
        # Look for the next block start or end of file
        insert_line = self.find_best_insertion_point(block.line_num)
        
        # Add closing brace
        self.fixed_lines.insert(insert_line, '}\n')
        self.fixes_applied.append(
            f"Added closing '}}' at line {insert_line + 1} for {block.block_type} block from line {block.line_num}"
        )
        print(f"  [FIX] Added closing '}}' at line {insert_line + 1}")
    
    def find_best_insertion_point(self, after_line: int) -> int:
        """Find the best line to insert a closing brace"""
        # Look for patterns that indicate where to insert
        for i in range(after_line, len(self.fixed_lines)):
            line = self.fixed_lines[i].strip()
            
            # If we hit another control flow start at same nesting level
            start = self.is_control_flow_start(line)
            if start:
                return i
            
            # If we hit @else/@else if
            continuation = self.is_control_flow_continuation(line)
            if continuation:
                return i
            
            # If we hit a closing div that might indicate end of section
            if line == '</div>' and i + 1 < len(self.fixed_lines):
                next_line = self.fixed_lines[i + 1].strip()
                if next_line.startswith('</div>') or next_line == '}':
                    return i + 1
        
        # Default: end of file
        return len(self.fixed_lines)


class TypeScriptInterfaceFixer:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.content: str = ""
        self.fixed_content: str = ""
        self.errors: List[str] = []
        self.fixes_applied: List[str] = []
    
    def read_file(self) -> bool:
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.content = f.read()
            return True
        except Exception as e:
            self.errors.append(f"Failed to read file: {e}")
            return False
    
    def write_file(self) -> bool:
        if DRY_RUN:
            print(f"\n[DRY RUN] Would write to: {self.file_path}")
            return True
        try:
            with open(self.file_path, 'w', encoding='utf-8') as f:
                f.write(self.fixed_content)
            return True
        except Exception as e:
            self.errors.append(f"Failed to write file: {e}")
            return False
    
    def fix_interface(self, interface_name: str, property_name: str, property_type: str = 'string') -> bool:
        """Add a missing property to an interface"""
        if not self.read_file():
            return False
        
        self.fixed_content = self.content
        
        # Find the interface
        interface_pattern = rf'(interface\s+{interface_name}\s*\{{[^}}]*)\}}'
        match = re.search(interface_pattern, self.fixed_content, re.DOTALL)
        
        if not match:
            self.errors.append(f"Interface '{interface_name}' not found")
            return False
        
        interface_body = match.group(1)
        
        # Check if property already exists
        if property_name in interface_body:
            print(f"  [SKIP] Property '{property_name}' already exists in '{interface_name}'")
            return True
        
        # Add the property before the closing brace
        new_property = f"\n  {property_name}?: {property_type};"
        new_interface = interface_body + new_property + "\n}"
        
        self.fixed_content = self.fixed_content.replace(match.group(0), new_interface)
        self.fixes_applied.append(f"Added '{property_name}?: {property_type}' to interface '{interface_name}'")
        print(f"  [FIX] Added '{property_name}?: {property_type}' to interface '{interface_name}'")
        
        return True


def fix_html_template_syntax_errors(file_path: str) -> bool:
    """Fix common HTML template syntax errors within control flow blocks"""
    fixer = AngularTemplateFixer(file_path)
    success = fixer.fix_template()
    
    if success and fixer.fixes_applied:
        if fixer.write_file():
            print(f"\n[SUCCESS] Fixed {len(fixer.fixes_applied)} issue(s)")
            for fix in fixer.fixes_applied:
                print(f"  ✓ {fix}")
        else:
            success = False
    elif fixer.warnings:
        for warning in fixer.warnings:
            print(f"  ⚠ {warning}")
    
    if fixer.errors:
        for error in fixer.errors:
            print(f"  ✗ {error}")
    
    return success


def fix_template_nested_html_issues(file_path: str) -> bool:
    """
    Fix issues where HTML elements cross control flow block boundaries
    Example: <button>...{{ condition ? 'X' : 'Y' }}</button> } @else {
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        fixes = []
        
        # Pattern 1: Fix ternary inside button that has closing issues
        # Bad: <button>...{{ cond ? 'X' : 'Y' }}</button> } @else {
        # Good: <button>...{{ cond ? 'X' : 'Y' }}</button>\n} @else {
        pattern1 = r'(<\/button>)\s*\}\s*(@else\s*\{)'
        if re.search(pattern1, content):
            content = re.sub(pattern1, r'\1\n\2', content)
            fixes.append("Fixed button closing before @else block")
        
        # Pattern 2: Fix missing closing div before control flow end
        # This is more complex and depends on context
        pattern2 = r'(<\/i>\'?\s*:\s*\'[^<]*<i[^>]*><\/i>\'?\s*\}\})\s*(<\/button>)'
        if re.search(pattern2, content):
            # The button should come after the expression closes
            pass  # This pattern is actually correct
        
        # Pattern 3: Fix @if blocks that don't have proper structure
        # Ensure every @if has { on same or next line
        lines = content.split('\n')
        new_lines = []
        i = 0
        while i < len(lines):
            line = lines[i]
            # Check if @if line doesn't end with {
            if re.match(r'^@if\s*\(', line.strip()) and not line.strip().endswith('{'):
                # Add { at the end
                line = line.rstrip() + ' {'
                fixes.append(f"Added '{{' to @if at line {i+1}")
            new_lines.append(line)
            i += 1
        content = '\n'.join(new_lines)
        
        if content != original_content:
            if not DRY_RUN:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
            print(f"\n[SYNTAX FIX] {file_path}")
            for fix in fixes:
                print(f"  ✓ {fix}")
            return True
        else:
            return False
            
    except Exception as e:
        print(f"  ✗ Error fixing syntax: {e}")
        return False


def fix_accounts_payable_specific(file_path: str) -> bool:
    """Apply specific fixes for accounts-payable component"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix the specific line 609 issue
        # The problem is likely: }} </button> should be }} </button>\n}
        # Or the ternary expression is malformed
        
        # Pattern: Fix ternary that closes button then has } @else
        bad_pattern = r"(\{\{\s*[^}]*\?\s*'[^']*<i[^>]*><\/i>'\s*:\s*'[^']*<i[^>]*><\/i>'\s*\}\})\s*(<\/button>)\s*\}\s*(@else\s*\{)"
        good_replacement = r'\1 \2\n      \3'
        
        if re.search(bad_pattern, content, re.DOTALL):
            content = re.sub(bad_pattern, good_replacement, content, flags=re.DOTALL)
            print("  ✓ Fixed ternary/button/else structure")
        
        if content != original:
            if not DRY_RUN:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
            return True
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def add_modalid_to_quickaction(file_path: str) -> bool:
    """Add modalId property to QuickAction interface"""
    fixer = TypeScriptInterfaceFixer(file_path)
    success = fixer.fix_interface('QuickAction', 'modalId', 'string')
    
    if success and fixer.fixes_applied:
        if fixer.write_file():
            for fix in fixer.fixes_applied:
                print(f"  ✓ {fix}")
        else:
            success = False
    
    if fixer.errors:
        for error in fixer.errors:
            print(f"  ✗ {error}")
    
    return success


def analyze_template_structure(file_path: str) -> dict:
    """Analyze template structure and return diagnostics"""
    result = {
        'file': file_path,
        'if_count': 0,
        'else_count': 0,
        'else_if_count': 0,
        'for_count': 0,
        'switch_count': 0,
        'closing_braces': 0,
        'issues': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        block_stack = []
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            if re.match(r'^@if\s*\(', stripped):
                result['if_count'] += 1
                block_stack.append(('if', i + 1))
            elif re.match(r'^@for\s*\(', stripped):
                result['for_count'] += 1
                block_stack.append(('for', i + 1))
            elif re.match(r'^@switch\s*\(', stripped):
                result['switch_count'] += 1
                block_stack.append(('switch', i + 1))
            elif re.match(r'^\}\s*@else\s+if\s*\(', stripped):
                result['else_if_count'] += 1
                if block_stack and block_stack[-1][0] in ('if', 'else if'):
                    block_stack.pop()
                block_stack.append(('else if', i + 1))
            elif re.match(r'^\}\s*@else\s*\{', stripped):
                result['else_count'] += 1
                if block_stack and block_stack[-1][0] in ('if', 'else if'):
                    block_stack.pop()
                block_stack.append(('else', i + 1))
            elif stripped == '}':
                result['closing_braces'] += 1
                if block_stack:
                    block_stack.pop()
        
        # Remaining blocks are unclosed
        for block_type, line_num in block_stack:
            result['issues'].append(f"Unclosed @{block_type} at line {line_num}")
        
    except Exception as e:
        result['issues'].append(f"Error analyzing: {e}")
    
    return result


def process_all_business_portal_files():
    """Process all files in business-portal directory"""
    portal_path = Path(BUSINESS_PORTAL_PATH)
    
    if not portal_path.exists():
        print(f"ERROR: Directory not found: {BUSINESS_PORTAL_PATH}")
        return
    
    print("="*70)
    print("ANGULAR TEMPLATE CONTROL FLOW FIXER")
    print(f"Target: {BUSINESS_PORTAL_PATH}")
    print(f"Dry Run: {DRY_RUN}")
    print("="*70)
    
    # Find all HTML and TS files
    html_files = list(portal_path.rglob("*.html"))
    ts_files = list(portal_path.rglob("*.ts"))
    
    print(f"\nFound {len(html_files)} HTML files and {len(ts_files)} TypeScript files")
    
    # Phase 1: Analyze all files
    print("\n" + "="*70)
    print("PHASE 1: ANALYSIS")
    print("="*70)
    
    files_with_issues = []
    
    for html_file in html_files:
        analysis = analyze_template_structure(str(html_file))
        if analysis['issues']:
            files_with_issues.append((str(html_file), analysis))
            print(f"\n❌ {html_file.name}")
            for issue in analysis['issues']:
                print(f"   - {issue}")
        else:
            print(f"✅ {html_file.name} - OK")
    
    # Phase 2: Fix HTML template issues
    print("\n" + "="*70)
    print("PHASE 2: FIXING HTML TEMPLATES")
    print("="*70)
    
    for file_path, analysis in files_with_issues:
        print(f"\nProcessing: {file_path}")
        
        # First try the general template fixer
        fix_html_template_syntax_errors(file_path)
        
        # Then try syntax-specific fixes
        fix_template_nested_html_issues(file_path)
        
        # Apply specific fixes for known problematic files
        if 'accounts-payable' in file_path:
            fix_accounts_payable_specific(file_path)
    
    # Phase 3: Fix TypeScript interface issues
    print("\n" + "="*70)
    print("PHASE 3: FIXING TYPESCRIPT INTERFACES")
    print("="*70)
    
    # Find and fix QuickAction interface
    for ts_file in ts_files:
        try:
            with open(ts_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'interface QuickAction' in content and 'modalId' not in content:
                print(f"\nProcessing: {ts_file.name}")
                add_modalid_to_quickaction(str(ts_file))
        except:
            pass
    
    # Phase 4: Verification
    print("\n" + "="*70)
    print("PHASE 4: VERIFICATION")
    print("="*70)
    
    for file_path, _ in files_with_issues:
        analysis = analyze_template_structure(file_path)
        if analysis['issues']:
            print(f"\n⚠️  {Path(file_path).name} - Still has issues:")
            for issue in analysis['issues']:
                print(f"   - {issue}")
        else:
            print(f"\n✅ {Path(file_path).name} - Fixed!")
    
    print("\n" + "="*70)
    print("DONE")
    print("="*70)


def fix_single_file(file_path: str):
    """Fix a single file"""
    print("="*60)
    print(f"FIXING SINGLE FILE: {file_path}")
    print("="*60)
    
    # Analysis
    analysis = analyze_template_structure(file_path)
    print(f"\nAnalysis:")
    print(f"  @if blocks: {analysis['if_count']}")
    print(f"  @else blocks: {analysis['else_count']}")
    print(f"  @else if blocks: {analysis['else_if_count']}")
    print(f"  @for blocks: {analysis['for_count']}")
    print(f"  Closing braces: {analysis['closing_braces']}")
    
    if analysis['issues']:
        print(f"\nIssues found:")
        for issue in analysis['issues']:
            print(f"  - {issue}")
        
        # Apply fixes
        print(f"\nApplying fixes...")
        fix_html_template_syntax_errors(file_path)
        fix_template_nested_html_issues(file_path)
        
        # Re-analyze
        print(f"\nRe-analysis:")
        new_analysis = analyze_template_structure(file_path)
        if new_analysis['issues']:
            print(f"  Still has issues:")
            for issue in new_analysis['issues']:
                print(f"    - {issue}")
        else:
            print(f"  ✅ All issues fixed!")
    else:
        print(f"\n✅ No issues found")


def interactive_mode():
    """Interactive mode for fixing individual files"""
    portal_path = Path(BUSINESS_PORTAL_PATH)
    html_files = list(portal_path.rglob("*.html"))
    
    print("\n" + "="*60)
    print("INTERACTIVE MODE")
    print("="*60)
    print("\nFiles with potential issues:")
    
    files_with_issues = []
    for i, html_file in enumerate(html_files, 1):
        analysis = analyze_template_structure(str(html_file))
        if analysis['issues']:
            files_with_issues.append((str(html_file), analysis))
            print(f"{len(files_with_issues)}. {html_file.name} ({len(analysis['issues'])} issues)")
    
    if not files_with_issues:
        print("No files with issues found!")
        return
    
    print("\nEnter file number to fix, or 'a' for all, or 'q' to quit:")
    
    while True:
        choice = input("> ").strip().lower()
        
        if choice == 'q':
            break
        elif choice == 'a':
            for file_path, _ in files_with_issues:
                fix_single_file(file_path)
            break
        elif choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(files_with_issues):
                file_path, _ = files_with_issues[idx]
                fix_single_file(file_path)
            else:
                print("Invalid number")
        else:
            print("Invalid choice")


if __name__ == "__main__":
    import sys
    
    print("""
╔══════════════════════════════════════════════════════════════╗
║           ANGULAR TEMPLATE CONTROL FLOW FIXER               ║
║                                                              ║
║  Fixes:                                                      ║
║  • Unclosed @if/@else/@for/@switch blocks                    ║
║  • Missing closing braces }                                  ║
║  • HTML elements crossing control flow boundaries            ║
║  • Missing TypeScript interface properties                   ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--dry-run':
            DRY_RUN = True
        elif sys.argv[1] == '--file' and len(sys.argv) > 2:
            fix_single_file(sys.argv[2])
            sys.exit(0)
        elif sys.argv[1] == '--interactive':
            interactive_mode()
            sys.exit(0)
        elif sys.argv[1] == '--help':
            print("""
Usage:
  python fix_angular_templates.py              # Fix all files
  python fix_angular_templates.py --dry-run    # Preview changes only
  python fix_angular_templates.py --file PATH  # Fix single file
  python fix_angular_templates.py --interactive # Interactive mode
  python fix_angular_templates.py --help       # Show this help
""")
            sys.exit(0)
    
    # Default: Process all files
    process_all_business_portal_files()