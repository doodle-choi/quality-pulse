from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)

        page.click('button[aria-label="Toggle Theme"]')
        page.wait_for_timeout(2000)

        # Print all headers and body from shadow root
        extract_js = '''() => {
            const portal = document.querySelector('nextjs-portal');
            if (!portal || !portal.shadowRoot) return "No error portal";
            const errs = Array.from(portal.shadowRoot.querySelectorAll('h1, h2, h3, h4, .nextjs-toast-errors-parent, .nextjs-toast-errors, div'));

            // just get outer text of the first major container that has actual error message
            const dialog = portal.shadowRoot.querySelector('[data-nextjs-dialog-overlay]');
            if (dialog) return dialog.innerText;
            return "No dialog";
        }'''
        print("Extracted Error Text:\n", page.evaluate(extract_js)[:3000])

        browser.close()

run()
