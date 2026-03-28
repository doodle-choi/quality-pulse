from playwright.sync_api import sync_playwright

def verify_dashboard_render():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the dashboard
        page.goto("http://localhost:3000/insights")

        # Take a screenshot right away since the server is throwing 500s
        # for API fetch due to the missing backend
        page.wait_for_timeout(3000) # Give it 3s to attempt render

        import os
        os.makedirs("/home/jules/verification", exist_ok=True)
        page.screenshot(path="/home/jules/verification/dashboard_optimization.png", full_page=True)
        print("Screenshot saved to /home/jules/verification/dashboard_optimization.png")

        browser.close()

if __name__ == "__main__":
    verify_dashboard_render()
