// 計算ドリル：数値を毎回変えて問題を作る。答えはここで計算する
// GEN[分野] に問題を作る関数を並べる。各関数は {f, q, c, a:0, e, gen:true} を返す
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const sum=a=>a.reduce((s,v)=>s+v,0);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const frac=(a,b)=>{const g=gcd(a,b);return b/g===1?String(a/g):(a/g)+"/"+(b/g);};
const comb=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r);};
const fact=k=>k<=1?1:k*fact(k-1);
function fmt(v,d){if(d===undefined)d=2;let s=(Math.round(v*Math.pow(10,d))/Math.pow(10,d)).toFixed(d);if(/^-0\.?0*$/.test(s))s=s.slice(1);return s.replace("-","−");}
function phi(z){const t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2);const p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p;}
const T025={4:2.776,5:2.571,6:2.447,7:2.365,8:2.306,9:2.262,10:2.228,11:2.201,12:2.179,14:2.145,15:2.131,19:2.093,24:2.064};
// 数値の選択肢を作る（ans: 正解、wr: よくある誤答、d: 小数桁、u: 単位）
function mk(f,q,ans,wr,e,d,u){
  u=u||"";const F=v=>fmt(v,d)+u;const c=[F(ans)];
  for(const w of wr){if(!isFinite(w))continue;const s=F(w);if(!c.includes(s))c.push(s);if(c.length===4)break;}
  let t=0;while(c.length<4&&t<200){t++;const k=(Math.random()<.5?-1:1)*(0.1+Math.random()*0.5);const v=Math.abs(ans)<1e-9?k:ans*(1+k);const s=F(v);if(!c.includes(s))c.push(s);}
  return {f,q,c,a:0,e,gen:true};
}
// 文字列の選択肢を作る
function mkS(f,q,ans,wr,e){const c=[ans];for(const w of wr){if(!c.includes(w))c.push(w);if(c.length===4)break;}return {f,q,c,a:0,e,gen:true};}
const P=v=>fmt(v,3);

