import re

with open('frontend/src/components/Header.tsx', 'r') as f:
    content = f.read()

# Replace any with unknown
content = content.replace(
    '(announcement as any).isRead',
    '(announcement as { isRead?: boolean }).isRead'
)

with open('frontend/src/components/Header.tsx', 'w') as f:
    f.write(content)
