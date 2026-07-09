import os
import re

def fix_angular_files():
    html_patterns = [
        (r'</div\s+\(click\)=', '<div (click)='),
        (r'</button>[a-zA-Z0-9_:\(\)\'\";\s]+">Close</button>', 'Close</button>')
    ]
    
    ts_patterns = [
        (r"\{\s*id:\s*'qa-(\d+)',\s*iconClass:\s*'([^']+)'(?!.*iconColor)", 
         r"{ id: 'qa-\1', iconClass: '\2', iconColor: 'default'")
    ]

    for root, _, files in os.walk('src/app/business-portal'):
        for file in files:
            file_path = os.path.join(root, file)
            
            if file.endswith('.html'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                orig = content
                for pattern, repl in html_patterns:
                    content = re.sub(pattern, repl, content)
                
                if content != orig:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed structural HTML tags in: {file_path}")

            elif file.endswith('.ts'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                orig = content
                for pattern, repl in ts_patterns:
                    content = re.sub(pattern, repl, content)
                
                if content != orig:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed type definitions in: {file_path}")

if __name__ == '__main__':
    fix_angular_files()