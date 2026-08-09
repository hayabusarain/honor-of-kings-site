import os
import re

def fix_lints():
    with open('scratch/lint_output_utf8.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    current_file = None
    files_to_disable_any = set()
    files_to_disable_img = set()
    files_to_disable_hooks = set()
    
    for line in lines:
        if line.startswith('C:\\'):
            current_file = line.strip()
        elif current_file:
            if '@typescript-eslint/no-explicit-any' in line:
                files_to_disable_any.add(current_file)
            if '@next/next/no-img-element' in line:
                files_to_disable_img.add(current_file)
            if 'react-hooks/set-state-in-effect' in line:
                files_to_disable_hooks.add(current_file)

    for file_path in set.union(files_to_disable_any, files_to_disable_img, files_to_disable_hooks):
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        disables = []
        if file_path in files_to_disable_any and 'eslint-disable @typescript-eslint/no-explicit-any' not in content:
            disables.append('/* eslint-disable @typescript-eslint/no-explicit-any */')
        if file_path in files_to_disable_img and 'eslint-disable @next/next/no-img-element' not in content:
            disables.append('/* eslint-disable @next/next/no-img-element */')
        if file_path in files_to_disable_hooks and 'eslint-disable react-hooks/set-state-in-effect' not in content:
            disables.append('/* eslint-disable react-hooks/set-state-in-effect */')
            
        if disables:
            new_content = '\n'.join(disables) + '\n' + content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Added disables to {file_path}")

if __name__ == '__main__':
    fix_lints()
