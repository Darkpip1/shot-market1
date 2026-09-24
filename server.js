const http=require("http");
const crypto=require("crypto");

const PORT=process.env.PORT||3000;
const ADMIN_USERNAME=process.env.ADMIN_USERNAME||"Vojta";
const ADMIN_PASSWORD_HASH=process.env.ADMIN_PASSWORD_HASH||"";
const sessions=new Set();

const data=[
 ["Nike Air Max 95","2 490 Kč","Móda","Jablonec nad Nisou","👟"],
 ["PlayStation 5","9 990 Kč","Gaming","Liberec","🎮"],
 ["iPhone 15 Pro","17 500 Kč","Elektronika","Jablonec nad Nisou","📱"],
 ["Moncler Maya","12 900 Kč","Móda","Tanvald","🧥"],
 ["AirPods Pro 2","3 990 Kč","Elektronika","Liberec","🎧"],
 ["Gaming PC RTX","24 990 Kč","Gaming","Jablonec nad Nisou","🖥️"]
];

const css=`
*{box-sizing:border-box}body{margin:0;background:#08090b;color:#f5f5f5;font-family:Arial,sans-serif}button,input{font:inherit}
nav{height:72px;border-bottom:1px solid #24262a;display:flex;align-items:center;justify-content:space-between;padding:0 6%;position:sticky;top:0;background:#090a0c;z-index:2}.logo{font-size:24px;font-weight:900}.g{color:#a6ff00}.links{display:flex;gap:10px;align-items:center}.btn{padding:10px 15px;border-radius:11px;border:1px solid #303238;background:#111317;color:#fff;text-decoration:none}.sell{background:#a6ff00;color:#050505;font-weight:800;border-color:#a6ff00}
.hero{padding:75px 8%;display:flex;justify-content:space-between;align-items:center;gap:40px;min-height:480px;background:radial-gradient(circle at 75% 35%,#1c270e,#08090b 48%)}.ey{color:#a6ff00;letter-spacing:3px;font-weight:800;font-size:12px}.hero h1{font-size:clamp(52px,8vw,90px);line-height:.92;letter-spacing:-5px;margin:15px 0}.lead{color:#aaa;max-width:580px;font-size:18px;line-height:1.5}.search{display:flex;max-width:650px;background:#121419;border:1px solid #292c31;border-radius:15px;padding:6px;margin-top:28px}.search input{flex:1;background:none;border:0;outline:0;color:#fff;padding:12px}.search button{border:0;border-radius:10px;background:#a6ff00;padding:0 22px;font-weight:800}.card{width:260px;height:280px;border:1px solid #292c31;border-radius:28px;display:grid;place-items:center;background:#111410}.orb{width:120px;height:120px;border-radius:32px;background:#a6ff00;color:#050505;display:grid;place-items:center;font-size:68px;font-weight:900;transform:rotate(-8deg)}
main{padding:55px 8% 90px}.head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:25px}.head h2{margin:0 0 7px;font-size:32px}.muted{color:#777}.cats{display:flex;gap:8px;flex-wrap:wrap}.cat{border:1px solid #292b30;background:#111317;color:#fff;padding:9px 14px;border-radius:11px}.cat.active{background:#a6ff00;color:#050505;border-color:#a6ff00;font-weight:800}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.item{border:1px solid #24262a;border-radius:19px;overflow:hidden;background:#111317}.photo{height:230px;display:grid;place-items:center;background:linear-gradient(135deg,#191c20,#0c0d10);font-size:82px}.info{padding:17px}.tag{font-size:11px;color:#a6ff00;font-weight:800;text-transform:uppercase}.info h3{margin:8px 0;font-size:19px}.bottom{display:flex;justify-content:space-between;align-items:center;margin-top:16px}.price{font-size:20px;font-weight:900}.detail{background:#111317;color:#fff;border:1px solid #303238;border-radius:10px;padding:8px 12px}
.admin{min-height:calc(100vh - 72px);padding:60px 8%;display:flex;justify-content:center}.panel{width:min(700px,100%);background:#111317;border:1px solid #292c31;border-radius:22px;padding:30px}.panel h1{margin-top:0}.field{display:block;margin:16px 0}.field span{display:block;color:#aaa;font-size:13px;margin-bottom:7px}.field input{width:100%;padding:13px;border-radius:10px;border:1px solid #303238;background:#090a0c;color:#fff;outline:none}.loginbtn{width:100%;padding:13px;border:0;border-radius:10px;background:#a6ff00;color:#050505;font-weight:900;cursor:pointer}.error{background:#32151a;color:#ff9ba5;border:1px solid #652832;padding:11px;border-radius:10px;margin-bottom:15px}.ok{background:#17250b;color:#baff7a;border:1px solid #39531d;padding:11px;border-radius:10px;margin-bottom:15px}.adminbox{display:flex;justify-content:space-between;gap:15px;align-items:center;border:1px solid #292c31;border-radius:15px;padding:18px;margin-top:20px}.logout{color:#fff;background:#191b20;border:1px solid #303238;border-radius:9px;padding:9px 13px;text-decoration:none}
footer{border-top:1px solid #222;padding:28px 8%;display:flex;justify-content:space-between;color:#777}
@media(max-width:850px){.card{display:none}.grid{grid-template-columns:repeat(2,1fr)}.hero{padding:60px 6%}main{padding:45px 6%}.head{align-items:flex-start;flex-direction:column}}@media(max-width:560px){.links .hide-mobile{display:none}.grid{grid-template-columns:1fr}.hero h1{font-size:58px}footer{flex-direction:column;gap:10px}}
`;

