'use client';
import { useMemo, useState } from "react";

const items = [
 {id:1,title:"Nike Air Max 95",price:"2 490 Kč",category:"Móda",location:"Jablonec nad Nisou",emoji:"👟"},
 {id:2,title:"PlayStation 5",price:"9 990 Kč",category:"Gaming",location:"Liberec",emoji:"🎮"},
 {id:3,title:"iPhone 15 Pro",price:"17 500 Kč",category:"Elektronika",location:"Jablonec nad Nisou",emoji:"📱"},
 {id:4,title:"Moncler Maya",price:"12 900 Kč",category:"Móda",location:"Tanvald",emoji:"🧥"},
 {id:5,title:"AirPods Pro 2",price:"3 990 Kč",category:"Elektronika",location:"Liberec",emoji:"🎧"},
 {id:6,title:"Gaming PC RTX",price:"24 990 Kč",category:"Gaming",location:"Jablonec nad Nisou",emoji:"🖥️"}
];

export default function Home(){
 const [category,setCategory]=useState("Vše");
 const [search,setSearch]=useState("");
 const [liked,setLiked]=useState([]);
 const filtered=useMemo(()=>items.filter(x=>(category==="Vše"||x.category===category)&&(`${x.title} ${x.location}`.toLowerCase().includes(search.toLowerCase()))),[category,search]);
 const toggle=(id)=>setLiked(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 return <main>
  <header className="nav"><div className="logo">SHOT<span>MARKET</span></div><div className="navlinks"><a>Procházet</a><a>Oblíbené</a><button className="login">Přihlásit se</button><button className="sell">+ Prodat</button></div></header>
  <section className="hero"><div><p className="eyebrow">NOVÁ GENERACE BAZARU</p><h1>Najdi. Kup. <span>Prodej.</span></h1><p className="lead">Marketplace pro věci, které chceš mít. Jednoduše, rychle a bez zbytečností.</p><div className="search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Co hledáš? třeba iPhone, Nike, PS5..." /><button>Hledat</button></div></div><div className="heroCard"><div className="orb">S</div><b>SHOT MARKET</b><small>by SHOTER</small></div></section>
  <section className="content"><div className="sectionHead"><div><h2>Prozkoumat nabídky</h2><p>{filtered.length} položek právě teď</p></div><div className="cats">{["Vše","Móda","Elektronika","Gaming"].map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
  <div className="grid">{filtered.map(x=><article className="item" key={x.id}><div className="photo"><span>{x.emoji}</span><button className="heart" onClick={()=>toggle(x.id)}>{liked.includes(x.id)?"♥":"♡"}</button></div><div className="info"><div className="tag">{x.category}</div><h3>{x.title}</h3><p className="place">⌖ {x.location}</p><div className="bottom"><strong>{x.price}</strong><button className="detail">Zobrazit</button></div></div></article>)}</div></section>
  <footer><b>SHOT<span>MARKET</span></b><span>© 2026 SHOTER · Marketplace</span></footer>
 </main>;
}
