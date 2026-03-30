import re

with open('frontend/src/components/Header.tsx', 'r') as f:
    content = f.read()

# isRead property is injected by NotificationContext, but the Announcement type imported
# might be missing it. Let's cast it or update the import.
content = content.replace(
    'announcement.isRead',
    '(announcement as any).isRead'
)

with open('frontend/src/components/Header.tsx', 'w') as f:
    f.write(content)
