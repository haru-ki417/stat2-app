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
  let t=0;while(c.length<4&&t<200){t++;const k=(Math.random()<.5?-1:1)*(0.1+Math.random()*0.5);const v=ans===0?k:ans*(1+k);const s=F(v);if(!c.includes(s))c.push(s);}
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
function genOne(fid){const fs=fid?[fid]:FIELDS.map(f=>f.id).filter(id=>GEN[id]);const f=pick(fs);const q=pick(GEN[f])();q.id="g";return q;}
