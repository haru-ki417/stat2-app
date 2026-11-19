"""スマホ幅のブラウザーで開き、練習・範囲チェック・模擬試験・数表・電卓・オフライン起動まで通るか確かめる。

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
    check(page.locator(".fbox").count() == 9, "学習ホームに 9 分野が並ぶ")
    page.evaluate("navigator.serviceWorker.ready")
    time.sleep(1)

    page.click("text=知識10問")
    page.click("#quiz .choice >> nth=0")
    check(page.locator("#quiz .exp").count() == 1, "知識問題に答えると解説が出る")
    for _ in range(9):
        page.click("#nx"); page.click("#quiz .choice >> nth=0")
    page.click("#nx")
    check(page.locator("#quiz .score").inner_text().endswith("/ 10"), "10 問解くと結果が出る")
    page.click("#quiz >> text=戻る")

    page.click(".fbox >> nth=6 >> .fbtn >> nth=1")
    check("仮説検定" in page.locator("#quiz .meta").inner_text(), "分野別の計算ドリルが開く")
    page.click("#quiz .choice >> nth=1")
    check(page.locator("#quiz .choice.ok").count() == 1, "計算ドリルで正解の選択肢が示される")

    page.click(".tab[data-v=home]")
    un_before = page.evaluate("cntUn(lists({}))")
    wr = page.evaluate("cntWr(lists({}))")
    check(wr > 0, "間違えた問題が数えられる")
    check(un_before == page.evaluate("Q.length+GENS.length") - page.evaluate("Object.keys(S.st).length+Object.keys(S.gp).length"), "未回答の数が解いた数と合う")
    page.click("#home >> text=間違いだけ")
    n = int(page.locator("#quiz .meta span >> nth=1").inner_text().split("/")[1])
    check(n == min(20, wr), f"間違いだけで {wr} 問（最大20）が出る")
    for i in range(n):
        page.click('#quiz .choice[data-i="0"]'); page.click("#nx")
    check(page.evaluate("cntWr(lists({}))") == 0 if wr <= 20 else True, "正解すると間違えた問題から外れる")
    page.click("#quiz >> text=戻る")
    page.click(".fbox >> nth=0 >> text=未回答だけ")
    check(page.locator("#quiz .meta").inner_text().startswith("データの記述"), "分野ごとに未回答だけ解ける")
    page.click('#quiz .choice[data-i="0"]')
    page.click("#quiz >> text=やめる")
    check(page.evaluate("cntUn(lists({}))") == un_before - 1, "答えると未回答が減る")

    page.click(".tab[data-v=topics]")
    n_topics = page.locator(".trow").count()
    check(n_topics == page.evaluate("TOPICS.length"), f"範囲チェックに全項目（{n_topics}）が並ぶ")
    page.click(".trow >> nth=5")
    check(page.locator("#topic h3", has_text="要点").count() == 1, "項目を開くと要点が出る")
    page.click("#topic >> text=この項目を10問")
    page.click("#quiz .choice >> nth=0")
    check(page.locator("#quiz .exp").count() == 1, "項目別の練習で解ける")

    page.click(".tab[data-v=mockhome]")
    page.click("text=模擬試験を始める")
    check(page.locator(".mhead").inner_text().startswith("模擬試験 1/35"), "模擬試験が 35 問で始まる")
    check(page.locator("#mock .exp").count() == 0, "模擬試験の途中は解説を出さない")
    for i in range(35):
        page.click("#mock .choice >> nth=0")
        if i < 34: page.click("text=次 →")
    page.reload()
    page.click(".tab[data-v=mockhome]")
    check(page.locator("text=続きから").count() == 1, "閉じても模擬試験の続きから再開できる")
    page.click("text=続きから")
    page.click("text=問題の一覧・提出")
    page.click("#msub"); page.click("#msub")
    check(page.locator("#mock .score").count() == 1 and page.locator("details.rev").count() == 35, "提出すると得点と 35 問の見直しが出る")
    page.click("text=模試のページへ")
    check(page.locator(".trend i").count() == 1, "模擬試験の記録が残る")

    page.click(".tab[data-v=formula]")
    for i, name in enumerate(["正規", "t", "χ²", "F"]):
        page.click(f".subtabs button >> nth={i+1}")
        check(page.locator("#formula .tblwrap").count() >= 1, f"{name} 分布表が出る")

    page.click(".fab")
    for k in ["√", "2", "×", "(", "3", "+", "4", ")", "x²", "="]:
        page.click(f'#calc [data-k="{k}"]')
    check(page.locator("#cres").inner_text() == "= 69.29646456", "電卓で √2×(3+4)² が計算できる")
    page.click("#calc >> text=閉じる")

    page.click(".tab[data-v=home]")
    saved = page.evaluate("Object.keys(JSON.parse(localStorage.getItem('stat2_v1')).st).length")
    check(saved > 0, "成績が端末に保存される")
    check("今日の復習（0問）" not in page.inner_text("#home"), "間違えた問題が今日の復習に入る")

    ctx.set_offline(True)
    server.shutdown()
    page.reload()
    check(page.locator(".fbox").count() == 9, "オフラインでも開ける")
    page.click("text=計算10問")
    check(page.locator("#quiz .qtext").count() == 1, "オフラインでも計算ドリルが出る")

    check(not errors, "スクリプトのエラーがない" + (f": {errors}" if errors else ""))
    browser.close()

print("\n失敗 %d 件" % len(failed) if failed else "\nすべて OK")
sys.exit(1 if failed else 0)
