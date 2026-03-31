from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)
        page.click('button[aria-label="Toggle Theme"]')
        page.wait_for_timeout(2000)
        page.screenshot(path="error.png")
        browser.close()

run()
