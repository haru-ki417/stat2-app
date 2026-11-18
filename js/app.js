// 画面・出題・成績の保存（成績は端末の localStorage だけに置く）
// ---------- 保存（端末のブラウザのみ） ----------
const KEY="stat2_v1";
let S={st:{},wrong:[],dr:{}};
try{const r=localStorage.getItem(KEY);if(r)S=JSON.parse(r);}catch(e){}
S.st=S.st||{};S.wrong=S.wrong||[];S.dr=S.dr||{};
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

Q.forEach((q,i)=>q.id=i);
const $=id=>document.getElementById(id);
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const pc=(a,b)=>b?Math.round(a/b*100)+"%":"—";

// ---------- ホーム ----------
function home(){
  let ka=0,kb=0,ga=0,gb=0;Object.values(S.st).forEach(v=>{ka+=v[0];kb+=v[1];});Object.values(S.dr).forEach(v=>{ga+=v[0];gb+=v[1];});
  let h=`<div class="card"><div class="meta"><span>知識 ${Q.length}問 ＋ 計算ドリル（無限）</span><span>正答率 ${pc(ka+ga,kb+gb)}</span></div><div class="bar"><i style="width:${kb+gb?(ka+ga)/(kb+gb)*100:0}%"></i></div>
  <button class="big" onclick="start(null,'mix',10)">ミックス10問（知識＋計算）</button>
  <div class="row"><button class="big sec" onclick="start(null,'k',10)">知識10問</button><button class="big sec" onclick="start(null,'g',10)">計算10問</button></div>
  <button class="big sec" onclick="startWrong()" ${S.wrong.length?"":"disabled"}>間違えた知識問題（${S.wrong.length}）</button></div>
  <p class="small" style="margin:12px 2px 8px">分野別に解く（％は正答率）</p>`;
  FIELDS.forEach(f=>{
    const qs=Q.filter(q=>q.f===f.id);let a=0,b=0;qs.forEach(q=>{const s=S.st[q.id];if(s){a+=s[0];b+=s[1];}});
    const d=S.dr[f.id]||[0,0];
    h+=`<div class="fbox"><div class="fname">${f.name}<small>${f.sub}</small></div><div class="row">
    <button class="fbtn" onclick="start('${f.id}','k')">知識 ${qs.length}問<b>${pc(a,b)}</b></button>
    <button class="fbtn" onclick="start('${f.id}','g',10)">計算ドリル<b>${pc(d[0],d[1])}</b></button></div></div>`;
  });
  h+=`<button class="link" onclick="resetAll()">成績をリセット</button><span id="rs" class="small"></span>`;
  $("home").innerHTML=h;
}
let confirmReset=false;
function resetAll(){
  if(!confirmReset){confirmReset=true;$("rs").textContent=" もう一度押すとリセットします";return;}
  S={st:{},wrong:[],dr:{}};save();confirmReset=false;home();
}

