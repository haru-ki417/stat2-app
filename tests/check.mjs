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
vm.runInContext(["tables", "topics", "questions", "drills"].map(f => read(`js/${f}.js`)).join("\n") +
  "\n;globalThis.__ = {FIELDS, TOPICS, TOPIC, Q, GENS, phi, comb, frac, fmt, T025, tP, NORM, TTAB, T_DF, CTAB, C_DF, FTAB};", ctx);
const { FIELDS, TOPICS, TOPIC, Q, GENS, phi, comb, frac, fmt, T025, tP, NORM, TTAB, T_DF, CTAB, C_DF, FTAB } = ctx.__;
new vm.Script(read("js/app.js")); // 画面のコードは文法だけ確かめる

section("分野");
const ids = FIELDS.map(f => f.id);
ok(new Set(ids).size === ids.length, "分野の id が重複している");
for (const id of ids) {
  ok(Q.some(q => q.f === id), `${id}: 知識問題がない`);
  ok(GENS.some(g => TOPIC[g.t].f === id), `${id}: 計算ドリルがない`);
}
ok(FIELDS.reduce((s, f) => s + f.m, 0) === 35, "模擬試験の配分の合計が 35 問でない");

section(`出題範囲の項目 ${TOPICS.length} 個`);
const tids = TOPICS.map(t => t.id);
ok(new Set(tids).size === tids.length, "項目の id が重複している");
for (const t of TOPICS) {
  ok(ids.includes(t.f), `${t.id}: 分野 ${t.f} がない`);
  ok(Array.isArray(t.n) && t.n.length > 0, `${t.id}: 要点がない`);
  const n = Q.filter(q => q.t === t.id).length + GENS.filter(g => g.t === t.id).length;
  ok(n >= 3, `${t.id}（${t.name}）: 問題が ${n} 個しかない`);
}
for (const f of FIELDS) {
  const k = Q.filter(q => q.f === f.id).length, g = GENS.filter(x => TOPIC[x.t].f === f.id).length;
  ok(k >= Math.round(f.m * 0.4) && g >= 1, `${f.id}: 模擬試験に出す問題が足りない`);
}

section(`知識問題 ${Q.length} 問`);
const seen = new Set();
Q.forEach((q, i) => {
  const at = `知識問題 ${i + 1}（${q.q.slice(0, 20)}…）`;
  ok(TOPIC[q.t] !== undefined, `${at}: 項目 ${q.t} がない`);
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
for (const [df, v] of Object.entries(T025)) ok(TTAB[T_DF.indexOf(Number(df))][2] === v, `t 分布表と t₀.₀₂₅(${df}) が食い違う`);
// t 分布の両側 p 値（SciPy の値）
ok(near(tP(2.0, 47), 0.05130, 2e-4) && near(tP(1.0, 10), 0.34089, 2e-4) && near(tP(3.5, 20), 0.002255, 5e-5), "t 分布の p 値が違う");
// 数表の代表値（教科書の値）
ok(NORM[19][6] === 0.025 && NORM[16][4] === 0.0505 && NORM[0][0] === 0.5, "正規分布表の値が違う");
ok(TTAB[T_DF.indexOf(10)][2] === 2.228 && TTAB[TTAB.length - 1][1] === 1.645, "t 分布表の値が違う");
ok(CTAB[C_DF.indexOf(10)][5] === 20.483 && CTAB[C_DF.indexOf(1)][4] === 3.841, "カイ二乗分布表の値が違う");
ok(FTAB["0.05"][9][9] === 2.98, "F 分布表の値が違う");

let patterns = 0, total = 0;
ok(new Set(GENS.map(g => g.k)).size === GENS.length, "計算パターンの名前が重複している");
for (const g of GENS) {
  patterns++;
  ok(TOPIC[g.t] !== undefined, `${g.k}: 項目 ${g.t} がない`);
  let bad = 0, example = "";
  for (let i = 0; i < RUNS; i++) {
    const q = g.fn(); total++;
    const text = q.q + q.c.join("|") + q.e;
    const good = q.a === 0 && q.c.length === 4 && new Set(q.c).size === 4 &&
      !/NaN|undefined|Infinity|null/.test(text) && q.gen === true;
    if (!good) { bad++; example ||= JSON.stringify(q.c) + " " + q.q.slice(0, 40); }
  }
  ok(bad === 0, `${g.k}: ${RUNS} 回中 ${bad} 回おかしい 例 ${example}`);
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
