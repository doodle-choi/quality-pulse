import re

with open('frontend/src/app/layout.tsx', 'r') as f:
    content = f.read()

# Add import NotificationProvider
content = content.replace(
    'import { SidebarProvider } from "@/contexts/SidebarContext";',
    'import { SidebarProvider } from "@/contexts/SidebarContext";\nimport { NotificationProvider } from "@/contexts/NotificationContext";'
)

# Wrap SidebarProvider with NotificationProvider
content = content.replace(
    '<SidebarProvider>',
    '<SidebarProvider>\n            <NotificationProvider>'
)

content = content.replace(
    '</SidebarProvider>',
    '</NotificationProvider>\n          </SidebarProvider>'
)

with open('frontend/src/app/layout.tsx', 'w') as f:
    f.write(content)
