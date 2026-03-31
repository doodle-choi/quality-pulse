from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(err.message))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)

        page.click('button[aria-label="Toggle Theme"]')
        page.wait_for_timeout(2000)

        print("ERRORS:")
        for err in errors:
            print("- ", err)

        browser.close()

run()
