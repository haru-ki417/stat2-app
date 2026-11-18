"""スマホ幅のブラウザーで開き、解答・オフライン起動まで通るか確かめる。

使い方: pip install playwright && playwright install chromium
        python3 tests/smoke.py            （CHROME_PATH で使うブラウザーを指定できる）
"""
import functools, http.server, os, socketserver, sys, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
handler = functools.partial(Quiet, directory=ROOT)
server = socketserver.TCPServer(("127.0.0.1", 0), handler)
port = server.server_address[1]
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://localhost:{port}/"

failed = []
def check(cond, msg):
    print(("  OK  " if cond else "  NG  ") + msg)
    if not cond: failed.append(msg)

with sync_playwright() as p:
    opts = {"executable_path": os.environ["CHROME_PATH"]} if os.environ.get("CHROME_PATH") else {}
    browser = p.chromium.launch(**opts)
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    page.goto(url)
    check(page.locator(".fbox").count() == 9, "ホームに 9 分野が並ぶ")
    page.evaluate("navigator.serviceWorker.ready")
    time.sleep(1)

    page.click("text=知識10問")
    page.click(".choice >> nth=0")
    check(page.locator(".exp").count() == 1, "知識問題に答えると解説が出る")
    for _ in range(9):
        page.click("#nx"); page.click(".choice >> nth=0")
    page.click("#nx")
    check(page.locator(".score").inner_text().endswith("/ 10"), "10 問解くと結果が出る")

    page.click("text=ホームへ")
    page.click(".fbox >> nth=6 >> text=計算ドリル")
    check("仮説検定" in page.locator("#quiz .meta").inner_text(), "分野別の計算ドリルが開く")
    page.click(".choice >> nth=1")
    check(page.locator(".choice.ok").count() == 1, "計算ドリルで正解の選択肢が示される")

    page.click("text=公式・数表")
    check("t<sub>0.025</sub>" in page.inner_html("#formula"), "公式・数表が出る")

    saved = page.evaluate("Object.keys(JSON.parse(localStorage.getItem('stat2_v1')).st).length")
    check(saved > 0, "成績が端末に保存される")

    ctx.set_offline(True)
    server.shutdown()
    page.reload()
    check(page.locator(".fbox").count() == 9, "オフラインでも開ける")
    page.click("text=計算10問")
    check(page.locator(".qtext").count() == 1, "オフラインでも計算ドリルが出る")

    check(not errors, "スクリプトのエラーがない" + (f": {errors}" if errors else ""))
    browser.close()

print("\n失敗 %d 件" % len(failed) if failed else "\nすべて OK")
sys.exit(1 if failed else 0)
