import re

path = 'src/components/heroes/HeroDetailClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract Skills Section
skills_start = content.find('        {/* Skills Section */}')
detailed_stats_start = content.find('        {/* Detailed Stats */}')

if skills_start != -1 and detailed_stats_start != -1:
    skills_block = content[skills_start:detailed_stats_start]
    
    # Remove skills block from its original position
    new_content = content[:skills_start] + content[detailed_stats_start:]
    
    # Insert skills block right before Lore Section
    lore_start = new_content.find('        {/* Lore Section */}')
    if lore_start != -1:
        new_content = new_content[:lore_start] + skills_block + '\n' + new_content[lore_start:]
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Successfully reordered HeroDetailClient.tsx')
    else:
        print('Lore Section not found')
else:
    print('Skills Section or Detailed Stats not found')
