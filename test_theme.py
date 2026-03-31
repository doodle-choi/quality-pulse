from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)

        print("Clicking theme toggle...")
        page.click('button[aria-label="Toggle Theme"]')
        page.wait_for_timeout(2000)

        print("Grabbing HTML after click...")
        print(page.content()[:1000])

        browser.close()

run()