function page(title,body){
 return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${css}</style></head><body>
 <nav><a class="logo" href="/">SHOT<span class="g">MARKET</span></a><div class="links"><a class="btn hide-mobile" href="/">Procházet</a><a class="btn" href="/admin">Admin</a><a class="btn sell" href="/">+ Prodat</a></div></nav>${body}
 <footer><b>SHOT<span class="g">MARKET</span></b><span>© 2026 SHOTER · Marketplace</span></footer></body></html>`;
}

function home(){
 const cards=data.map(x=>`<article class="item"><div class="photo">${x[4]}</div><div class="info"><div class="tag">${x[2]}</div><h3>${x[0]}</h3><div class="muted">⌖ ${x[3]}</div><div class="bottom"><span class="price">${x[1]}</span><button class="detail">Zobrazit</button></div></div></article>`).join("");
 return page("SHOT Market",`<section class="hero"><div><div class="ey">NOVÁ GENERACE BAZARU</div><h1>Najdi. Kup.<br><span class="g">Prodej.</span></h1><p class="lead">Marketplace pro věci, které chceš mít. Jednoduše, rychle a bez zbytečností.</p><div class="search"><input id="q" placeholder="Co hledáš? třeba iPhone, Nike, PS5..."><button onclick="render()">Hledat</button></div></div><div class="card"><div><div class="orb">S</div><b>SHOT MARKET</b><small style="display:block;color:#777;text-align:center;margin-top:7px">by SHOTER</small></div></div></section>
 <main><div class="head"><div><h2>Prozkoumat nabídky</h2><div class="muted" id="count"></div></div><div class="cats" id="cats"></div></div><div class="grid" id="grid"></div></main>
 <script>const data=${JSON.stringify(data)};let cat="Vše";function render(){let q=document.getElementById("q").value.toLowerCase();let list=data.filter(x=>(cat==="Vše"||x[2]===cat)&&(x[0]+" "+x[3]).toLowerCase().includes(q));document.getElementById("count").textContent=list.length+" položek právě teď";document.getElementById("grid").innerHTML=list.map(x=>'<article class="item"><div class="photo">'+x[4]+'</div><div class="info"><div class="tag">'+x[2]+'</div><h3>'+x[0]+'</h3><div class="muted">⌖ '+x[3]+'</div><div class="bottom"><span class="price">'+x[1]+'</span><button class="detail">Zobrazit</button></div></div></article>').join("")}document.getElementById("cats").innerHTML=["Vše","Móda","Elektronika","Gaming"].map(x=>'<button class="cat '+(x===cat?"active":"")+'" onclick="cat=x;document.querySelectorAll(\\'.cat\\').forEach(b=>b.classList.remove(\\'active\\'));this.classList.add(\\'active\\');render()">'+x+"</button>").join("");render();</script>`);
}

function isAdmin(req){
 const cookie=req.headers.cookie||"";
 const m=cookie.match(/shot_admin=([^;]+)/);
 return m&&sessions.has(m[1]);
}
function adminLogin(error=""){
 return page("Admin login",`<main class="admin"><div class="panel"><div class="ey">SHOT MARKET</div><h1>Admin přihlášení</h1><p class="muted">Přístup pouze pro administrátora.</p>${error?'<div class="error">'+error+"</div>":""}<form method="POST" action="/admin/login"><label class="field"><span>Uživatelské jméno</span><input name="username" autocomplete="username" required></label><label class="field"><span>Heslo</span><input type="password" name="password" autocomplete="current-password" required></label><button class="loginbtn" type="submit">Přihlásit do administrace</button></form></div></main>`);
}
function adminDashboard(){
 return page("SHOT Market Admin",`<main class="admin"><div class="panel"><div class="ey">ADMIN PANEL</div><h1>Vítej, ${ADMIN_USERNAME} 👑</h1><p class="muted">Jsi přihlášen jako administrátor SHOT Market.</p><div class="adminbox"><div><b>Marketplace</b><br><span class="muted">${data.length} ukázkových nabídek</span></div><a class="logout" href="/admin/logout">Odhlásit</a></div><div class="adminbox"><div><b>Stav systému</b><br><span class="muted">Web běží a admin přihlášení je aktivní.</span></div><span class="g">● ONLINE</span></div></div></main>`);
}

const server=http.createServer((req,res)=>{
 if(req.method==="GET"&&req.url==="/"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});return res.end(home());}
 if(req.method==="GET"&&req.url==="/admin"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});return res.end(isAdmin(req)?adminDashboard():adminLogin());}
 if(req.method==="GET"&&req.url==="/admin/logout"){const cookie=(req.headers.cookie||"").match(/shot_admin=([^;]+)/);if(cookie)sessions.delete(cookie[1]);res.writeHead(302,{Location:"/admin","Set-Cookie":"shot_admin=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax"});return res.end();}
 if(req.method==="POST"&&req.url==="/admin/login"){
  let body="";req.on("data",c=>body+=c);req.on("end",()=>{const p=new URLSearchParams(body);if(!ADMIN_PASSWORD_HASH){res.writeHead(500,{"Content-Type":"text/html; charset=utf-8"});return res.end(adminLogin("Admin heslo není nastavené na serveru."));}const passHash=crypto.createHash("sha256").update(p.get("password")||"").digest("hex");if(p.get("username")===ADMIN_USERNAME&&passHash===ADMIN_PASSWORD_HASH){const token=crypto.randomBytes(32).toString("hex");sessions.add(token);res.writeHead(302,{Location:"/admin","Set-Cookie":`shot_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`});return res.end();}res.writeHead(401,{"Content-Type":"text/html; charset=utf-8"});res.end(adminLogin("Špatné uživatelské jméno nebo heslo."));});return;
 }
 res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});res.end("404");
});
server.listen(PORT,"0.0.0.0",()=>console.log("SHOT Market running on "+PORT));