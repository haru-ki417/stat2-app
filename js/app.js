// 画面・出題・採点・成績の保存（成績は端末の localStorage だけに置く）

// ---------- 保存 ----------
const KEY="stat2_v1";
let S={};
try{const r=localStorage.getItem(KEY);if(r)S=JSON.parse(r)||{};}catch(e){}
// st: 知識問題ごと [正解, 解答]／dr: 分野ごとの計算／gp: 計算パターンごと／tp: 項目ごと
// srs: 知識問題の復習 [段階, 次に出す日]／log: 直近の解答 [分野, 正誤]／mock: 模試の記録／cur: 途中の模試
["st","dr","gp","tp","srs"].forEach(k=>S[k]=S[k]||{});["log","mock","wrong"].forEach(k=>S[k]=S[k]||[]);
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const today=()=>{const d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/864e5);};
// 旧版の「間違えた問題」は今日の復習に移す
S.wrong.forEach(id=>{if(!S.srs[id])S.srs[id]=[0,today()];});S.wrong=[];

Q.forEach((q,i)=>q.id=i);
const $=id=>document.getElementById(id);
const pc=(a,b)=>b?Math.round(a/b*100)+"%":"—";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// 復習の間隔（日）：正解するたびに段階が上がり、間違えると今日に戻る
const IV=[0,1,3,7,14,30];
function record(q,ok){
  const inc=(o,k)=>{const v=o[k]||[0,0];v[1]++;if(ok)v[0]++;o[k]=v;};
  inc(S.tp,q.t);
  if(q.gen){inc(S.dr,q.f);inc(S.gp,q.k);}
  else{
    const first=!S.st[q.id];inc(S.st,q.id);
    const s=S.srs[q.id]||[0,0];s[0]=ok?Math.min(first?2:s[0]+1,5):0;s[1]=today()+IV[s[0]];S.srs[q.id]=s;
  }
  S.log.push([q.f,ok?1:0]);if(S.log.length>800)S.log.splice(0,S.log.length-800);
}
const dueList=()=>Q.filter(q=>S.srs[q.id]&&S.srs[q.id][1]<=today());

// 推定得点：分野ごとの直近の正答率を、模試の配分（FIELDS の m）で重み付け
const NEED=8;
function estimate(){
  let need=0,tot=0;
  for(const f of FIELDS){const L=S.log.filter(x=>x[0]===f.id).slice(-40);if(L.length<NEED){need+=NEED-L.length;continue;}tot+=f.m*sum(L.map(x=>x[1]))/L.length;}
  return need?{need}:{score:Math.round(tot/35*100)};
}
function coverage(){const a=Q.filter(q=>S.st[q.id]).length+GENS.filter(g=>S.gp[g.k]).length;return {a,n:Q.length+GENS.length};}
function topicInfo(t){
  const kq=Q.filter(q=>q.t===t.id),kg=GENS.filter(g=>g.t===t.id),seen=kq.filter(q=>S.st[q.id]).length+kg.filter(g=>S.gp[g.k]).length,all=kq.length+kg.length,st=S.tp[t.id]||[0,0];
  const acc=st[1]?st[0]/st[1]:0;
  const status=!st[1]?["未着手","s0"]:acc<0.7?["要復習","s1"]:seen<all?["途中","s2"]:["仕上がり","s3"];
  return {kq:kq.length,kg:kg.length,seen,all,st,acc,status};
}

