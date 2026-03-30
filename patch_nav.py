import re

with open('frontend/src/config/navigation.ts', 'r') as f:
    content = f.read()

# Add Announcements to Admin group
content = content.replace(
    '{ name: "Scheduler / Sync", href: "/admin/scheduler", icon: "sync" },',
    '{ name: "Scheduler / Sync", href: "/admin/scheduler", icon: "sync" },\n      { name: "Announcements", href: "/admin/announcements", icon: "campaign" },'
)

with open('frontend/src/config/navigation.ts', 'w') as f:
    f.write(content)
