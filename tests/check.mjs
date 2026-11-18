// 問題データと計算ドリルのテスト
// 使い方: node tests/check.mjs [生成回数]   （既定は 1 パターンあたり 2000 回）
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = p => readFileSync(join(root, p), "utf8");
const RUNS = Number(process.argv[2] || 2000);

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error("  NG: " + msg); } };
const section = name => console.log("■ " + name);

// 乱数を固定して、失敗したときに同じ問題を再現できるようにする
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const math = Object.create(Math);
math.random = mulberry32(20261118);
const ctx = vm.createContext({ Math: math, console });
vm.runInContext(read("js/questions.js") + "\n" + read("js/drills.js") +
  "\n;globalThis.__ = {FIELDS, Q, GEN, phi, comb, frac, fmt, T025};", ctx);
const { FIELDS, Q, GEN, phi, comb, frac, fmt, T025 } = ctx.__;
new vm.Script(read("js/app.js")); // 画面のコードは文法だけ確かめる

section("分野");
const ids = FIELDS.map(f => f.id);
ok(new Set(ids).size === ids.length, "分野の id が重複している");
for (const id of ids) {
  ok(Q.some(q => q.f === id), `${id}: 知識問題がない`);
  ok(GEN[id] && GEN[id].length > 0, `${id}: 計算ドリルがない`);
}

section(`知識問題 ${Q.length} 問`);
const seen = new Set();
Q.forEach((q, i) => {
  const at = `知識問題 ${i + 1}（${q.q.slice(0, 20)}…）`;
  ok(ids.includes(q.f), `${at}: 分野 ${q.f} がない`);
  ok(q.c.length >= 2 && new Set(q.c).size === q.c.length, `${at}: 選択肢が足りないか重複している`);
  ok(Number.isInteger(q.a) && q.a >= 0 && q.a < q.c.length, `${at}: 正解の番号が範囲外`);
  ok(q.q.trim() && q.e.trim(), `${at}: 問題文か解説が空`);
  ok(!seen.has(q.q), `${at}: 同じ問題文がある`);
  seen.add(q.q);
});

section("計算の部品");
const near = (a, b, tol) => Math.abs(a - b) <= tol;
ok(near(phi(0), 0.5, 1e-6), "Φ(0) ≠ 0.5");
ok(near(phi(1.96), 0.975, 1e-4), "Φ(1.96) ≠ 0.975");
ok(near(phi(-1), 0.158655, 1e-5), "Φ(−1) ≠ 0.1587");
ok(near(phi(2.576), 0.995, 1e-4), "Φ(2.576) ≠ 0.995");
ok(comb(5, 2) === 10 && comb(6, 0) === 1 && comb(6, 3) === 20, "組合せの計算が違う");
ok(frac(6, 36) === "1/6" && frac(12, 4) === "3", "分数の約分が違う");
ok(fmt(-0.0001, 2) === "0.00" && fmt(-1.5, 1) === "−1.5", "数値の表示が違う");
// t 分布の上側 2.5% 点（SciPy で計算した値）
const tRef = {4:2.776,5:2.571,6:2.447,7:2.365,8:2.306,9:2.262,10:2.228,11:2.201,12:2.179,14:2.145,15:2.131,19:2.093,24:2.064};
for (const [df, v] of Object.entries(T025)) ok(tRef[df] === v, `t₀.₀₂₅(${df}) = ${v} は ${tRef[df]} のはず`);

let patterns = 0, total = 0;
for (const [f, gens] of Object.entries(GEN)) {
  gens.forEach((g, gi) => {
    patterns++;
    let bad = 0, example = "";
    for (let i = 0; i < RUNS; i++) {
      const q = g(); total++;
      const text = q.q + q.c.join("|") + q.e;
      const good = q.f === f && q.a === 0 && q.c.length === 4 && new Set(q.c).size === 4 &&
        !/NaN|undefined|Infinity|null/.test(text) && q.gen === true;
      if (!good) { bad++; example ||= JSON.stringify(q.c) + " " + q.q.slice(0, 40); }
    }
    ok(bad === 0, `${f} の ${gi + 1} 番目: ${RUNS} 回中 ${bad} 回おかしい 例 ${example}`);
  });
}
section(`計算ドリル ${patterns} パターン × ${RUNS} 回 = ${total} 問`);

section("オフライン用のファイル");
const sw = read("sw.js");
const files = [...sw.matchAll(/"\.\/([^"]*)"/g)].map(m => m[1]).filter(Boolean);
for (const p of files) ok(existsSync(join(root, p)), `sw.js の ${p} がない`);
const manifest = JSON.parse(read("manifest.webmanifest"));
for (const ic of manifest.icons) ok(existsSync(join(root, ic.src)), `manifest の ${ic.src} がない`);
for (const m of read("index.html").matchAll(/(?:href|src)="([^"]+)"/g)) ok(existsSync(join(root, m[1])), `index.html の ${m[1]} がない`);

console.log(failed ? `\n失敗 ${failed} 件` : "\nすべて OK");
process.exit(failed ? 1 : 0);