// ---------- 出題 ----------
let set=[],idx=0,correct=0,missed=[],last=null;
function start(fid,mode,n){
  last={fid,mode,n};
  if(mode==="k"){set=shuffle(fid?Q.filter(q=>q.f===fid):Q);if(n)set=set.slice(0,n);}
  else if(mode==="g"){set=Array.from({length:n||10},()=>genOne(fid));}
  else{const k=shuffle(Q).slice(0,Math.ceil((n||10)/2));const g=Array.from({length:(n||10)-k.length},()=>genOne(null));set=shuffle(k.concat(g));}
  run();
}
function startWrong(){last=null;set=shuffle(Q.filter(q=>S.wrong.includes(q.id)));run();}
function run(){idx=0;correct=0;missed=[];show("quiz");render();}
function render(){
  const q=set[idx],f=FIELDS.find(x=>x.id===q.f);
  const order=shuffle(q.c.map((t,i)=>i));
  let h=`<div class="meta"><span>${f.name}${q.gen?"・計算":""}</span><span>${idx+1} / ${set.length}</span></div><div class="bar"><i style="width:${idx/set.length*100}%"></i></div>
  <div class="card"><div class="qtext">${q.q}</div>`;
  order.forEach(i=>h+=`<button class="choice" data-i="${i}">${q.c[i]}</button>`);
  h+=`<div id="fb"></div></div><button class="link" onclick="show('home');home()">← やめてホームへ</button>`;
  $("quiz").innerHTML=h;
  document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>answer(+b.dataset.i));
  window.scrollTo(0,0);
}
function answer(i){
  const q=set[idx],ok=i===q.a;
  document.querySelectorAll(".choice").forEach(b=>{
    b.disabled=true;const k=+b.dataset.i;
    if(k===q.a)b.classList.add("ok");else if(k===i)b.classList.add("ng");
  });
  if(q.gen){const d=S.dr[q.f]||[0,0];d[1]++;if(ok)d[0]++;S.dr[q.f]=d;if(!ok)missed.push(q);}
  else{
    const s=S.st[q.id]||[0,0];s[1]++;if(ok)s[0]++;S.st[q.id]=s;
    if(ok)S.wrong=S.wrong.filter(x=>x!==q.id);else{missed.push(q);if(!S.wrong.includes(q.id))S.wrong.push(q.id);}
  }
  if(ok)correct++;
  save();
  $("fb").innerHTML=`<div class="exp ${ok?"ok":"ng"}"><b class="v">${ok?"正解":"不正解"}</b>${q.e}</div>
  <button class="big" id="nx">${idx+1<set.length?"次の問題":"結果を見る"}</button>`;
  $("nx").onclick=()=>{idx++;idx<set.length?render():result();};
  $("fb").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function result(){
  let h=`<div class="card"><p class="small" style="text-align:center;margin:0">結果</p><div class="score">${correct} / ${set.length}</div>
  <p style="text-align:center;margin:0 0 12px" class="small">正答率 ${Math.round(correct/set.length*100)}%</p>`;
  if(last&&last.mode!=="k")h+=`<button class="big" id="more">続けて10問</button>`;
  if(missed.length)h+=`<button class="big sec" id="rm">間違えた ${missed.length} 問をもう一度</button>`;
  h+=`<button class="big sec" onclick="show('home');home()">ホームへ</button></div>`;
  $("quiz").innerHTML=h;
  if(last&&last.mode!=="k")$("more").onclick=()=>start(last.fid,last.mode,10);
  if(missed.length)$("rm").onclick=()=>{set=shuffle(missed);run();};
  window.scrollTo(0,0);
}

// ---------- 公式・数表 ----------
$("formula").innerHTML=`
<div class="card f"><h3>記述統計</h3>
<p>分散 s² = Σ(xᵢ−x̄)²/n（不偏分散は n−1 で割る）</p>
<p>相関係数 r = s<sub>xy</sub>/(s<sub>x</sub>s<sub>y</sub>)</p>
<p>回帰直線 傾き b = r·s<sub>y</sub>/s<sub>x</sub>、(x̄, ȳ) を通る</p>
<p>変動係数 = s/x̄　　z = (x−x̄)/s</p></div>
<div class="card f"><h3>確率変数</h3>
<p>E[aX+b] = aE[X]+b　V[aX+b] = a²V[X]</p>
<p>V[X±Y] = V[X]+V[Y]±2Cov(X,Y)</p>
<p>P(A|B) = P(A∩B)/P(B)</p></div>
<div class="card f"><h3>主な分布（期待値／分散）</h3>
<table><tr><th>分布</th><th>期待値</th><th>分散</th></tr>
<tr><td>二項 B(n,p)</td><td>np</td><td>np(1−p)</td></tr>
<tr><td>ポアソン(λ)</td><td>λ</td><td>λ</td></tr>
<tr><td>幾何(p)</td><td>1/p</td><td>(1−p)/p²</td></tr>
<tr><td>一様 U(a,b)</td><td>(a+b)/2</td><td>(b−a)²/12</td></tr>
<tr><td>指数(λ)</td><td>1/λ</td><td>1/λ²</td></tr>
<tr><td>正規 N(μ,σ²)</td><td>μ</td><td>σ²</td></tr></table>
<p class="small" style="margin-top:6px">幾何分布は「初めて成功するまでの試行回数」で数えた場合</p></div>
<div class="card f"><h3>推定・検定</h3>
<p>標準誤差：平均 σ/√n、比率 √(p(1−p)/n)</p>
<p>平均の区間（σ既知）x̄ ± z·σ/√n</p>
<p>平均の区間（σ未知）x̄ ± t<sub>α/2</sub>(n−1)·s/√n</p>
<p>2標本t（等分散）自由度 n₁+n₂−2</p>
<p>χ²適合度 自由度 k−1 ／ 独立性 (r−1)(c−1)</p>
<p>期待度数 = 行合計×列合計/総数</p></div>
<div class="card f"><h3>回帰・分散分析</h3>
<p>R² = 1 − 残差平方和/全平方和</p>
<p>t値 = 推定値/標準誤差</p>
<p>一元配置：群間 df = k−1、群内 df = N−k、F = 群間MS/群内MS</p></div>
<div class="card f"><h3>よく使う値</h3>
<table><tr><th>標準正規</th><th>上側確率</th></tr>
<tr><td>1.645</td><td>0.05</td></tr><tr><td>1.96</td><td>0.025</td></tr>
<tr><td>2.326</td><td>0.01</td></tr><tr><td>2.576</td><td>0.005</td></tr></table>
<p class="small" style="margin-top:6px">P(|Z|&lt;1) ≈ 0.683、P(|Z|&lt;2) ≈ 0.954、P(|Z|&lt;3) ≈ 0.997</p>
<table style="margin-top:8px"><tr><th>自由度</th><th>t<sub>0.025</sub></th><th>自由度</th><th>t<sub>0.025</sub></th></tr>
<tr><td>5</td><td>2.571</td><td>15</td><td>2.131</td></tr>
<tr><td>9</td><td>2.262</td><td>20</td><td>2.086</td></tr>
<tr><td>10</td><td>2.228</td><td>30</td><td>2.042</td></tr></table></div>
<div class="card f"><h3>指数関数の値（ポアソン・指数分布用）</h3>
<table><tr><th>x</th><th>0.5</th><th>1</th><th>1.5</th><th>2</th><th>2.5</th><th>3</th></tr>
<tr><td>e<sup>−x</sup></td><td>0.607</td><td>0.368</td><td>0.223</td><td>0.135</td><td>0.082</td><td>0.050</td></tr></table></div>`;

// ---------- 画面切り替え ----------
function show(v){
  ["home","quiz","formula"].forEach(x=>$(x).classList.toggle("hide",x!==v));
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("on",t.dataset.v===(v==="quiz"?"home":v)));
}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{show(t.dataset.v);if(t.dataset.v==="home")home();});
home();
// オフライン対応（ホーム画面アプリ用）
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){
  window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{});});
}
