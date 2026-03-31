from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)

        html_before = page.locator('html').get_attribute('class')
        print(f"HTML class before toggle: {html_before}")

        page.click('button[aria-label="Toggle Theme"]')
        page.wait_for_timeout(2000)

        html_after = page.locator('html').get_attribute('class')
        print(f"HTML class after toggle: {html_after}")

        extract_js = '''() => {
            const portal = document.querySelector('nextjs-portal');
            if (!portal || !portal.shadowRoot) return "No error portal";
            return "Error portal present!";
        }'''
        err = page.evaluate(extract_js)
        print("Error portal check:", err)

        browser.close()

run()