// ---------- 学習（ホーム） ----------
function home(){
  const e=estimate(),cv=coverage(),due=dueList().length;
  let h=`<div class="card"><div class="score-row"><div><div class="small">推定得点（目安）</div>
   ${e.score!==undefined?`<div class="big-num ${e.score>=60?"ok":"ng"}">${e.score}<small>点</small></div>`:`<div class="big-num muted">—</div><div class="small">あと ${e.need} 問ほど解くと表示</div>`}</div>
   <div><div class="small">合格ライン</div><div class="big-num">60<small>点</small></div></div>
   <div><div class="small">網羅率</div><div class="big-num">${Math.round(cv.a/cv.n*100)}<small>%</small></div></div></div>
   <div class="bar"><i style="width:${cv.a/cv.n*100}%"></i></div>
   <p class="small" style="margin:0 0 10px">知識 ${Q.length}問・計算 ${GENS.length}パターンのうち ${cv.a} を解いた</p>
   <button class="big" onclick="start({mode:'review'})" ${due?"":"disabled"}>今日の復習（${due}問）</button>
   <button class="big sec" onclick="go('mockhome')">模擬試験（35問・90分）</button></div>
  <div class="card"><p class="small" style="margin:0 0 8px">練習する</p>
   <button class="big" onclick="start({mode:'mix',n:10})">ミックス10問</button>
   <div class="row"><button class="big sec" onclick="start({mode:'k',n:10})">知識10問</button><button class="big sec" onclick="start({mode:'g',n:10})">計算10問</button></div>
   <button class="big sec" onclick="start({mode:'weak',n:10})">苦手な計算10問</button></div>
  <p class="small" style="margin:12px 2px 8px">分野別（％は正答率）</p>`;
  FIELDS.forEach(f=>{
    let a=0,b=0;Q.filter(q=>q.f===f.id).forEach(q=>{const s=S.st[q.id];if(s){a+=s[0];b+=s[1];}});
    const d=S.dr[f.id]||[0,0],nk=Q.filter(q=>q.f===f.id).length,ng=GENS.filter(g=>TOPIC[g.t].f===f.id).length;
    h+=`<div class="fbox"><div class="fname">${f.name}<small>${f.sub}</small></div><div class="row">
    <button class="fbtn" onclick="start({mode:'k',fid:'${f.id}'})">知識 ${nk}問<b>${pc(a,b)}</b></button>
    <button class="fbtn" onclick="start({mode:'g',fid:'${f.id}',n:10})">計算 ${ng}種<b>${pc(d[0],d[1])}</b></button></div></div>`;
  });
  h+=`<button class="link" onclick="resetAll()">成績をリセット</button><span id="rs" class="small"></span>`;
  $("home").innerHTML=h;
}
let confirmReset=false;
function resetAll(){
  if(!confirmReset){confirmReset=true;$("rs").textContent=" もう一度押すとすべての記録を消します";return;}
  S={st:{},dr:{},gp:{},tp:{},srs:{},log:[],mock:[],wrong:[]};save();confirmReset=false;home();
}

// ---------- 範囲チェック ----------
function topics(){
  const cv=coverage();
  let h=`<div class="card"><p style="margin:0 0 6px"><b>出題範囲チェック</b></p>
  <p class="small" style="margin:0 0 8px">公式の出題範囲表の小項目ごとに、問題がどれだけあり、どこまで解けているかを表示します。項目をタップすると要点と練習。</p>
  <div class="meta"><span>網羅率 ${cv.a} / ${cv.n}</span><span>${Math.round(cv.a/cv.n*100)}%</span></div><div class="bar"><i style="width:${cv.a/cv.n*100}%"></i></div>
  <p class="small" style="margin:0"><span class="badge s0">未着手</span> <span class="badge s1">要復習</span>（正答率70%未満） <span class="badge s2">途中</span> <span class="badge s3">仕上がり</span></p></div>`;
  FIELDS.forEach(f=>{
    h+=`<p class="small" style="margin:14px 2px 6px"><b>${f.name}</b></p>`;
    TOPICS.filter(t=>t.f===f.id).forEach(t=>{const i=topicInfo(t);
      h+=`<button class="trow" onclick="openTopic('${t.id}')"><span class="tname">${t.name}<small>知識${i.kq}・計算${i.kg}　${i.seen}/${i.all}　正答率 ${pc(i.st[0],i.st[1])}</small></span><span class="badge ${i.status[1]}">${i.status[0]}</span></button>`;});
  });
  $("topics").innerHTML=h;
}
function openTopic(id){
  const t=TOPIC[id],i=topicInfo(t),f=FIELDS.find(x=>x.id===t.f);
  $("topic").innerHTML=`<button class="link" onclick="go('topics')">← 範囲チェックへ</button>
  <div class="card"><p class="small" style="margin:0">${f.name}</p><h2 style="margin:2px 0 4px;font-size:18px">${t.name}</h2>
  <p class="small" style="margin:0 0 8px">${t.terms}</p>
  <div class="meta"><span>解いた ${i.seen} / ${i.all}　正答率 ${pc(i.st[0],i.st[1])}</span><span class="badge ${i.status[1]}">${i.status[0]}</span></div>
  <button class="big" onclick="start({mode:'mix',tid:'${id}',n:10})">この項目を10問</button>
  <div class="row">${i.kq?`<button class="big sec" onclick="start({mode:'k',tid:'${id}'})">知識 ${i.kq}問</button>`:""}${i.kg?`<button class="big sec" onclick="start({mode:'g',tid:'${id}',n:10})">計算 ${i.kg}種</button>`:""}</div></div>
  <div class="card f"><h3>要点</h3>${t.n.map(x=>`<p>・${x}</p>`).join("")}</div>`;
  go("topic");
}