const GEN={
desc:[
()=>{const x=Array.from({length:5},()=>ri(1,20)),n=5,m=sum(x)/n,ss=sum(x.map(v=>(v-m)**2)),sd=Math.sqrt(ss/n);
 return mk("desc",`データ ${x.join(", ")} の標準偏差（n で割る定義）は？`,sd,[Math.sqrt(ss/(n-1)),ss/n,sum(x.map(v=>Math.abs(v-m)))/n],
 `平均 = ${fmt(m,1)}。偏差平方和 = ${fmt(ss)}。分散 = ${fmt(ss)}/${n} = ${fmt(ss/n)}、標準偏差 = √${fmt(ss/n)} ≈ ${fmt(sd)}。n−1 で割ると ${fmt(Math.sqrt(ss/(n-1)))} になる。`,2);},
()=>{const n=pick([7,8]),x=Array.from({length:n},()=>ri(1,30)),s=x.slice().sort((a,b)=>a-b);
 const med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
 return mk("desc",`データ ${x.join(", ")} の中央値は？`,med,[x[Math.floor(n/2)],sum(x)/n,s[Math.floor(n/2)]],
 `小さい順に並べると ${s.join(", ")}。${n}個なので${n%2?`${(n+1)/2}番目の値`:`${n/2}番目と${n/2+1}番目の平均`}で ${fmt(med,1)}。並べ替えずに真ん中を取るのは誤り。`,1);},
()=>{const sx=ri(2,9),sy=ri(2,9),r0=pick([-0.8,-0.6,-0.4,0.3,0.5,0.6,0.7,0.8,0.9]),cov=Math.round(r0*sx*sy*100)/100,r=cov/(sx*sy);
 return mk("desc",`x の標準偏差 ${sx}、y の標準偏差 ${sy}、共分散 ${fmt(cov)} のとき、相関係数は？`,r,[cov/(sx+sy),r*r,cov/(sx*sx)],
 `r = 共分散/(s<sub>x</sub>s<sub>y</sub>) = ${fmt(cov)}/(${sx}×${sy}) ≈ ${fmt(r)}。`,2);},
()=>{const xb=ri(10,50),yb=ri(20,100),sx=ri(2,10),sy=ri(2,10),r=pick([0.4,0.5,0.6,0.8,-0.5,-0.7]),dx=pick([-6,-4,4,6,8]),x0=xb+dx,b=r*sy/sx,yh=yb+b*dx;
 return mk("desc",`x̄=${xb}、ȳ=${yb}、s<sub>x</sub>=${sx}、s<sub>y</sub>=${sy}、相関係数 r=${r}。y の x への回帰直線で x=${x0} のときの予測値は？`,yh,[yb+r*sx/sy*dx,yb+sy/sx*dx,yb+r*dx],
 `傾き b = r·s<sub>y</sub>/s<sub>x</sub> = ${r}×${sy}/${sx} ≈ ${fmt(b,3)}。直線は (x̄, ȳ) を通るので ŷ = ${yb} + ${fmt(b,3)}×(${x0}−${xb}) ≈ ${fmt(yh)}。`,2);},
()=>{const m=ri(50,70),s=pick([4,6,8,10,12,20]),z=pick([-1.5,-1,-0.5,0.5,1,1.5,2]),x=m+s*z,h=50+10*z;
 return mk("desc",`平均 ${m}点、標準偏差 ${s}点のテストで ${fmt(x,0)}点の偏差値は？`,h,[50+(x-m),50+10*(x-m)/(s*s),10*z],
 `z = (${fmt(x,0)}−${m})/${s} = ${z}。偏差値 = 50 + 10z = ${fmt(h,1)}。`,1);},
()=>{const q1=ri(10,40),iqr=pick([4,6,8,10,12,14,16,20]),q3=q1+iqr,up=Math.random()<.6;
 const ans=up?q3+1.5*iqr:q1-1.5*iqr;
 return mk("desc",`Q<sub>1</sub>=${q1}、Q<sub>3</sub>=${q3} のとき、外れ値判定の${up?"上側":"下側"}の境界（${up?"Q<sub>3</sub>+1.5×IQR":"Q<sub>1</sub>−1.5×IQR"}）は？`,ans,up?[q3+iqr,q3+3*iqr,q1+1.5*iqr]:[q1-iqr,q1-3*iqr,q3-1.5*iqr],
 `IQR = ${q3}−${q1} = ${iqr}。${up?`${q3} + 1.5×${iqr}`:`${q1} − 1.5×${iqr}`} = ${fmt(ans,1)}。`,1);},
()=>{const a=pick([10,20,30,40,50]),b=pick([-10,-20,-30,5]),g=(Math.sqrt((1+a/100)*(1+b/100))-1)*100;
 return mk("desc",`ある指標が1年目に ${a>0?"+":""}${a}%、2年目に ${b>0?"+":""}${b}% 変化した。1年あたりの平均変化率（幾何平均）は？`,g,[(a+b)/2,a+b,((1+a/100)*(1+b/100)-1)*100],
 `√(${1+a/100}×${1+b/100}) − 1 = √${fmt((1+a/100)*(1+b/100),3)} − 1 ≈ ${fmt(g/100,4)}。算術平均 ${(a+b)/2}% は誤り。`,1,"%");},
()=>{const n1=ri(10,40),n2=ri(10,40),m1=ri(50,80);let m2=ri(50,80);if(m2===m1)m2+=5;const w=(n1*m1+n2*m2)/(n1+n2);
 return mk("desc",`A組 ${n1}人の平均 ${m1}点、B組 ${n2}人の平均 ${m2}点。2組全体の平均点は？`,w,[(m1+m2)/2,(n2*m1+n1*m2)/(n1+n2),(m1+m2)/2+1],
 `合計点 = ${n1}×${m1} + ${n2}×${m2} = ${n1*m1+n2*m2}。人数 ${n1+n2} で割って ${fmt(w,1)}。単純な平均 ${fmt((m1+m2)/2,1)} は人数の違いを無視している。`,1);}
],
coll:[
()=>{const N=[ri(2,9)*1000,ri(2,9)*1000,ri(2,9)*1000],T=sum(N),n=pick([100,200,300,500]),k=ri(0,2),ans=Math.round(n*N[k]/T);
 return mk("coll",`3つの層の大きさが ${N.join("人、")}人。全体から ${n}人を比例配分の層化抽出で選ぶとき、第${k+1}層から選ぶ人数は？（四捨五入）`,ans,[Math.round(n/3),Math.round(n*N[(k+1)%3]/T),Math.round(N[k]/T*100)],
 `比例配分は層の大きさに比例させる。${n}×${N[k]}/${T} ≈ ${fmt(n*N[k]/T,1)} → ${ans}人。`,0,"人");},
()=>{const N=pick([1000,2000,3000,5000]),n=pick([50,100,200]),k=N/n,s=ri(1,k),m=pick([3,5,10]);
 return mk("coll",`番号1〜${N}の名簿から系統抽出で${n}人選ぶ。最初の番号が ${s} のとき、${m}番目に選ばれる番号は？`,s+(m-1)*k,[s+m*k,m*k,s+(m-1)*n],
 `抽出間隔 = ${N}/${n} = ${k}。${m}番目は ${s} + (${m}−1)×${k} = ${s+(m-1)*k}。`,0);}
],
prob:[
()=>{const s=ri(3,11),c=6-Math.abs(s-7);
 return mkS("prob",`サイコロを2個投げて、出た目の和が ${s} になる確率は？`,frac(c,36),[frac(c+1,36),frac(c,12),"1/6","1/12","1/9","5/36","1/18"].filter(x=>x!==frac(c,36)),
 `和が ${s} になる組は ${c}通り（36通り中）。${c}/36 = ${frac(c,36)}。`);},
()=>{const p=ri(1,6)/10,q=ri(1,6)/10,ans=p+q-p*q;
 return mk("prob",`独立な事象 A, B で P(A)=${p}、P(B)=${q}。P(A∪B) は？`,ans,[p+q,p*q,1-p*q],
 `P(A∩B) = ${p}×${q} = ${fmt(p*q)}。P(A∪B) = ${p}+${q}−${fmt(p*q)} = ${fmt(ans)}。`,2);},
()=>{const p=pick([0.05,0.1,0.2,0.3]),n=pick([2,3,4,5]),ans=1-Math.pow(1-p,n);
 return mk("prob",`確率 ${p} で起こる事象を独立に ${n}回試す。少なくとも1回起こる確率は？`,ans,[n*p,Math.pow(p,n),Math.pow(1-p,n)],
 `余事象「1回も起こらない」= (1−${p})<sup>${n}</sup> = ${P(Math.pow(1-p,n))}。1 − ${P(Math.pow(1-p,n))} = ${P(ans)}。`,3);},
()=>{const pr=pick([0.01,0.02,0.05,0.1]),se=pick([0.8,0.9,0.95,0.99]),fp=pick([0.02,0.05,0.1]),a=pr*se,b=(1-pr)*fp,ppv=a/(a+b)*100;
 return mk("prob",`有病率 ${pr*100}%、病気の人を陽性と判定する確率 ${se*100}%、病気でない人を誤って陽性と判定する確率 ${fp*100}%。陽性の人が病気である確率は？`,ppv,[se*100,pr*se*100,(1-fp)*100],
 `P(病気∩陽性) = ${pr}×${se} = ${fmt(a,4)}、P(健康∩陽性) = ${fmt(1-pr)}×${fp} = ${fmt(b,4)}。${fmt(a,4)}/(${fmt(a,4)}+${fmt(b,4)}) ≈ ${fmt(ppv,1)}%。`,1,"%");},
()=>{const R=ri(3,7),W=ri(2,6),N=R+W;
 return mkS("prob",`赤玉 ${R}個、白玉 ${W}個の袋から、戻さずに2個取り出す。2個とも赤の確率は？`,frac(R*(R-1),N*(N-1)),[frac(R*R,N*N),frac(R,N),frac(R*(R-1),N*N),frac(R-1,N-1)].filter(x=>x!==frac(R*(R-1),N*(N-1))),
 `${R}/${N} × ${R-1}/${N-1} = ${frac(R*(R-1),N*(N-1))}。戻す場合の (${R}/${N})² と区別する。`);},
()=>{const ab=pick([0.1,0.12,0.15,0.2]),b=pick([0.3,0.4,0.5,0.6]),ans=ab/b;
 return mk("prob",`P(A∩B)=${ab}、P(B)=${b} のとき、P(A|B) は？`,ans,[ab*b,b-ab,ab/(1-b)],`P(A|B) = P(A∩B)/P(B) = ${ab}/${b} = ${P(ans)}。`,3);}
],
dist:[
()=>{const n=ri(10,50),p=pick([0.1,0.2,0.3,0.4,0.6]),E=n*p,V=n*p*(1-p),S=(e,v)=>`期待値 ${fmt(e,1)}、分散 ${fmt(v,2)}`;
 return mkS("dist",`X ~ B(${n}, ${p}) の期待値と分散は？`,S(E,V),[S(E,E),S(E,p*(1-p)),S(E,n*p*p)],`E = np = ${fmt(E,1)}、V = np(1−p) = ${n}×${p}×${fmt(1-p,1)} = ${fmt(V,2)}。`);},
()=>{let n,p,k,ans;do{n=ri(3,6);p=pick([0.2,0.3,0.4,0.5]);k=ri(0,n);ans=comb(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}while(ans<0.02);
 return mk("dist",`X ~ B(${n}, ${p}) のとき P(X=${k}) は？`,ans,[Math.pow(p,k)*Math.pow(1-p,n-k),comb(n,k)*Math.pow(p,k),k/n],
 `<sub>${n}</sub>C<sub>${k}</sub> × ${p}<sup>${k}</sup> × ${fmt(1-p,1)}<sup>${n-k}</sup> = ${comb(n,k)} × ${fmt(Math.pow(p,k),4)} × ${fmt(Math.pow(1-p,n-k),4)} ≈ ${fmt(ans,4)}。`,4);},
()=>{const l=pick([1,1.5,2,2.5,3]),k=ri(0,3),ans=Math.pow(l,k)*Math.exp(-l)/fact(k);
 return mk("dist",`X が平均 ${l} のポアソン分布に従うとき P(X=${k}) は？（e<sup>−${l}</sup> ≈ ${P(Math.exp(-l))}）`,ans,[Math.pow(l,k)*Math.exp(-l),Math.exp(-l),Math.pow(l,k)*Math.exp(-k)/fact(k)],
 `P(X=k) = λ<sup>k</sup>e<sup>−λ</sup>/k! = ${l}<sup>${k}</sup>×${P(Math.exp(-l))}/${fact(k)} ≈ ${P(ans)}。`,3);},
()=>{const E=ri(2,10),V=pick([1,4,9,16,25]),a=pick([-3,-2,2,3,4,5]),b=ri(1,10)*pick([1,-1]),S=(e,v)=>`期待値 ${e}、分散 ${v}`;
 return mkS("dist",`E[X]=${E}、V[X]=${V} のとき Y = ${a}X ${b<0?"− "+(-b):"+ "+b} の期待値と分散は？`,S(a*E+b,a*a*V),[S(a*E+b,a*V),S(a*E+b,a*a*V+b),S(a*E,a*a*V),S(a*E+b,V)],
 `E[Y] = ${a}×${E} ${b<0?"− "+(-b):"+ "+b} = ${a*E+b}。V[Y] = (${a})²×${V} = ${a*a*V}。定数項は分散に影響しない。`);},
()=>{const vx=ri(2,20),vy=ri(2,20),cv=pick([-3,-2,-1,1,2,3,4]),mn=Math.random()<.5,ans=vx+vy+(mn?-2:2)*cv;
 return mk("dist",`V[X]=${vx}、V[Y]=${vy}、Cov(X,Y)=${cv} のとき V[X ${mn?"−":"+"} Y] は？`,ans,[vx+vy,mn?vx-vy:vx+vy+cv,vx+vy+(mn?2:-2)*cv],
 `V[X${mn?"−":"+"}Y] = V[X]+V[Y]${mn?"−":"+"}2Cov = ${vx}+${vy}${mn?"−":"+"}2×(${cv}) = ${ans}。`,0);},
()=>{const mu=pick([50,60,100,170]),s=pick([5,10,15,20]),z=pick([0.5,1,1.5,2,-1,-0.5]),c=mu+z*s,up=Math.random()<.5,Fz=phi(Math.abs(z));
 const ans=up?1-phi(z):phi(z);
 return mk("dist",`X ~ N(${mu}, ${s}²) のとき P(X ${up?">":"<"} ${fmt(c,1).replace(/\.0$/,"")}) は？（Φ(${Math.abs(z)}) = ${P(Fz)}、Φ は標準正規分布の累積分布関数）`,ans,[1-ans,Fz-0.5,2*Math.min(ans,1-ans)],
 `標準化 z = (${fmt(c,1).replace(/\.0$/,"")}−${mu})/${s} = ${z}。${up?"上側":"下側"}の確率なので、対称性も使って ${P(ans)}。`,3);},
()=>{const mu=pick([50,100,60]),s=pick([10,15,20]),a=pick([0.5,1,1.5,2]),b=pick([0.5,1,1.5,2]),ans=phi(b)-phi(-a);
 return mk("dist",`X ~ N(${mu}, ${s}²) のとき P(${mu-a*s} < X < ${mu+b*s}) は？（Φ(${a})=${P(phi(a))}${a!==b?`、Φ(${b})=${P(phi(b))}`:""}）`,ans,[phi(b)-phi(a),phi(b),1-phi(a)+phi(b)-0.5],
 `z に直すと −${a} < Z < ${b}。Φ(${b}) − (1 − Φ(${a})) = ${P(phi(b))} + ${P(phi(a))} − 1 = ${P(ans)}。`,3);},
()=>{const m=pick([2,4,5,10]),r=pick([0.5,1,1.5,2,3]),t=m*r,ans=Math.exp(-r);
 return mk("dist",`待ち時間が平均 ${m}分の指数分布に従う。${fmt(t,1).replace(/\.0$/,"")}分以上待つ確率は？`,ans,[1-ans,Math.exp(-t),Math.min(0.99,r/4)],
 `λ = 1/${m}。P(X > t) = e<sup>−λt</sup> = e<sup>−${r}</sup> ≈ ${P(ans)}。（公式タブの e<sup>−x</sup> 表を参照）`,3);},
()=>{const a=ri(0,10),w=pick([6,12,18,24]),b=a+w,mean=Math.random()<.3;
 return mean?mk("dist",`X ~ U(${a}, ${b})（一様分布）の期待値は？`,(a+b)/2,[w/2,b/2,(a+b)/3],`(a+b)/2 = (${a}+${b})/2 = ${(a+b)/2}。`,1)
 :mk("dist",`X ~ U(${a}, ${b})（一様分布）の分散は？`,w*w/12,[w*w/6,w/12,w*w/4],`(b−a)²/12 = ${w}²/12 = ${w*w/12}。`,1);},
()=>{const d=pick([2,3,4,5,6,10]),p=1/d;
 return mk("dist",`成功確率 1/${d} の試行を、初めて成功するまで繰り返す。試行回数の期待値は？`,d,[d-1,d*d,(1-p)/(p*p)],`幾何分布の期待値 1/p = ${d}回。`,1,"回");}
],
samp:[
()=>{const s=pick([4,6,8,10,12,15,20]),n=pick([4,9,16,25,36,100]),se=s/Math.sqrt(n);
 return mk("samp",`母標準偏差 ${s}、標本サイズ ${n} のとき、標本平均の標準誤差は？`,se,[s/n,s*s/n,s],`σ/√n = ${s}/${Math.sqrt(n)} = ${fmt(se)}。`,2);},
()=>{const mu=pick([50,100,200]),s=pick([10,12,15,20]),n=pick([4,16,25,36]),z=pick([0.5,1,1.5,2]),se=s/Math.sqrt(n),c=mu+z*se,ans=1-phi(z);
 return mk("samp",`母平均 ${mu}、母標準偏差 ${s} の母集団から n=${n} の標本をとる。標本平均が ${fmt(c,1).replace(/\.0$/,"")} を超える確率は？（Φ(${z})=${P(phi(z))}）`,ans,[1-phi(z/Math.sqrt(n)),phi(z),2*ans],
 `標本平均の標準誤差 = ${s}/√${n} = ${fmt(se,1)}。z = (${fmt(c,1).replace(/\.0$/,"")}−${mu})/${fmt(se,1)} = ${z}。1 − ${P(phi(z))} = ${P(ans)}。σ で割るのは誤り。`,3);},
()=>{const n=pick([4,5,10,20]),v=pick([2,3,4,9]),sm=Math.random()<.5;
 return sm?mk("samp",`分散 ${v} の母集団から独立に ${n}個とったとき、その合計の分散は？`,n*v,[v/n,n*n*v,v],`独立なので分散は足し算。${n}×${v} = ${n*v}。`,1)
 :mk("samp",`分散 ${v} の母集団から独立に ${n}個とったとき、標本平均の分散は？`,v/n,[n*v,v/(n*n),v],`V[X̄] = σ²/n = ${v}/${n} = ${fmt(v/n,2)}。`,2);},
()=>{const t=pick(["one","pair","two","var","gof"]);let q,ans,wr,e;
 if(t==="one"){const n=ri(8,30);q=`n=${n} の1標本 t 検定（母分散未知）の自由度は？`;ans=n-1;wr=[n,n-2,n+1];e=`n−1 = ${n-1}。`;}
 else if(t==="pair"){const n=ri(8,20);q=`${n}人の前後の測定値で対応のある t 検定を行う。自由度は？`;ans=n-1;wr=[2*n-2,n,2*n-1];e=`差をとった ${n}個のデータの1標本検定なので n−1 = ${n-1}。`;}
 else if(t==="two"){const a=ri(8,20),b=ri(8,20);q=`標本サイズ ${a} と ${b} の等分散2標本 t 検定の自由度は？`;ans=a+b-2;wr=[a+b-1,a+b,Math.min(a,b)-1];e=`n₁+n₂−2 = ${a+b-2}。`;}
 else if(t==="var"){const n=ri(8,30);q=`n=${n} の標本で母分散のカイ二乗検定を行う。自由度は？`;ans=n-1;wr=[n,n-2,n+1];e=`(n−1)s²/σ² ~ χ²(n−1)。自由度 ${n-1}。`;}
 else{const k=ri(4,8);q=`${k}個のカテゴリの度数でカイ二乗適合度検定（推定するパラメータなし）。自由度は？`;ans=k-1;wr=[k,k-2,2*(k-1)];e=`カテゴリ数 − 1 = ${k-1}。`;}
 return mk("samp",q,ans,wr,e,0);}
],
est:[
()=>{const xb=ri(40,120),s=pick([5,8,10,12,15,20]),n=pick([16,25,36,64,100]),se=s/Math.sqrt(n),I=z=>`[${fmt(xb-z*se)}, ${fmt(xb+z*se)}]`;
 return mkS("est",`母標準偏差 ${s}（既知）、n=${n}、x̄=${xb}。母平均の95%信頼区間は？`,I(1.96),[I(1.645),I(2.576),`[${fmt(xb-1.96*s)}, ${fmt(xb+1.96*s)}]`],
 `標準誤差 = ${s}/√${n} = ${fmt(se)}。${xb} ± 1.96×${fmt(se)} = ${xb} ± ${fmt(1.96*se)}。`);},
()=>{const df=pick(Object.keys(T025).map(Number)),n=df+1,xb=ri(20,80),s=ri(2,12),t=T025[df],se=s/Math.sqrt(n),I=k=>`[${fmt(xb-k*se)}, ${fmt(xb+k*se)}]`;
 return mkS("est",`母分散未知、n=${n}、x̄=${xb}、不偏標準偏差 s=${s}。母平均の95%信頼区間は？（t<sub>0.025</sub>(${df}) = ${t}）`,I(t),[I(1.96),`[${fmt(xb-t*s)}, ${fmt(xb+t*s)}]`,`[${fmt(xb-t*s/n)}, ${fmt(xb+t*s/n)}]`],
 `標準誤差 = ${s}/√${n} ≈ ${fmt(se,3)}。${xb} ± ${t}×${fmt(se,3)} = ${xb} ± ${fmt(t*se)}。自由度 n−1 = ${df} の t を使う。`);},
()=>{const n=pick([100,400,900,1600,2500]),p=pick([0.1,0.2,0.3,0.4,0.5,0.6]),se=Math.sqrt(p*(1-p)/n),I=v=>`[${P(p-v)}, ${P(p+v)}]`;
 return mkS("est",`n=${n} の調査で標本比率 ${p}。母比率の95%信頼区間は？`,I(1.96*se),[I(2.576*se),I(1.96*p*(1-p)/Math.sqrt(n)),I(se),I(1.645*se),I(1.96*Math.sqrt(p/n))],
 `標準誤差 = √(${p}×${fmt(1-p,1)}/${n}) = ${fmt(se,4)}。${p} ± 1.96×${fmt(se,4)} = ${p} ± ${fmt(1.96*se,4)}。`);},
()=>{const s=pick([5,10,15,20]),E=pick([1,2,2.5,4,5]),ans=Math.ceil(Math.pow(1.96*s/E,2));
 return mk("est",`母標準偏差 ${s}。母平均の95%信頼区間の片側の幅（誤差）を ${E} 以下にするのに必要な最小の標本サイズは？`,ans,[Math.ceil(1.96*s/E),Math.ceil(Math.pow(1.645*s/E,2)),Math.ceil(Math.pow(2.576*s/E,2))],
 `1.96×${s}/√n ≤ ${E} → n ≥ (1.96×${s}/${E})² = ${fmt(Math.pow(1.96*s/E,2))}。切り上げて ${ans}。`,0);},
()=>{const E=pick([0.02,0.03,0.05]),ans=Math.ceil(1.96*1.96*0.25/(E*E));
 return mk("est",`母比率が見当もつかない。95%信頼区間の片側の幅を ${E} 以下にするのに必要な最小の標本サイズは？`,ans,[Math.ceil(1.96*0.5/E),Math.ceil(2.576*2.576*0.25/(E*E)),Math.ceil(1.96*1.96*0.25/E)],
 `p=0.5 を使う。n ≥ 1.96²×0.25/${E}² = ${fmt(1.96*1.96*0.25/(E*E),1)}。切り上げて ${ans}。`,0);},
()=>{const W=pick([2,4,6,8,12]),m=pick([4,9,16,2]),ans=W/Math.sqrt(m);
 return mk("est",`ある信頼区間の幅が ${W}。他の条件を変えず標本サイズを ${m}倍にすると幅は？`,ans,[W/m,W*Math.sqrt(m),W/2===ans?W/3:W/2],`幅は 1/√n に比例。${W}/√${m} = ${fmt(ans)}。`,2);}
],
test:[
()=>{const m0=pick([50,100,60]),s=pick([8,10,12,15]),n=pick([16,25,36,64]),zt=pick([-2.5,-2,-1.5,1.2,1.8,2.2,2.8,3]),se=s/Math.sqrt(n),xb=Math.round((m0+zt*se)*10)/10,z=(xb-m0)/se;
 return mk("test",`H₀: μ=${m0}、σ=${s}（既知）、n=${n}、x̄=${xb}。検定統計量 z は？`,z,[(xb-m0)/s,(xb-m0)/(s/n),(xb-m0)*Math.sqrt(n)/(s*s)],
 `z = (${xb}−${m0})/(${s}/√${n}) = ${fmt(xb-m0,1)}/${fmt(se)} ≈ ${fmt(z)}。`,2);},
()=>{const two=Math.random()<.6,z=pick([0.8,1.5,1.7,1.9,2.1,2.4,2.7,3.1])*(two&&Math.random()<.4?-1:1),a=Math.abs(z);
 const c5=two?1.96:1.645,c1=two?2.576:2.326;
 const O=["5%でも1%でも棄却される","5%では棄却、1%では棄却されない","5%でも棄却されない","この情報では判断できない"];
 const k=a>c1?0:a>c5?1:2;
 return mkS("test",`${two?"両側":"右片側"}検定で z = ${z} だった。有意水準5%と1%での判断は？`,O[k],O.filter((_,i)=>i!==k),
 `${two?"両側":"右片側"}の棄却域は5%で ${two?"|z|":"z"} > ${c5}、1%で ${two?"|z|":"z"} > ${c1}。${a} は${k===0?"両方を超える":k===1?"5%の境界だけを超える":"5%の境界も超えない"}。`);},
()=>{const n=pick([100,200,400,900]),p0=pick([0.5,0.3,0.2]),dl=pick([-0.06,-0.04,0.03,0.05,0.07]),x=Math.round(n*(p0+dl)),ph=x/n,se=Math.sqrt(p0*(1-p0)/n),z=(ph-p0)/se;
 return mk("test",`H₀: p=${p0}。n=${n} 回中 ${x} 回成功した。検定統計量 z は？`,z,[(ph-p0)/Math.sqrt(ph*(1-ph)/n),(ph-p0)/(p0*(1-p0)/n),(x-n*p0)/n],
 `p̂ = ${fmt(ph,3)}。標準誤差は H₀ の p で √(${p0}×${fmt(1-p0,1)}/${n}) = ${fmt(se,4)}。z = (${fmt(ph,3)}−${p0})/${fmt(se,4)} ≈ ${fmt(z)}。`,2);},
()=>{const n=pick([9,16,25]),d=pick([1.2,1.5,2,2.4,3]),s=pick([2,3,4,5]),t=d/(s/Math.sqrt(n));
 return mk("test",`${n}人の前後差の平均が ${d}、差の不偏標準偏差が ${s}。対応のある t 検定の t 値は？`,t,[d/s,d/(s/n),d*Math.sqrt(n)/(s*s)],
 `t = d̄/(s/√n) = ${d}/(${s}/${Math.sqrt(n)}) = ${fmt(t)}。自由度 ${n-1}。`,2);},
()=>{const N=pick([100,200,300]),R=ri(2,8)*N/10,C=ri(2,8)*N/10,ans=R*C/N;
 return mk("test",`総数 ${N} の分割表で、ある行の合計が ${R}、ある列の合計が ${C}。独立性の検定でそのセルの期待度数は？`,ans,[R*C/(N*N)*100,(R+C)/2,R*C/100===ans?R/2:R*C/100],`期待度数 = 行合計×列合計/総数 = ${R}×${C}/${N} = ${fmt(ans,1)}。`,1);},
()=>{const N=pick([60,90,120,150]),E=N/3,d1=ri(-8,8)||3,d2=ri(-8,8),O=[E+d1,E+d2,E-d1-d2],st=(d1*d1+d2*d2+(d1+d2)**2)/E;
 return mk("test",`3つのカテゴリが等確率という H₀ のもと、${N}回の観測度数が ${O.join("、")} だった。カイ二乗統計量は？`,st,[(d1*d1+d2*d2+(d1+d2)**2)/N,(Math.abs(d1)+Math.abs(d2)+Math.abs(d1+d2))/E,(d1*d1+d2*d2+(d1+d2)**2)/(E*E)],
 `期待度数は各 ${E}。(O−E) = ${d1}, ${d2}, ${-d1-d2}。Σ(O−E)²/E = ${d1*d1+d2*d2+(d1+d2)**2}/${E} ≈ ${fmt(st)}。自由度 2。`,2);},
()=>{const r=ri(2,5),c=ri(2,5);
 return mk("test",`${r}行×${c}列の分割表で独立性の検定を行う。自由度は？`,(r-1)*(c-1),[r*c-1,r+c-2,r*c],`(${r}−1)×(${c}−1) = ${(r-1)*(c-1)}。`,0);},
()=>{const x1=ri(50,70),x2=x1-pick([2,3,4,5,-3]),s1=pick([6,8,10]),s2=pick([6,8,10]),n1=pick([25,36,50]),n2=pick([25,36,50]),se=Math.sqrt(s1*s1/n1+s2*s2/n2),z=(x1-x2)/se;
 return mk("test",`2群の母標準偏差は ${s1} と ${s2}（既知）。n₁=${n1}、x̄₁=${x1}、n₂=${n2}、x̄₂=${x2}。差の検定統計量 z は？`,z,[(x1-x2)/(s1/Math.sqrt(n1)+s2/Math.sqrt(n2)),(x1-x2)/Math.sqrt(s1*s1+s2*s2),(x1-x2)/(s1*s1/n1+s2*s2/n2)],
 `標準誤差 = √(${s1}²/${n1} + ${s2}²/${n2}) ≈ ${fmt(se,3)}。z = ${x1-x2}/${fmt(se,3)} ≈ ${fmt(z)}。標準誤差どうしを単純に足すのは誤り。`,2);}
],
reg:[
()=>{const b=ri(5,50)/10,se=ri(2,20)/10,t=b/se;
 return mk("reg",`回帰係数の推定値 ${b}、標準誤差 ${se}。t 値は？`,t,[se/b,b*se,b-se],`t = ${b}/${se} ≈ ${fmt(t)}。`,2);},
()=>{const T=pick([100,120,150,200,250,400]),E=Math.round(T*(0.1+Math.random()*0.6)/5)*5,ans=1-E/T;
 return mk("reg",`全平方和 ${T}、残差平方和 ${E}。決定係数は？`,ans,[E/T,(T-E)/E,1-E/(T+E)],`R² = 1 − ${E}/${T} = ${P(ans)}。`,3);},
()=>{const b0=ri(-10,20),b1=pick([0.5,1.5,2,2.5,3,-1.5]),x=ri(2,20),yh=b0+b1*x,y=Math.round(yh+pick([-4,-3,-2,2,3,5])),e=y-yh;
 return mk("reg",`回帰式 ŷ = ${b0} ${b1<0?"− "+(-b1):"+ "+b1}x で、x=${x} の実測値が y=${y}。残差は？`,e,[-e,yh,y+yh],`予測値 ŷ = ${fmt(yh,1)}。残差 = 実測値 − 予測値 = ${y} − ${fmt(yh,1)} = ${fmt(e,1)}。`,1);},
()=>{const R=pick([0.5,0.6,0.7,0.8]),n=pick([20,30,50]),p=pick([2,3,4]),adj=1-(1-R)*(n-1)/(n-p-1);
 return mk("reg",`n=${n}、説明変数 ${p}個の重回帰で R²=${R}。自由度調整済み決定係数は？`,adj,[R,1-(1-R)*(n-p-1)/(n-1),1-(1-R)*(n-1)/(n-p)],
 `1 − (1−R²)(n−1)/(n−p−1) = 1 − ${fmt(1-R,1)}×${n-1}/${n-p-1} ≈ ${P(adj)}。`,3);},
()=>{const b0=ri(-5,20),b1=pick([1.5,2,-0.5,3]),b2=pick([0.8,-1.2,2.5,4]),x1=ri(1,10),x2=ri(1,10),y=b0+b1*x1+b2*x2;
 return mk("reg",`重回帰式 ŷ = ${b0} + ${b1}x₁ + ${b2}x₂ で、x₁=${x1}、x₂=${x2} のときの予測値は？`,y,[b1*x1+b2*x2,b0+b1*x2+b2*x1,b0+b1*x1-b2*x2],`${b0} + ${b1}×${x1} + ${b2}×${x2} = ${fmt(y,1)}。`,1);},
()=>{const r=pick([-0.9,-0.7,-0.5,0.4,0.6,0.8,0.9]);
 return mk("reg",`単回帰で相関係数 r=${r}。決定係数は？`,r*r,[Math.abs(r),Math.sqrt(Math.abs(r)),r*r*2>1?1-r*r:r*r*2],`R² = r² = ${fmt(r*r)}。`,2);}
],
anova:[
()=>{const k=ri(3,5),m=ri(4,8),N=k*m,S=(a,b)=>`群間 ${a}、群内 ${b}`;
 return mkS("anova",`${k}群（各 ${m}個）の一元配置分散分析。群間と群内の自由度は？`,S(k-1,N-k),[S(k,N-k),S(k-1,N-1),S(k-1,m-1)],`群間 = k−1 = ${k-1}、群内 = N−k = ${N}−${k} = ${N-k}。`);},
()=>{const k=ri(3,5),m=ri(4,8),N=k*m,SB=ri(4,40)*5,SW=ri(10,60)*5,F=(SB/(k-1))/(SW/(N-k));
 return mk("anova",`${k}群・全 ${N}個の一元配置分散分析で、群間平方和 ${SB}、群内平方和 ${SW}。F 値は？`,F,[SB/SW,(SB/k)/(SW/N),(SB/(k-1))/(SW/(N-1))],
 `群間平均平方 = ${SB}/${k-1} = ${fmt(SB/(k-1))}、群内平均平方 = ${SW}/${N-k} = ${fmt(SW/(N-k))}。F = ${fmt(F)}。`,2);},
()=>{const k=ri(3,5),m=ri(4,8),N=k*m,SB=ri(4,40)*5,SW=ri(10,60)*5,ST=SB+SW,ans=SW/(N-k);
 return mk("anova",`${k}群・全 ${N}個の一元配置分散分析で、全平方和 ${ST}、群間平方和 ${SB}。群内平均平方は？`,ans,[SW/(N-1),ST/(N-k),SW/(k-1)],
 `群内平方和 = ${ST} − ${SB} = ${SW}。自由度 ${N}−${k} = ${N-k} で割って ${fmt(ans)}。`,2);},
()=>{const x=Array.from({length:6},()=>ri(10,60)),t=ri(1,4),ma=(x[t-1]+x[t]+x[t+1])/3;
 return mk("anova",`時系列 ${x.join(", ")} の3項移動平均で、${t+1}番目の時点の値は？`,ma,[(x[t]+x[t+1]+(x[t+2]||x[t]))/3,(x[t-1]+x[t])/2,sum(x)/6],
 `中心化して前後1つずつ：(${x[t-1]}+${x[t]}+${x[t+1]})/3 = ${fmt(ma,1)}。`,1);},
()=>{const p0=[ri(80,150),ri(200,400)],p1=[p0[0]+ri(-10,30),p0[1]+ri(-20,60)],q0=[ri(5,20),ri(2,10)],q1=[ri(5,20),ri(2,10)];
 const L=(p1[0]*q0[0]+p1[1]*q0[1])/(p0[0]*q0[0]+p0[1]*q0[1])*100,Pa=(p1[0]*q1[0]+p1[1]*q1[1])/(p0[0]*q1[0]+p0[1]*q1[1])*100;
 return mk("anova",`財A：基準時の価格 ${p0[0]}・数量 ${q0[0]}、比較時の価格 ${p1[0]}・数量 ${q1[0]}。財B：基準時 ${p0[1]}・${q0[1]}、比較時 ${p1[1]}・${q1[1]}。ラスパイレス価格指数は？`,L,[Pa,(p1[0]+p1[1])/(p0[0]+p0[1])*100,(p1[0]/p0[0]+p1[1]/p0[1])/2*100],
 `基準時の数量で重み付け：Σp₁q₀/Σp₀q₀×100 = ${p1[0]*q0[0]+p1[1]*q0[1]}/${p0[0]*q0[0]+p0[1]*q0[1]}×100 ≈ ${fmt(L,1)}。比較時の数量を使うとパーシェ指数（${fmt(Pa,1)}）。`,1);}
]
};

// ---------- 上の問題に出題範囲の項目を付ける（並びは GEN と同じ） ----------
const GTAG={
 desc:["d_spread","d_center","d_corr","m_r1","d_use","d_spread","a_ts","d_center"],
 coll:["c_samp","c_samp"],
 prob:["p_rule","p_rule","p_rule","p_bayes","p_rule","p_rule"],
 dist:["r_disc","r_disc","r_disc","r_var","r_var","r_cont","r_cont","r_cont","r_cont","r_disc"],
 samp:["s_samp","s_samp","s_samp","s_tcf"],
 est:["e_mean","e_mean","e_prop","e_size","e_size","e_size"],
 test:["h_one","h_basic","h_one","h_two","h_chi","h_chi","h_chi","h_two"],
 reg:["m_out","m_r1","m_r1","m_reg","m_reg","m_r1"],
 anova:["a_anova","a_anova","a_anova","a_ts","a_ts"]
};
// GENS：計算ドリルの全パターン。k は成績を記録するための名前
const GENS=[];
for(const f in GEN)GEN[f].forEach((fn,i)=>GENS.push({k:f+i,t:GTAG[f][i],fn}));

// ---------- 追加の計算の部品 ----------
function randn(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function lgamma(z){const c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 if(z<0.5)return Math.log(Math.PI/Math.sin(Math.PI*z))-lgamma(1-z);z-=1;let x=c[0];for(let i=1;i<9;i++)x+=c[i]/(z+i);const t=z+7.5;return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x);}
// t 分布の両側 p 値（密度をシンプソン法で積分）
function tP(t,v){const a=Math.abs(t),N=800,h=a/N,k=Math.exp(lgamma((v+1)/2)-lgamma(v/2))/Math.sqrt(v*Math.PI),f=x=>k*Math.pow(1+x*x/v,-(v+1)/2);
 let s=f(0)+f(a);for(let i=1;i<N;i++)s+=f(i*h)*(i%2?4:2);return Math.max(0,1-2*s*h/3);}
const pTxt=p=>p<0.001?"&lt; 0.001":fmt(p,3);
const C=comb;
// 表（HTML）
function tbl(head,rows){return `<table class="qt"><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;}
// 図（SVG）。色はページの CSS 変数を使うのでダークモードでも見える
const svg=(w,h,body)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" role="img">${body}</svg>`;
const AX='stroke="var(--sub)" stroke-width="1"',GR='stroke="var(--line)" stroke-width="1"',TX='fill="var(--sub)" font-size="11"';
function pickOthers(all,ans,n){return shuffle(all.filter(x=>x!==ans)).slice(0,n);}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const add=(t,k,fn)=>GENS.push({t,k,fn});

// ---------- 追加の計算ドリル（範囲の抜けを埋める） ----------
add("d_center","d_freqmean",()=>{const v=[1,2,3,4,5].map(x=>x*pick([1,2,10])),n=v.map(()=>ri(1,12)),N=sum(n),m=sum(v.map((x,i)=>x*n[i]))/N;
 return mk("desc",`度数分布表から平均を求めよ。${tbl(["値",...v],[["度数",...n]])}`,m,[sum(v)/v.length,sum(v.map((x,i)=>x*n[i]))/v.length,v[n.indexOf(Math.max(...n))]],
 `Σ(値×度数)/総度数 = ${sum(v.map((x,i)=>x*n[i]))}/${N} ≈ ${fmt(m)}。値だけの平均や最頻値と混同しない。`,2);});
add("d_corr","d_partial",()=>{let rxy,rxz,ryz;do{rxy=pick([0.4,0.5,0.6,0.7,0.8]);rxz=pick([0.5,0.6,0.7,0.8]);ryz=pick([0.4,0.5,0.6,0.7,0.8]);}while(1-rxy*rxy-rxz*rxz-ryz*ryz+2*rxy*rxz*ryz<=0.05);
 const a=(rxy-rxz*ryz)/Math.sqrt((1-rxz*rxz)*(1-ryz*ryz));
 return mk("desc",`r<sub>xy</sub>=${rxy}、r<sub>xz</sub>=${rxz}、r<sub>yz</sub>=${ryz} のとき、z の影響を除いた x と y の偏相関係数 r<sub>xy·z</sub> は？`,a,[rxy-rxz*ryz,(rxy-rxz*ryz)/((1-rxz*rxz)*(1-ryz*ryz)),rxy*rxz*ryz],
 `(r<sub>xy</sub> − r<sub>xz</sub>r<sub>yz</sub>)/√((1−r<sub>xz</sub>²)(1−r<sub>yz</sub>²)) = (${rxy} − ${fmt(rxz*ryz,2)})/√(${fmt(1-rxz*rxz,2)}×${fmt(1-ryz*ryz,2)}) ≈ ${fmt(a,3)}。`,3);});
add("d_corr","d_scatter",()=>{const T=[-0.9,-0.5,0,0.5,0.9],tg=pick(T);let x,y,r;
 do{x=Array.from({length:40},randn);y=x.map(v=>tg*v+Math.sqrt(1-tg*tg)*randn());const mx=sum(x)/40,my=sum(y)/40;r=sum(x.map((v,i)=>(v-mx)*(y[i]-my)))/Math.sqrt(sum(x.map(v=>(v-mx)**2))*sum(y.map(v=>(v-my)**2)));}while(Math.abs(r-tg)>0.06);
 const sx=v=>30+(v+3)/6*220,sy=v=>190-(v+3)/6*170;
 const pts=x.map((v,i)=>`<circle cx="${fmt(sx(Math.max(-3,Math.min(3,v))),1)}" cy="${fmt(sy(Math.max(-3,Math.min(3,y[i]))),1)}" r="3.2" fill="var(--accent)" opacity=".75"/>`).join("");
 const g=svg(270,205,`<line x1="30" y1="190" x2="255" y2="190" ${AX}/><line x1="30" y1="15" x2="30" y2="190" ${AX}/><text x="245" y="203" ${TX}>x</text><text x="15" y="22" ${TX}>y</text>${pts}`);
 const L=v=>fmt(v,1);
 return mkS("desc",`次の散布図の相関係数に最も近いのは？${g}`,L(tg),pickOthers(T.map(L),L(tg),3),`点の並びから読む。この図の相関係数は約 ${fmt(r,2)}。右上がりなら正、右下がりなら負で、直線に近いほど |r| は1に近い。`);});
add("d_cat","d_cross",()=>{const a=ri(10,60),b=ri(10,60),c=ri(10,60),d=ri(10,60),row=Math.random()<.5;
 const T=tbl(["","購入あり","購入なし","計"],[["男性",a,b,a+b],["女性",c,d,c+d],["計",a+c,b+d,a+b+c+d]]);
 return row?mk("desc",`クロス表で、女性の購入率は？${T}`,c/(c+d)*100,[c/(a+c)*100,c/(a+b+c+d)*100,(a+c)/(a+b+c+d)*100],`女性の行の合計で割る（行パーセント）：${c}/${c+d} ≈ ${fmt(c/(c+d)*100,1)}%。`,1,"%")
 :mk("desc",`クロス表で、購入した人のうち女性の割合は？${T}`,c/(a+c)*100,[c/(c+d)*100,c/(a+b+c+d)*100,(c+d)/(a+b+c+d)*100],`購入ありの列の合計で割る（列パーセント）：${c}/${a+c} ≈ ${fmt(c/(a+c)*100,1)}%。`,1,"%");});
add("d_spread","d_boxplot",()=>{let v;do{v=[ri(0,4),0,0,0,ri(14,20)].map(x=>x*5);v[1]=v[0]+5*ri(1,4);v[3]=v[4]-5*ri(1,4);v[2]=5*ri(v[1]/5+1,v[3]/5-1);}while(!(v[1]<v[2]&&v[2]<v[3]));
 const X=x=>20+x*2.4;let ax="";for(let t=0;t<=100;t+=10)ax+=`<line x1="${X(t)}" y1="20" x2="${X(t)}" y2="88" ${GR}/><text x="${X(t)}" y="102" ${TX} text-anchor="middle">${t}</text>`;
 for(let t=5;t<100;t+=10)ax+=`<line x1="${X(t)}" y1="20" x2="${X(t)}" y2="88" ${GR} stroke-dasharray="2 3"/>`;
 const g=svg(270,108,ax+`<line x1="${X(v[0])}" y1="54" x2="${X(v[1])}" y2="54" stroke="var(--ink)" stroke-width="1.6"/><line x1="${X(v[3])}" y1="54" x2="${X(v[4])}" y2="54" stroke="var(--ink)" stroke-width="1.6"/>
 <line x1="${X(v[0])}" y1="44" x2="${X(v[0])}" y2="64" stroke="var(--ink)" stroke-width="1.6"/><line x1="${X(v[4])}" y1="44" x2="${X(v[4])}" y2="64" stroke="var(--ink)" stroke-width="1.6"/>
 <rect x="${X(v[1])}" y="34" width="${X(v[3])-X(v[1])}" height="40" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.6"/><line x1="${X(v[2])}" y1="34" x2="${X(v[2])}" y2="74" stroke="var(--accent)" stroke-width="2.4"/>`);
 const k=pick(["iqr","med","range"]),A={iqr:v[3]-v[1],med:v[2],range:v[4]-v[0]},N={iqr:"四分位範囲",med:"中央値",range:"範囲（最大−最小）"};
 return mk("desc",`箱ひげ図から読み取れる${N[k]}は？（目盛りは5ごと）${g}`,A[k],Object.keys(A).filter(x=>x!==k).map(x=>A[x]).concat([v[3]-v[2],v[2]-v[1]]),
 `最小 ${v[0]}、Q₁ ${v[1]}、中央値 ${v[2]}、Q₃ ${v[3]}、最大 ${v[4]}。四分位範囲は Q₃−Q₁ = ${v[3]-v[1]}、範囲は ${v[4]-v[0]}。`,0);});
add("d_dist","d_hist",()=>{const kind=pick(["right","left","sym"]);const base={right:[3,9,14,12,9,6,4,3,2,1],left:[1,2,3,4,6,9,12,14,9,3],sym:[1,3,6,10,14,14,10,6,3,1]}[kind].map(v=>Math.max(1,v+ri(-1,1)));
 const mx=Math.max(...base),bars=base.map((v,i)=>`<rect x="${25+i*23}" y="${170-v/mx*140}" width="22" height="${v/mx*140}" fill="var(--accent)" opacity=".8"/>`).join("");
 const g=svg(270,185,`<line x1="22" y1="170" x2="258" y2="170" ${AX}/>${bars}`);
 const O=["平均 > 中央値","平均 < 中央値","平均 ≈ 中央値","この図からは判断できない"],a={right:0,left:1,sym:2}[kind];
 return mkS("desc",`次のヒストグラムの分布について、平均と中央値の関係として最も適切なのは？${g}`,O[a],O.filter((_,i)=>i!==a),
 {right:"右に裾が長い（歪度が正）。大きい値に平均が引っ張られるので 平均 > 中央値。",left:"左に裾が長い（歪度が負）。小さい値に引っ張られて 平均 < 中央値。",sym:"左右ほぼ対称なので平均と中央値はほぼ等しい。"}[kind]);});
add("d_use","d_zcompare",()=>{let ma,sa,xa,mb,sb,xb,za,zb;do{ma=ri(50,70);sa=pick([5,8,10,12,15]);xa=ma+ri(-5,20);mb=ri(40,80);sb=pick([4,6,10,16,20]);xb=mb+ri(-5,25);za=(xa-ma)/sa;zb=(xb-mb)/sb;}while(Math.abs(za-zb)<0.25);
 const O=["国語の方が相対的に良い","数学の方が相対的に良い","同じくらい","平均が違うので比べられない"],k=za>zb?0:1;
 return mkS("desc",`国語：平均${ma}・標準偏差${sa}で${xa}点。数学：平均${mb}・標準偏差${sb}で${xb}点。集団の中での位置が良いのは？`,O[k],O.filter((_,i)=>i!==k),
 `z で比べる。国語 (${xa}−${ma})/${sa} ≈ ${fmt(za)}、数学 (${xb}−${mb})/${sb} ≈ ${fmt(zb)}。点数そのものでは比べられない。`);});
add("p_bayes","p_bayes3",()=>{const s=pick([[50,30,20],[40,35,25],[60,30,10],[45,35,20]]),d=[ri(1,5),ri(1,5),ri(1,5)],k=ri(0,2),tot=sum(s.map((v,i)=>v*d[i])),ans=s[k]*d[k]/tot;
 return mk("prob",`機械A・B・Cが製品の${s.join("%・")}%を作り、不良率はそれぞれ${d.join("%・")}%。不良品を1つ選んだとき、それが機械${"ABC"[k]}製である確率は？`,ans,[d[k]/sum(d),s[k]/100,s[k]*d[k]/10000],
 `全体の不良率 = ${s.map((v,i)=>`${v/100}×${d[i]/100}`).join(" + ")} = ${fmt(tot/10000,4)}。${"ABC"[k]} の分 ${fmt(s[k]*d[k]/10000,4)} を割って ${fmt(ans,3)}。`,3);});
add("r_var","r_cheb",()=>{const m=ri(40,70),s=pick([4,5,8,10]),k=pick([1.5,2,2.5,3,4]),d=k*s;
 return mk("dist",`ある分布の平均が ${m}、標準偏差が ${s}（分布の形は不明）。値が ${fmt(m-d,1).replace(/\.0$/,"")} 以下または ${fmt(m+d,1).replace(/\.0$/,"")} 以上になる割合の上限は（チェビシェフの不等式）？`,100/(k*k),[100/k,100-100/(k*k),2*(1-phi(k))*100],
 `平均から ${fmt(d,1).replace(/\.0$/,"")} = ${k}σ 離れている。P(|X−μ| ≥ kσ) ≤ 1/k² = 1/${fmt(k*k,2).replace(/\.00$/,"")} ≈ ${fmt(100/(k*k),1)}%。`,1,"%");});
add("r_var","r_joint",()=>{let p;do{p=[ri(1,7),ri(1,7),ri(1,7),0].map(v=>v*0.05);p[3]=Math.round((1-p[0]-p[1]-p[2])*100)/100;}while(p[3]<0.05);
 const [p00,p01,p10,p11]=p,ex=p10+p11,ey=p01+p11,cov=p11-ex*ey,T=tbl(["","Y=0","Y=1"],[["X=0",fmt(p00),fmt(p01)],["X=1",fmt(p10),fmt(p11)]]),k=pick(["cov","exy","px"]);
 if(k==="px")return mk("dist",`X, Y の同時確率分布が次の表のとき、P(X=1) は？${T}`,ex,[p11,p10,ey],`周辺分布：X=1 の行を合計して ${fmt(p10)} + ${fmt(p11)} = ${fmt(ex)}。`,2);
 if(k==="exy")return mk("dist",`X, Y の同時確率分布が次の表のとき、E[XY] は？${T}`,p11,[ex*ey,ex+ey-1,p00],`XY=1 となるのは X=1 かつ Y=1 のときだけなので E[XY] = ${fmt(p11)}。`,2);
 return mk("dist",`X, Y の同時確率分布が次の表のとき、Cov(X, Y) は？${T}`,cov,[p11,ex*ey,p11-ex],`E[X] = ${fmt(ex)}、E[Y] = ${fmt(ey)}、E[XY] = ${fmt(p11)}。Cov = E[XY] − E[X]E[Y] = ${fmt(p11)} − ${fmt(ex*ey,4)} = ${fmt(cov,4)}。`,4);});
add("r_var","r_cdf",()=>{const pr=[ri(1,4),ri(1,4),ri(1,4),ri(1,4)],T=sum(pr),F=pr.map((_,i)=>sum(pr.slice(0,i+1))/T),a=ri(1,2),b=ri(a+1,4),ans=F[b-1]-F[a-1];
 return mk("dist",`X は 1〜4 の値をとり、累積分布関数が F(1)=${fmt(F[0])}、F(2)=${fmt(F[1])}、F(3)=${fmt(F[2])}、F(4)=1.00。P(${a} &lt; X ≤ ${b}) は？`,ans,[F[b-1],1-F[a-1],1-F[b-1],F[b-1]+F[a-1]],
 `P(${a} &lt; X ≤ ${b}) = F(${b}) − F(${a}) = ${fmt(F[b-1])} − ${fmt(F[a-1])} = ${fmt(ans)}。`,2);});
add("r_disc","r_hyper",()=>{const N=ri(8,15),K=ri(2,4),ans=C(K,1)*C(N-K,2)/C(N,3);
 return mk("dist",`${N}個の製品のうち${K}個が不良品。戻さずに3個取り出すとき、不良品がちょうど1個である確率は？`,ans,[3*(K/N)*Math.pow(1-K/N,2),K/N,C(K,1)*C(N-K,2)/(N*N*N)],
 `超幾何分布。<sub>${K}</sub>C<sub>1</sub>×<sub>${N-K}</sub>C<sub>2</sub>/<sub>${N}</sub>C<sub>3</sub> = ${C(K,1)}×${C(N-K,2)}/${C(N,3)} ≈ ${fmt(ans,3)}。戻す場合（二項分布）とは違う。`,3);});
add("s_samp","s_cc",()=>{const n=pick([50,100,200]),p=pick([0.2,0.3,0.4,0.5]),m=n*p,s=Math.sqrt(n*p*(1-p)),k=Math.round(m+pick([-1.5,-1,1,1.5,2])*s),z=(k+0.5-m)/s;
 return mk("samp",`X ~ B(${n}, ${p})。P(X ≤ ${k}) を正規近似（連続修正あり）で求めるとき、標準化した値 z は？`,z,[(k-m)/s,(k-0.5-m)/s,(k+0.5-m)/(n*p*(1-p))],
 `平均 np = ${fmt(m,1)}、標準偏差 √(np(1−p)) ≈ ${fmt(s,3)}。z = (${k}+0.5 − ${fmt(m,1)})/${fmt(s,3)} ≈ ${fmt(z)}。`,2);});
add("e_other","e_varci",()=>{const n=pick([10,11,16,21]),df=n-1,s2=pick([4,6.5,9,12,16,25]),ci=C_DF.indexOf(df),up=CTAB[ci][2],lo=CTAB[ci][5],I=(a,b)=>`[${fmt(a)}, ${fmt(b)}]`;
 return mkS("est",`正規母集団から n=${n}、不偏分散 s²=${s2}。母分散の95%信頼区間は？（χ²<sub>0.025</sub>(${df}) = ${lo}、χ²<sub>0.975</sub>(${df}) = ${up}）`,I(df*s2/lo,df*s2/up),[I(n*s2/lo,n*s2/up),I(df*Math.sqrt(s2)/lo,df*Math.sqrt(s2)/up),I(s2-1.96*Math.sqrt(s2),s2+1.96*Math.sqrt(s2))],
 `(n−1)s² = ${df}×${s2} = ${fmt(df*s2,1)}。上側2.5%点 ${lo} で割ると下限、上側97.5%点 ${up} で割ると上限。`);});
add("e_other","e_diffci",()=>{const x1=ri(50,80),x2=x1-ri(-3,8),s1=pick([6,8,10,12]),s2=pick([6,8,10,12]),n1=pick([25,36,49,64]),n2=pick([25,36,49,64]),se=Math.sqrt(s1*s1/n1+s2*s2/n2),d=x1-x2,I=k=>`[${fmt(d-k)}, ${fmt(d+k)}]`;
 return mkS("est",`2群の母標準偏差は ${s1} と ${s2}（既知）。n₁=${n1}、x̄₁=${x1}、n₂=${n2}、x̄₂=${x2}。μ₁−μ₂ の95%信頼区間は？`,I(1.96*se),[I(1.96*(s1/Math.sqrt(n1)+s2/Math.sqrt(n2))),I(1.645*se),I(1.96*Math.sqrt(s1*s1+s2*s2))],
 `標準誤差 = √(${s1}²/${n1} + ${s2}²/${n2}) ≈ ${fmt(se,3)}。${d} ± 1.96×${fmt(se,3)}。`);});
add("h_basic","h_power",()=>{const m0=pick([50,100,200]),se=pick([1,2,4,5]),dl=pick([1,1.5,2,2.5,3]),m1=m0+dl*se,c=1.645-dl,ans=1-phi(c);
 return mk("test",`H₀: μ=${m0}、H₁: μ>${m0}、有意水準5%の片側 z 検定（標準誤差 σ/√n = ${se}）。真の平均が ${fmt(m1,1).replace(/\.0$/,"")} のときの検出力は？（Φ(${fmt(Math.abs(c),3)}) = ${P(phi(Math.abs(c)))}）`,ans,[phi(c),1-phi(dl),0.05],
 `棄却域は x̄ > ${m0} + 1.645×${se}。真の平均で標準化すると z > 1.645 − (${fmt(m1,1).replace(/\.0$/,"")}−${m0})/${se} = ${fmt(c,3)}。その確率 1 − Φ(${fmt(c,3)}) ≈ ${P(ans)}。`,3);});
add("h_one","h_varstat",()=>{const n=pick([10,16,21,26]),s2=pick([12,15,18,25,30]),v0=pick([10,16,20]),x=(n-1)*s2/v0;
 return mk("test",`H₀: σ²=${v0}。n=${n} の標本の不偏分散が ${s2}。検定統計量 χ² は？`,x,[n*s2/v0,(n-1)*v0/s2,s2/v0],`χ² = (n−1)s²/σ₀² = ${n-1}×${s2}/${v0} = ${fmt(x)}。自由度 ${n-1} のカイ二乗分布と比べる。`,2);});
add("h_two","h_pooled",()=>{const n1=ri(8,15),n2=ri(8,15),x1=ri(50,70),x2=x1-pick([2,3,4,5,6]),v1=pick([9,16,25,36]),v2=pick([9,16,25,36]),sp2=((n1-1)*v1+(n2-1)*v2)/(n1+n2-2),t=(x1-x2)/Math.sqrt(sp2*(1/n1+1/n2));
 return mk("test",`等分散を仮定した2標本 t 検定。n₁=${n1}、x̄₁=${x1}、s₁²=${v1}、n₂=${n2}、x̄₂=${x2}、s₂²=${v2}。t 値は？`,t,[(x1-x2)/Math.sqrt(sp2),(x1-x2)/(Math.sqrt(sp2)*(1/n1+1/n2)),(x1-x2)/Math.sqrt(v1/n1+v2/n2),(x1-x2)/Math.sqrt(sp2/(n1+n2))],
 `プールした分散 s<sub>p</sub>² = (${n1-1}×${v1} + ${n2-1}×${v2})/${n1+n2-2} ≈ ${fmt(sp2,3)}。t = ${x1-x2}/√(${fmt(sp2,3)}×(1/${n1}+1/${n2})) ≈ ${fmt(t)}。自由度 ${n1+n2-2}。`,2);});
add("h_two","h_fratio",()=>{const n1=ri(8,16),n2=ri(8,16),a=pick([12,18,20,24,30]),b=pick([6,8,10,15]),big=a>=b,F=big?a/b:b/a,S=(f,x,y)=>`F = ${fmt(f)}、自由度 (${x}, ${y})`;
 const ans=big?S(F,n1-1,n2-1):S(F,n2-1,n1-1);
 return mkS("test",`母分散が等しいかの F 検定。群1：n=${n1}、s²=${a}。群2：n=${n2}、s²=${b}。大きい方の不偏分散を分子にしたときの F と自由度は？`,ans,[big?S(F,n2-1,n1-1):S(F,n1-1,n2-1),big?S(F,n1,n2):S(F,n2,n1),big?S(1/F,n1-1,n2-1):S(1/F,n2-1,n1-1),S(F*F,n1-1,n2-1),S(Math.abs(a-b),n1-1,n2-1)],
 `F = ${Math.max(a,b)}/${Math.min(a,b)} = ${fmt(F)}。自由度は（分子の n−1, 分母の n−1）。`);});
add("h_two","h_prop2",()=>{const n1=pick([100,200,250]),n2=pick([100,200,250]),x1=Math.round(n1*pick([0.3,0.35,0.4,0.45])),x2=Math.round(n2*pick([0.2,0.25,0.3])),p1=x1/n1,p2=x2/n2,pp=(x1+x2)/(n1+n2),z=(p1-p2)/Math.sqrt(pp*(1-pp)*(1/n1+1/n2));
 return mk("test",`A群 ${n1}人中 ${x1}人、B群 ${n2}人中 ${x2}人が「はい」と答えた。H₀: p<sub>A</sub>=p<sub>B</sub> の検定統計量 z（プールした比率を使う）は？`,z,[(p1-p2)/Math.sqrt(p1*(1-p1)/n1+p2*(1-p2)/n2),(p1-p2)/Math.sqrt(pp*(1-pp)/(n1+n2)),(p1-p2)/(pp*(1-pp)*(1/n1+1/n2))],
 `p̂ = (${x1}+${x2})/(${n1}+${n2}) ≈ ${fmt(pp,4)}。z = (${fmt(p1,3)}−${fmt(p2,3)})/√(${fmt(pp,4)}×${fmt(1-pp,4)}×(1/${n1}+1/${n2})) ≈ ${fmt(z)}。`,2);});
add("m_r1","m_slope",()=>{const sxx=pick([40,50,80,100,125,200]),b=pick([0.4,0.5,0.8,1.2,1.5,2,-0.6]),sxy=sxx*b,xb=ri(5,30),yb=ri(20,90),a=yb-b*xb,L=(a0,b0)=>`ŷ = ${fmt(a0,1)} ${b0<0?"−":"+"} ${fmt(Math.abs(b0),2)}x`;
 return mkS("reg",`Σ(x−x̄)² = ${sxx}、Σ(x−x̄)(y−ȳ) = ${fmt(sxy,0)}、x̄ = ${xb}、ȳ = ${yb}。最小二乗法による回帰直線は？`,L(a,b),[L(yb-sxx/sxy*xb,sxx/sxy),L(yb+b*xb,b),L(xb-b*yb,b),L(a,b*2)],
 `傾き b = ${fmt(sxy,0)}/${sxx} = ${fmt(b,2)}。切片 = ȳ − b x̄ = ${yb} − ${fmt(b,2)}×${xb} = ${fmt(a,1)}。`);});
add("m_r1","m_resid",()=>{const kind=pick(["ok","curve","funnel"]);let pts="";for(let i=0;i<45;i++){const x=Math.random(),e=kind==="ok"?randn()*0.6:kind==="curve"?(x-0.5)*(x-0.5)*9-0.75+randn()*0.18:randn()*0.12*(0.4+x*4.5);
 pts+=`<circle cx="${fmt(30+x*220,1)}" cy="${fmt(100-Math.max(-1.6,Math.min(1.6,e))*50,1)}" r="3" fill="var(--accent)" opacity=".75"/>`;}
 const g=svg(270,195,`<line x1="30" y1="100" x2="255" y2="100" ${GR} stroke-dasharray="4 3"/><line x1="30" y1="15" x2="30" y2="185" ${AX}/><line x1="30" y1="185" x2="255" y2="185" ${AX}/><text x="200" y="196" ${TX}>予測値</text><text x="4" y="20" ${TX}>残差</text>${pts}`);
 const O=["特に問題は見られない","非線形の関係が残っている","残差のばらつきが一定でない（不均一分散）","多重共線性が起きている"],a={ok:0,curve:1,funnel:2}[kind];
 return mkS("reg",`回帰分析の残差プロットが次のようになった。最も適切な解釈は？${g}`,O[a],O.filter((_,i)=>i!==a),
 {ok:"残差が0の周りに一様にばらついていて、パターンがない。",curve:"U字型のパターンがある。2次の項を入れるなどを検討する。",funnel:"予測値が大きいほど残差の幅が広がっている（ラッパ型）。対数変換などを検討する。"}[kind]+"多重共線性は説明変数どうしの相関の問題で、残差プロットからは読めない。");});
add("m_out","m_table",()=>{const n=ri(30,80),df=n-3,rows=[["(Intercept)",ri(-200,500)/10,ri(10,80)/10],["x1",ri(5,60)/10,ri(2,15)/10],["x2",-ri(5,40)/10,ri(2,15)/10]];
 const r=ri(1,2),miss=pick(["t","se","est"]),[nm,b,se]=rows[r],t=b/se;
 const T=tbl(["","Estimate","Std. Error","t value","Pr(&gt;|t|)"],rows.map(([nm2,b2,s2],i)=>[nm2,i===r&&miss==="est"?"<b>?</b>":fmt(b2,2),i===r&&miss==="se"?"<b>?</b>":fmt(s2,2),i===r&&miss==="t"?"<b>?</b>":fmt(b2/s2,2),pTxt(tP(b2/s2,df))]));
 const ask={t:["t value",t,[se/b,b*se,b-se]],se:["Std. Error",se,[b*t,t/b,b-t]],est:["Estimate",b,[t/se,se-t,se*t*2]]}[miss];
 return mk("reg",`重回帰（n=${n}）の出力の「?」に入る ${nm} の ${ask[0]} は？${T}`,ask[1],ask[2],`t value = Estimate / Std. Error。${nm}：${fmt(b,2)} / ${fmt(se,2)} = ${fmt(t,2)}。`,2);});
add("m_out","m_signif",()=>{const n=ri(40,100),df=n-4,names=["x1","x2","x3"],sig=names.map(()=>Math.random()<.5),rows=names.map((nm,i)=>{const se=ri(5,30)/10,t=(sig[i]?(2.3+Math.random()*2.5):(Math.random()*1.6))*(Math.random()<.5?-1:1);return [nm,t*se,se,t];});
 const T=tbl(["","Estimate","Std. Error","t value","Pr(&gt;|t|)"],[["(Intercept)",fmt(ri(-100,300)/10,2),fmt(ri(10,50)/10,2),"",""]].concat(rows.map(([nm,b,se,t])=>[nm,fmt(b,2),fmt(se,2),fmt(t,2),pTxt(tP(t,df))])));
 const L=s=>{const a=names.filter((_,i)=>s[i]);return a.length?a.join(" と "):"どれも有意でない";},ans=L(sig);
 const all=[];for(let m=0;m<8;m++)all.push(L([m&1,m&2,m&4].map(Boolean)));
 return mkS("reg",`重回帰（n=${n}）の出力。有意水準5%で有意な説明変数をすべて挙げたものは？${T}`,ans,pickOthers([...new Set(all)],ans,3),
 `Pr(&gt;|t|) が 0.05 未満の変数を選ぶ。|t| がおよそ2を超えるかでも判断できる。係数の符号（正負）は有意性に関係しない。`);});
add("m_out","m_fstat",()=>{const n=pick([30,40,50,60,100]),p=pick([2,3,4]),R=pick([0.3,0.4,0.5,0.6,0.7]),F=(R/p)/((1-R)/(n-p-1));
 return mk("reg",`n=${n}、説明変数 ${p}個の重回帰で R²=${R}。モデル全体の F 統計量は？`,F,[R/(1-R),(R/p)/((1-R)/(n-1)),(R/(p+1))/((1-R)/(n-p-1))],
 `F = (R²/p)/((1−R²)/(n−p−1)) = (${R}/${p})/(${fmt(1-R,1)}/${n-p-1}) ≈ ${fmt(F)}。自由度 (${p}, ${n-p-1})。`,2);});
add("a_anova","a_table",()=>{const k=ri(3,5),m=ri(4,8),N=k*m,SB=ri(4,40)*5,SW=ri(10,60)*5,d1=k-1,d2=N-k,MB=SB/d1,MW=SW/d2,F=MB/MW,miss=pick(["F","MB","SW","d2"]);
 const cell=(v,key,d)=>miss===key?"<b>?</b>":fmt(v,d);
 const T=tbl(["要因","自由度","平方和","平均平方","F"],[["群間",d1,SB,cell(MB,"MB",2),cell(F,"F",2)],["群内",cell(d2,"d2",0),cell(SW,"SW",0),fmt(MW,2),""],["全体",N-1,SB+SW,"",""]]);
 const A={F:[F,[MB/SW,SB/SW,MW/MB]],MB:[MB,[SB/k,SB*d1,SB/N]],SW:[SW,[SB+SW+SW,MW*N,MW*(N-1)]],d2:[d2,[N-1,N,d1]]}[miss];
 return mk("anova",`一元配置分散分析表の「?」に入る値は？${T}`,A[0],A[1],`平均平方 = 平方和/自由度、F = 群間の平均平方/群内の平均平方。群内の自由度 = 全体 ${N-1} − 群間 ${d1} = ${d2}。`,miss==="d2"||miss==="SW"?0:2);});
add("a_anova","a_twoway",()=>{const a=ri(2,4),b=ri(2,5),r=ri(2,4),k=pick(["ab","e"]);
 return k==="ab"?mk("anova",`二元配置分散分析（要因A ${a}水準 × 要因B ${b}水準、各組合せ ${r}回ずつ）。交互作用の自由度は？`,(a-1)*(b-1),[a*b-1,(a-1)+(b-1),a*b*(r-1)],`(a−1)(b−1) = ${a-1}×${b-1} = ${(a-1)*(b-1)}。`,0)
 :mk("anova",`二元配置分散分析（要因A ${a}水準 × 要因B ${b}水準、各組合せ ${r}回ずつ）。誤差（残差）の自由度は？`,a*b*(r-1),[a*b*r-1,(a-1)*(b-1),a*b*r-a-b],`全体 ${a*b*r-1} から A ${a-1}、B ${b-1}、交互作用 ${(a-1)*(b-1)} を引いて ab(r−1) = ${a*b*(r-1)}。`,0);});
add("a_ts","a_correlogram",()=>{const P=pick([4,12]),L=P===4?16:24;let bars="";const w=220/L;
 for(let h=1;h<=L;h++){const r=Math.cos(2*Math.PI*h/P)*Math.pow(0.97,h)*0.75+randn()*0.05,y=100-r*70;bars+=`<rect x="${32+(h-1)*w+1}" y="${Math.min(y,100)}" width="${w-2}" height="${Math.abs(100-y)}" fill="var(--accent)" opacity=".8"/>`;}
 let ticks="";for(let h=P;h<=L;h+=P)ticks+=`<text x="${32+(h-0.5)*w}" y="186" ${TX} text-anchor="middle">${h}</text>`;
 const g=svg(270,205,`<line x1="30" y1="100" x2="255" y2="100" ${AX}/><line x1="30" y1="25" x2="30" y2="175" ${AX}/><text x="2" y="30" ${TX}>+1</text><text x="2" y="178" ${TX}>−1</text>${bars}${ticks}<text x="34" y="201" ${TX}>ラグ →</text>`);
 const O=P===4?["4期（四半期データなら1年）","2期","8期","12期"]:["12期（月次データなら1年）","6期","4期","24期"];
 return mkS("anova",`ある時系列のコレログラム（自己相関）。最も考えられる周期は？${g}`,O[0],O.slice(1),`ラグ ${P}、${2*P} … で自己相関が大きく正になっているので、${P}期ごとに似た動きを繰り返している。`);});
add("a_ts","a_cagr",()=>{const n=pick([2,3,4,5]),v0=pick([100,200,400,500]),g=pick([3,5,8,10,12,-4]),vn=Math.round(v0*Math.pow(1+g/100,n)),ans=(Math.pow(vn/v0,1/n)-1)*100;
 return mk("anova",`売上が ${n}年間で ${v0} から ${vn} になった。1年あたりの平均成長率（幾何平均）は？`,ans,[(vn/v0-1)/n*100,(vn/v0-1)*100,(Math.pow(vn/v0,1/(n+1))-1)*100],
 `(${vn}/${v0})^(1/${n}) − 1 ≈ ${fmt(ans/100,4)}。全体の伸びを年数で割る（${fmt((vn/v0-1)/n*100,1)}%）のは誤り。`,1,"%");});
add("a_ts","a_index",()=>{const yrs=[2021,2022,2023,2024],v=yrs.map(()=>ri(80,160)),b=ri(0,3);let t;do{t=ri(0,3);}while(t===b);const ans=v[t]/v[b]*100;
 return mk("anova",`${tbl(["年",...yrs],[["値",...v]])}${yrs[b]}年を基準（=100）としたときの${yrs[t]}年の指数は？`,ans,[v[b]/v[t]*100,v[t]-v[b],v[t]/v[(b+1)%4]*100,v[t]/v[(b+2)%4]*100],`${v[t]}/${v[b]}×100 ≈ ${fmt(ans,1)}。`,1);});

// 出題：fid（分野）または tid（項目）で絞る。pool を渡すとその中から選ぶ
function genOne(o){o=o||{};let L=GENS;if(o.tid)L=GENS.filter(g=>g.t===o.tid);else if(o.fid)L=GENS.filter(g=>TOPIC[g.t].f===o.fid);if(o.pool)L=o.pool;
 const g=pick(L),q=g.fn();q.t=g.t;q.f=TOPIC[g.t].f;q.k=g.k;q.id="g";return q;}
