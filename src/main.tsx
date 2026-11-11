import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type PageKey = "home" | "purpose" | "labs" | "projects" | "challenges" | "ideas" | "insights" | "collaborate";
const navigation: { key: PageKey; label: string }[] = [
  { key: "purpose", label: "Our Purpose" },
  { key: "labs", label: "Innovation Labs" },
  { key: "projects", label: "Projects" },
  { key: "challenges", label: "Innovation Challenges" },
  { key: "ideas", label: "MAGIC Ideas" },
  { key: "insights", label: "Insights & Events" },
  { key: "collaborate", label: "Collaborate" },
];
const valid = new Set<PageKey>(["home", ...navigation.map(item => item.key)]);
function route(): PageKey {
  const value = window.location.hash.replace(/^#\/?/, "") as PageKey;
  return valid.has(value) ? value : "home";
}
const wordmark = <span className="justice-mark">JusTICe</span>;
const panels: { key: PageKey; label: string; text: string }[] = [
  { key: "purpose", label: "Our Purpose", text: "Human-centred experimentation, responsible innovation and learning within JusTICe." },
  { key: "labs", label: "Innovation Labs", text: "Explore governance, legal technology and artificial intelligence through carefully scoped experiments." },
  { key: "projects", label: "Projects", text: "A home for institutionally approved demonstrations and work in progress." },
  { key: "challenges", label: "Innovation Challenges", text: "Explore real-world questions that deserve thoughtful, collaborative investigation." },
  { key: "ideas", label: "MAGIC Ideas", text: "A future pathway for sharing ideas with appropriate privacy and review safeguards." },
  { key: "insights", label: "Insights & Events", text: "Institutionally reviewed updates, workshops and publications." },
  { key: "collaborate", label: "Collaborate", text: "Learn how partners and participants can help build better justice." },
];
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="content-card"><h2>{title}</h2>{children}</article>;
}
function Home() {
  return <><section className="hero"><div className="orb" aria-hidden="true"/><p className="eyebrow">{wordmark} · Jigme Singye Wangchuck School of Law · Bhutan</p><h1>Imagine Better Justice.<br/><em>Build It Together.</em></h1><p className="intro">MAGIC JusTICe Lab is the innovation and experimentation arm of {wordmark}, bringing law, artificial intelligence, governance, technology and human values together.</p><a className="cta" href="#/purpose">Explore the Lab →</a></section><section className="sections" aria-label="Explore MAGIC JusTICe Lab">{panels.map((item, i) => <a className="panel panel-link" href={"#/" + item.key} key={item.key}><span className="index">{String(i + 1).padStart(2, "0")}</span><h2>{item.label}</h2><p>{item.text}</p>{item.key === "ideas" && <p className="notice">Idea submission is not yet enabled. No personal information is being collected.</p>}</a>)}</section></>;
}
function Page({ page }: { page: PageKey }) {
  if (page === "home") return <Home/>;
  const titles: Record<Exclude<PageKey, "home">, string> = {
    purpose: "Our Purpose", labs: "Innovation Labs", projects: "Projects", challenges: "Innovation Challenges",
    ideas: "MAGIC Ideas", insights: "Insights & Events", collaborate: "Collaborate"
  };
  const title = titles[page];
  return <div className="page"><a href="#/home" className="back-link">← Back to home</a><p className="eyebrow">MAGIC {wordmark} Lab</p><h1>{title}</h1>
    {page === "purpose" && <><p className="page-lead">Imagine Better Justice. Build It Together.</p><p>MAGIC {wordmark} Lab is an innovation and experimentation initiative within {wordmark} at Jigme Singye Wangchuck School of Law, Bhutan. It creates space to examine ideas at the intersection of law, governance, technology and human values.</p><div className="content-grid"><Card title="Human values first"><p>Innovation begins with the people it affects. Research and experimentation should be accessible, accountable and sensitive to context.</p></Card><Card title="Learn by experimenting"><p>Explore questions, test assumptions and share lessons through appropriately reviewed prototypes and collaborative inquiry.</p></Card><Card title="Responsible technology"><p>AI and digital tools should support sound governance and human judgement, not replace accountability or legal authority.</p></Card></div><p className="notice">MAGIC is an innovation laboratory, not a court, regulator or provider of legal advice.</p></>}
    {page === "labs" && <><p className="page-lead">Where research, governance and practical experimentation meet.</p><div className="content-grid"><Card title="AI & responsible innovation"><p>Investigate AI capabilities, limitations, evaluation and human oversight in justice-related settings.</p></Card><Card title="Legal technology"><p>Explore accessible information, document workflows and prototype tools with appropriate institutional supervision.</p></Card><Card title="Governance & ethics"><p>Study the rules, values, accountability structures and safeguards needed for trustworthy innovation.</p></Card><Card title="Learning & participation"><p>Create opportunities for students, researchers and collaborators to learn through demonstrations and discussion.</p></Card></div><p className="notice">Lab themes describe areas for exploration; they are not claims that operational legal services are available.</p></>}
    {page === "projects" && <><p className="page-lead">A transparent view of approved work and experiments.</p><Card title="Project catalogue in preparation"><p>Project entries will be published only after institutional review. Each entry will distinguish a concept, prototype, pilot or deployed service and identify the relevant safeguards.</p></Card></>}
    {page === "challenges" && <><p className="page-lead">Meaningful problems can become collaborative research opportunities.</p><Card title="Challenge programme in preparation"><p>Potential themes include accessible legal information, multilingual communication and accountable AI governance. No challenge is currently open for public submissions.</p></Card></>}
    {page === "ideas" && <><p className="page-lead">A future space to contribute ideas for better justice.</p><Card title="Submissions not yet open"><p>MAGIC Ideas will launch only after consent, privacy, moderation, review and publication controls have been tested and approved. Do not send confidential or personal case information through this website.</p></Card></>}
    {page === "insights" && <><p className="page-lead">Research, learning and exchange.</p><Card title="Editorial content in preparation"><p>Approved events, workshop summaries, announcements and publications will appear here following institutional review.</p></Card></>}
    {page === "collaborate" && <><p className="page-lead">Innovation works best when expertise and perspectives meet.</p><Card title="Collaboration pathways"><p>Future opportunities may include student participation, academic research, technical prototyping and institutional partnerships. A verified contact channel will be published after approval.</p></Card></>}
  </div>;
}
function App() {
  const [page, setPage] = useState<PageKey>(route);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const update = () => { setPage(route()); setMenuOpen(false); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => { document.title = (page === "home" ? "MAGIC JusTICe Lab" : navigation.find(n => n.key === page)?.label + " | MAGIC JusTICe Lab") + " — Imagine Better Justice"; }, [page]);
  return <><a className="skip-link" href="#main">Skip to content</a><header><a className="brand" href="#/home" aria-label="MAGIC JusTICe Lab">MAGIC <span className="justice-mark">JusTICe</span> Lab<small className="brand-parent">an innovation lab within {wordmark}</small></a><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? "Close menu" : "Menu"}</button><nav id="site-nav" className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">{navigation.map(item => <a aria-current={page === item.key ? "page" : undefined} key={item.key} href={"#/" + item.key}>{item.label}</a>)}</nav></header><main id="main"><Page page={page}/></main><footer><div>MAGIC <span className="justice-mark">JusTICe</span> Lab · Part of {wordmark} at Jigme Singye Wangchuck School of Law, Bhutan.</div><span className="footer-secondary">Imagine Better Justice. Build It Together. · Content subject to institutional approval.</span></footer></>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