// ---------- 練習の出題 ----------
let set=[],idx=0,correct=0,missed=[],last=null,backTo="home";
function pickK(L,n){// まだ解いていない問題・正答率の低い問題を先に出す
  const w=q=>{const s=S.st[q.id];return (s?s[0]/s[1]:-1)+Math.random()*0.35;};
  L=L.map(q=>[w(q),q]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);return n?L.slice(0,n):shuffle(L);
}
function weakPool(){// 正答率の低いパターンほど出やすくする
  const L=[];GENS.forEach(g=>{const s=S.gp[g.k],w=s?Math.round((1-s[0]/s[1])*6)+1:3;for(let i=0;i<w;i++)L.push(g);});return L;
}
function start(o){
  last=o;backTo=o.tid?"topic":"home";
  const byScope=q=>o.tid?q.t===o.tid:o.fid?q.f===o.fid:true;
  const n=o.n;
  if(o.mode==="review")set=shuffle(dueList()).slice(0,30);
  else if(o.mode==="k")set=pickK(Q.filter(byScope),n);
  else if(o.mode==="g")set=Array.from({length:n||10},()=>genOne({fid:o.fid,tid:o.tid}));
  else if(o.mode==="weak"){const P=weakPool();set=Array.from({length:n||10},()=>genOne({pool:P}));}
  else{const hasG=GENS.some(g=>o.tid?g.t===o.tid:o.fid?TOPIC[g.t].f===o.fid:true);
    const k=pickK(Q.filter(byScope),hasG?Math.ceil((n||10)/2):(n||10));
    const g=hasG?Array.from({length:(n||10)-k.length},()=>genOne({fid:o.fid,tid:o.tid})):[];set=shuffle(k.concat(g));}
  if(!set.length){go(backTo);return;}
  idx=0;correct=0;missed=[];go("quiz");render();
}
function render(){
  const q=set[idx],f=FIELDS.find(x=>x.id===q.f),t=TOPIC[q.t];
  const order=shuffle(q.c.map((_,i)=>i));
  let h=`<div class="meta"><span>${f.name}・${t.name}${q.gen?"（計算）":""}</span><span>${idx+1} / ${set.length}</span></div><div class="bar"><i style="width:${idx/set.length*100}%"></i></div>
  <div class="card"><div class="qtext">${q.q}</div>`;
  order.forEach(i=>h+=`<button class="choice" data-i="${i}">${q.c[i]}</button>`);
  h+=`<div id="fb"></div></div><button class="link" onclick="go(backTo)">← やめる</button>`;
  $("quiz").innerHTML=h;
  document.querySelectorAll("#quiz .choice").forEach(b=>b.onclick=()=>answer(+b.dataset.i));
  window.scrollTo(0,0);
}
function answer(i){
  const q=set[idx],ok=i===q.a;
  document.querySelectorAll("#quiz .choice").forEach(b=>{b.disabled=true;const k=+b.dataset.i;if(k===q.a)b.classList.add("ok");else if(k===i)b.classList.add("ng");});
  record(q,ok);if(ok)correct++;else missed.push(q);save();
  const due=!q.gen&&S.srs[q.id]?S.srs[q.id][1]-today():null;
  $("fb").innerHTML=`<div class="exp ${ok?"ok":"ng"}"><b class="v">${ok?"正解":"不正解"}</b>${q.e}
  ${due!==null?`<div class="small" style="margin-top:6px">${due<=0?"今日の復習にもう一度出ます":`次の復習：${due}日後`}</div>`:""}</div>
  <button class="big" id="nx">${idx+1<set.length?"次の問題":"結果を見る"}</button>`;
  $("nx").onclick=()=>{idx++;idx<set.length?render():result();};
  $("fb").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function result(){
  const e=estimate();
  let h=`<div class="card"><p class="small" style="text-align:center;margin:0">結果</p><div class="score">${correct} / ${set.length}</div>
  <p style="text-align:center;margin:0 0 12px" class="small">正答率 ${Math.round(correct/set.length*100)}%${e.score!==undefined?`　推定得点 ${e.score}点`:""}</p>`;
  if(last&&last.mode!=="k"&&last.mode!=="review")h+=`<button class="big" id="more">続けて10問</button>`;
  if(missed.length)h+=`<button class="big sec" id="rm">間違えた ${missed.length} 問をもう一度</button>`;
  h+=`<button class="big sec" onclick="go(backTo)">戻る</button></div>`;
  $("quiz").innerHTML=h;
  if($("more"))$("more").onclick=()=>start(Object.assign({},last,{n:10}));
  if(missed.length)$("rm").onclick=()=>{set=shuffle(missed);idx=0;correct=0;missed=[];render();};
  window.scrollTo(0,0);
}

// ---------- 模擬試験（35問・90分） ----------
const MOCK_MS=90*60*1000;let timer=null,mockSubmitArm=false;
function mockHome(){
  const c=S.cur,H=S.mock.slice().reverse();
  let h=`<div class="card"><p style="margin:0 0 6px"><b>模擬試験</b></p>
  <p class="small" style="margin:0 0 10px">本番と同じ 35問・90分。分野の配分は本番の傾向に合わせ、知識問題と計算（グラフ・出力の読み取りを含む）を混ぜて出します。解答中は正誤を表示しません。100点満点で60点以上が合格ラインです。電卓は右下のボタンから使えます。</p>
  ${c?`<button class="big" onclick="mockResume()">続きから（残り ${fmtTime(c.start+MOCK_MS-Date.now())}）</button><button class="big sec" id="mnew">破棄して新しく始める</button>`:`<button class="big" onclick="mockStart()">模擬試験を始める</button>`}</div>`;
  if(H.length){
    h+=`<div class="card"><p class="small" style="margin:0 0 6px">これまでの成績</p><div class="trend">${S.mock.slice(-12).map(m=>`<i class="${m.s>=60?"ok":"ng"}" style="height:${Math.max(4,m.s)}%" title="${m.s}"></i>`).join("")}<span class="line60"></span></div>
    ${tblHtml(["日付","得点","時間",""],H.slice(0,15).map(m=>[new Date(m.d).toLocaleDateString("ja-JP",{month:"numeric",day:"numeric"}),`<b>${m.s}</b>`,fmtTime(m.sec*1000),m.s>=60?`<span class="badge s3">合格圏</span>`:`<span class="badge s1">あと${60-m.s}</span>`]))}</div>`;
  }
  $("mockhome").innerHTML=h;
  if($("mnew"))$("mnew").onclick=function(){if(this.dataset.arm){S.cur=null;save();mockStart();}else{this.dataset.arm=1;this.textContent="もう一度押すと破棄して始めます";}};
}
function tblHtml(head,rows){return `<table class="qt"><tr>${head.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;}
function fmtTime(ms){ms=Math.max(0,ms);const s=Math.round(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;}
function mockStart(){
  const qs=[];
  FIELDS.forEach(f=>{
    const nk=Math.round(f.m*0.4),ng=f.m-nk;
    shuffle(Q.filter(q=>q.f===f.id)).slice(0,nk).forEach(q=>qs.push({kid:q.id}));
    const P=shuffle(GENS.filter(g=>TOPIC[g.t].f===f.id));
    for(let i=0;i<ng;i++){const q=genOne({pool:[P[i%P.length]]});qs.push(q);}
  });
  // 分野の順はそのまま（本番も前半が記述統計）、分野の中は並べ替える
  let i=0;const out=[];FIELDS.forEach(f=>{const n=f.m;out.push(...shuffle(qs.slice(i,i+n)));i+=n;});
  out.forEach(x=>x.order=shuffle(mq(x).c.map((_,i)=>i)));
  S.cur={qs:out,ans:out.map(()=>null),flag:out.map(()=>false),start:Date.now(),idx:0};save();
  mockResume();
}
const mq=x=>x.kid!==undefined?Q[x.kid]:x;
function mockResume(){if(!S.cur)return go("mockhome");if(Date.now()-S.cur.start>=MOCK_MS)return mockFinish();go("mock");mockRender();
  clearInterval(timer);timer=setInterval(()=>{if(!S.cur){clearInterval(timer);return;}const r=S.cur.start+MOCK_MS-Date.now();const el=$("mtime");if(el){el.textContent=fmtTime(r);el.classList.toggle("warn",r<10*60*1000);}if(r<=0)mockFinish();},1000);}
function mockRender(pal){
  const M=S.cur,x=M.qs[M.idx],q=mq(x),f=FIELDS.find(v=>v.id===q.f),done=M.ans.filter(a=>a!==null).length;mockSubmitArm=false;
  let h=`<div class="mhead"><span>模擬試験 ${M.idx+1}/${M.qs.length}　<span class="small">解答 ${done}</span></span><span id="mtime" class="mtime">${fmtTime(M.start+MOCK_MS-Date.now())}</span></div>
  <div class="bar"><i style="width:${done/M.qs.length*100}%"></i></div>`;
  if(pal){h+=`<div class="card"><p class="small" style="margin:0 0 8px">問題の一覧（★は見直し）</p><div class="pal">${M.qs.map((_,i)=>`<button class="${M.ans[i]!==null?"done":""} ${i===M.idx?"cur":""}" onclick="mockGo(${i})">${i+1}${M.flag[i]?"★":""}</button>`).join("")}</div>
    <button class="big" id="msub">提出する（未解答 ${M.qs.length-done}問）</button><button class="big sec" onclick="mockRender()">問題に戻る</button></div>`;
    $("mock").innerHTML=h;$("msub").onclick=function(){if(mockSubmitArm)mockFinish();else{mockSubmitArm=true;this.textContent="もう一度押すと提出します";}};return;}
  h+=`<div class="card"><p class="small" style="margin:0 0 4px">${f.name}</p><div class="qtext">${q.q}</div>`;
  x.order.forEach(i=>h+=`<button class="choice ${M.ans[M.idx]===i?"sel":""}" onclick="mockPick(${i})">${q.c[i]}</button>`);
  h+=`</div><div class="row"><button class="big sec" onclick="mockGo(${M.idx-1})" ${M.idx?"":"disabled"}>← 前</button>
  <button class="big sec" onclick="mockFlag()">${M.flag[M.idx]?"★ 見直し中":"☆ 見直し"}</button>
  <button class="big sec" onclick="mockGo(${M.idx+1})" ${M.idx+1<M.qs.length?"":"disabled"}>次 →</button></div>
  <button class="big" onclick="mockRender(true)">問題の一覧・提出</button>
  <button class="link" onclick="clearInterval(timer);go('mockhome')">← 中断（時間は進みます）</button>`;
  $("mock").innerHTML=h;window.scrollTo(0,0);
}
function mockPick(i){const M=S.cur;M.ans[M.idx]=M.ans[M.idx]===i?null:i;save();mockRender();}
function mockGo(i){const M=S.cur;if(i<0||i>=M.qs.length)return;M.idx=i;save();mockRender();}
function mockFlag(){const M=S.cur;M.flag[M.idx]=!M.flag[M.idx];save();mockRender();}
function mockFinish(){
  clearInterval(timer);const M=S.cur;if(!M)return;
  const sec=Math.min(MOCK_MS,Date.now()-M.start)/1000,byF={};let c=0;
  M.qs.forEach((x,i)=>{const q=mq(x),ok=M.ans[i]===q.a;if(ok)c++;record(q,ok);const v=byF[q.f]||[0,0];v[1]++;if(ok)v[0]++;byF[q.f]=v;});
  const s=Math.round(c/M.qs.length*100);
  S.mock.push({d:Date.now(),s,c,sec:Math.round(sec),f:byF});if(S.mock.length>50)S.mock.shift();
  const R=M;S.cur=null;save();
  let h=`<div class="card"><p class="small" style="text-align:center;margin:0">模擬試験の結果</p><div class="score ${s>=60?"okc":"ngc"}">${s}<small>点</small></div>
  <p style="text-align:center;margin:0 0 6px">${s>=60?`<span class="badge s3">合格ライン到達</span>`:`<span class="badge s1">合格ラインまであと ${60-s}点</span>`}</p>
  <p class="small" style="text-align:center;margin:0 0 10px">${c} / ${R.qs.length} 問正解　時間 ${fmtTime(sec*1000)}</p>
  ${tblHtml(["分野","正解",""],FIELDS.map(f=>{const v=byF[f.id]||[0,0];return [f.name,`${v[0]} / ${v[1]}`,`<span class="minibar"><i style="width:${v[1]?v[0]/v[1]*100:0}%"></i></span>`];}))}
  <button class="big" style="margin-top:10px" onclick="go('mockhome')">模試のページへ</button></div>
  <p class="small" style="margin:12px 2px 6px">見直し（タップで解説）</p>`;
  R.qs.forEach((x,i)=>{const q=mq(x),a=R.ans[i],ok=a===q.a;
    h+=`<details class="rev ${ok?"ok":"ng"}"><summary>${ok?"○":"×"} ${i+1}. ${FIELDS.find(f=>f.id===q.f).name}・${TOPIC[q.t].name}</summary><div class="qtext">${q.q}</div>
    <p class="small">あなたの答え：${a===null?"未解答":q.c[a]}<br>正解：<b>${q.c[q.a]}</b></p><div class="exp ${ok?"ok":"ng"}">${q.e}</div></details>`;});
  $("mock").innerHTML=h;go("mock");window.scrollTo(0,0);
}

// ---------- 公式・数表 ----------
let ftab="f";
function formula(){
  const T=[["f","公式"],["z","正規"],["t","t"],["c","χ²"],["F","F"]];
  let h=`<div class="subtabs">${T.map(([k,n])=>`<button class="${k===ftab?"on":""}" onclick="ftab='${k}';formula()">${n}</button>`).join("")}</div>`;
  if(ftab==="f")h+=FORMULA;
  else if(ftab==="z")h+=`<div class="card f"><h3>標準正規分布の上側確率 P(Z &gt; z)</h3><p class="small">行が z の小数第1位まで、列が小数第2位。例：z = 1.96 → 1.9 の行・0.06 の列。</p><div class="tblwrap dense">${tblHtml(["z",...[0,1,2,3,4,5,6,7,8,9].map(j=>"."+"0"+j)],NORM.map((r,i)=>[(i/10).toFixed(1),...r.map(v=>v.toFixed(4).slice(1))]))}</div></div>`;
  else if(ftab==="t")h+=`<div class="card f"><h3>t 分布の上側 α 点 t<sub>α</sub>(自由度)</h3><p class="small">両側5%の検定・95%区間は α = 0.025 の列。</p><div class="tblwrap">${tblHtml(["自由度",...T_A],T_DF.map((d,i)=>[d,...TTAB[i].map(v=>v.toFixed(3))]))}</div></div>`;
  else if(ftab==="c")h+=`<div class="card f"><h3>カイ二乗分布の上側 α 点 χ²<sub>α</sub>(自由度)</h3><p class="small">母分散の95%区間は α = 0.975 と 0.025 の列。</p><div class="tblwrap">${tblHtml(["自由度",...C_A],C_DF.map((d,i)=>[d,...CTAB[i].map(v=>v.toFixed(2))]))}</div></div>`;
  else{h+=`<div class="card f"><h3>F 分布の上側 5% 点・2.5% 点</h3><p class="small">列が分子の自由度、行が分母の自由度。</p>${["0.05","0.025"].map(a=>`<p style="margin:10px 0 4px"><b>α = ${a}</b></p><div class="tblwrap">${tblHtml(["",...F_D1],F_D2.map((d,i)=>[d,...FTAB[a][i].map(v=>v.toFixed(2))]))}</div>`).join("")}</div>`;}
  $("formula").innerHTML=h;
}
const FORMULA=`
<div class="card f"><h3>記述統計</h3>
<p>分散 s² = Σ(xᵢ−x̄)²/n（不偏分散は n−1 で割る）</p>
<p>相関係数 r = s<sub>xy</sub>/(s<sub>x</sub>s<sub>y</sub>)</p>
<p>偏相関 r<sub>xy·z</sub> = (r<sub>xy</sub>−r<sub>xz</sub>r<sub>yz</sub>)/√((1−r<sub>xz</sub>²)(1−r<sub>yz</sub>²))</p>
<p>変動係数 = s/x̄　　z = (x−x̄)/s　　偏差値 = 50+10z</p>
<p>外れ値の目安 Q₁−1.5IQR 未満・Q₃+1.5IQR 超</p></div>
<div class="card f"><h3>確率・確率変数</h3>
<p>P(A∪B) = P(A)+P(B)−P(A∩B)　P(A|B) = P(A∩B)/P(B)</p>
<p>ベイズ P(A|B) = P(A)P(B|A) / Σ P(Aᵢ)P(B|Aᵢ)</p>
<p>E[aX+b] = aE[X]+b　V[aX+b] = a²V[X]</p>
<p>V[X±Y] = V[X]+V[Y]±2Cov　Cov = E[XY]−E[X]E[Y]</p>
<p>チェビシェフ P(|X−μ| ≥ kσ) ≤ 1/k²</p></div>
<div class="card f"><h3>主な分布（期待値／分散）</h3>
<table class="qt"><tr><th>分布</th><th>期待値</th><th>分散</th></tr>
<tr><td>二項 B(n,p)</td><td>np</td><td>np(1−p)</td></tr><tr><td>ポアソン(λ)</td><td>λ</td><td>λ</td></tr>
<tr><td>幾何(p)※</td><td>1/p</td><td>(1−p)/p²</td></tr><tr><td>一様 U(a,b)</td><td>(a+b)/2</td><td>(b−a)²/12</td></tr>
<tr><td>指数(λ)</td><td>1/λ</td><td>1/λ²</td></tr><tr><td>正規 N(μ,σ²)</td><td>μ</td><td>σ²</td></tr></table>
<p class="small" style="margin-top:6px">※初めて成功するまでの試行回数で数えた場合</p></div>
<div class="card f"><h3>標本分布・推定</h3>
<p>標準誤差：平均 σ/√n、比率 √(p(1−p)/n)</p>
<p>平均（σ既知）x̄ ± z·σ/√n　（σ未知）x̄ ± t(n−1)·s/√n</p>
<p>比率 p̂ ± 1.96√(p̂(1−p̂)/n)</p>
<p>母分散 [(n−1)s²/χ²<sub>0.025</sub>, (n−1)s²/χ²<sub>0.975</sub>]</p>
<p>平均の差 (x̄₁−x̄₂) ± 1.96√(σ₁²/n₁+σ₂²/n₂)</p>
<p>標本サイズ n ≥ (zσ/E)²、比率 n ≥ z²p(1−p)/E²</p>
<p>二項の正規近似 P(X ≤ k) → z = (k+0.5−np)/√(np(1−p))</p></div>
<div class="card f"><h3>検定</h3>
<p>z の棄却域：両側5% 1.96・両側1% 2.576・片側5% 1.645・片側1% 2.326</p>
<p>比率 z = (p̂−p₀)/√(p₀(1−p₀)/n)</p>
<p>等分散 t：s<sub>p</sub>² = ((n₁−1)s₁²+(n₂−1)s₂²)/(n₁+n₂−2)、自由度 n₁+n₂−2</p>
<p>分散比 F = s₁²/s₂²、自由度 (n₁−1, n₂−1)　分散 χ² = (n−1)s²/σ₀²</p>
<p>比率の差 z = (p̂₁−p̂₂)/√(p̂(1−p̂)(1/n₁+1/n₂))（p̂ はプール）</p>
<p>χ² = Σ(O−E)²/E　適合度 k−1・独立性 (r−1)(c−1)、期待度数 = 行計×列計/総数</p>
<p>検出力 = 1−β（片側 z：1−Φ(1.645 − (μ₁−μ₀)/(σ/√n))）</p></div>
<div class="card f"><h3>回帰・分散分析</h3>
<p>傾き b = s<sub>xy</sub>/s<sub>x</sub>² = r·s<sub>y</sub>/s<sub>x</sub>、(x̄, ȳ) を通る</p>
<p>R² = 1 − 残差平方和/全平方和　調整済み 1 − (1−R²)(n−1)/(n−p−1)</p>
<p>t 値 = 推定値/標準誤差　F = (R²/p)/((1−R²)/(n−p−1))</p>
<p>一元配置：群間 df k−1、群内 df N−k、F = 群間MS/群内MS</p>
<p>二元配置：交互作用 df (a−1)(b−1)、誤差 df ab(r−1)</p></div>
<div class="card f"><h3>時系列</h3>
<p>平均成長率 = (最後/最初)^(1/年数) − 1</p>
<p>ラスパイレス Σp₁q₀/Σp₀q₀×100、パーシェ Σp₁q₁/Σp₀q₁×100</p></div>
<div class="card f"><h3>指数関数の値</h3>
<table class="qt"><tr><th>x</th><th>0.5</th><th>1</th><th>1.5</th><th>2</th><th>2.5</th><th>3</th></tr>
<tr><td>e<sup>−x</sup></td><td>0.607</td><td>0.368</td><td>0.223</td><td>0.135</td><td>0.082</td><td>0.050</td></tr></table></div>`;

// ---------- 電卓 ----------
let calcE="",calcAns=0;
function calcOpen(){$("calc").classList.remove("hide");calcShow();}
function calcClose(){$("calc").classList.add("hide");}
function calcShow(r){$("cexp").textContent=calcE||"0";$("cres").textContent=r!==undefined?r:"";}
function calcKey(k){
  if(k==="C"){calcE="";return calcShow();}
  if(k==="←"){calcE=calcE.replace(/(Ans|.)$/,"");return calcShow();}
  if(k==="="){try{const v=calcEval(calcE);calcAns=v;calcShow("= "+(Math.abs(v)<1e-12?0:+v.toPrecision(10)));}catch(e){calcShow("式を確認してください");}return;}
  if(k==="x²")k="^2";
  calcE+=k;calcShow();
}
// + − × ÷ ^ √ ( ) と小数・Ans を読む小さな構文解析（eval は使わない）
function calcEval(s){
  let i=0;const peek=()=>s[i],eat=c=>{if(s.startsWith(c,i)){i+=c.length;return true;}return false;};
  function expr(){let v=term();for(;;){if(eat("+"))v+=term();else if(eat("−")||eat("-"))v-=term();else return v;}}
  function term(){let v=unary();for(;;){if(eat("×"))v*=unary();else if(eat("÷"))v/=unary();else return v;}}
  function unary(){if(eat("−")||eat("-"))return -unary();return power();}
  function power(){const b=prim();if(eat("^"))return Math.pow(b,unary());return b;}
  function prim(){
    if(eat("√"))return Math.sqrt(unary());
    if(eat("(")){const v=expr();eat(")");return v;}
    if(eat("Ans"))return calcAns;
    const m=/^\d*\.?\d+/.exec(s.slice(i));if(!m)throw 0;i+=m[0].length;return parseFloat(m[0]);
  }
  const v=expr();if(i<s.length)throw 0;return v;
}

// ---------- 画面切り替え ----------
const VIEWS=["home","topics","topic","mockhome","mock","formula","quiz"];
const TABOF={home:"home",quiz:"home",topics:"topics",topic:"topics",mockhome:"mockhome",mock:"mockhome",formula:"formula"};
function go(v){
  VIEWS.forEach(x=>$(x).classList.toggle("hide",x!==v));
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("on",t.dataset.v===TABOF[v]));
  if(v==="home")home();else if(v==="topics")topics();else if(v==="mockhome")mockHome();else if(v==="formula")formula();
  if(v!=="mock")clearInterval(timer);
  window.scrollTo(0,0);
}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{if(S.cur&&TABOF[t.dataset.v]!=="mockhome"){/* 模試の途中でも他の画面へ移れる（時間は進む） */}go(t.dataset.v);});
document.querySelectorAll("#calc [data-k]").forEach(b=>b.onclick=()=>calcKey(b.dataset.k));
save();
go("home");
// オフライン対応（ホーム画面アプリ用）
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){
  window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{});});
}
