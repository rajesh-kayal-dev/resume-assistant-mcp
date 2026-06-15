import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  NAV, TYPE_PHRASES, MARQUEE, STATS, MODULES, WHY,
  NODES, PIPELINE_DEFAULT, PLATFORM, TIMELINE,
} from "./data";

/* ---------------- hooks ---------------- */

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useTypewriter(phrases, speed = 55, pause = 1800) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = phrases[idx % phrases.length];
    let t;
    if (!deleting && text === current) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIdx((i) => (i + 1) % phrases.length);
    } else {
      t = setTimeout(
        () => setText(current.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? 20 : speed
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, idx, phrases, speed, pause]);
  return text;
}

function useCountdown(target) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      min: Math.floor((diff / 60000) % 60),
      sec: Math.floor((diff / 1000) % 60),
    };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

function useCountUp(end, start, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, start, duration]);
  return val;
}

/* ---------------- shared ---------------- */

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHead({ tag, en, zh, intro }) {
  return (
    <Reveal className="mb-14">
      <div className="font-mono text-xs text-cyan-400 tracking-widest mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-cyan-400/60" />
        {tag}
      </div>
      <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">{en}</h2>
      <p className="mt-2 text-base text-cyan-200/70">{zh}</p>
      {intro && <p className="mt-5 max-w-2xl text-sm md:text-base text-slate-400 leading-relaxed">{intro}</p>}
    </Reveal>
  );
}

/* ---------------- sections ---------------- */

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setP(h.scrollTop / (h.scrollHeight - h.clientHeight || 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-cyan-950/40">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 to-teal-300 transition-[width] duration-100"
        style={{ width: `${p * 100}%` }}
      />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#04060a]/85 backdrop-blur-md border-b border-cyan-900/40" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <iconify-icon icon="solar:waterdrops-linear" class="text-cyan-400 text-xl" />
          <span className="font-mono font-semibold tracking-widest text-white">TIDE</span>
          <span className="hidden sm:inline font-mono text-xs text-slate-500">retail commerce system</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <a key={n.label} href={n.href}
              className="font-mono text-xs tracking-widest text-slate-400 hover:text-cyan-300 transition-colors">
              {n.label}
            </a>
          ))}
          <a href="#contact"
            className="font-mono text-xs tracking-widest px-4 py-2 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all">
            GET IN TOUCH
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const typed = useTypewriter(TYPE_PHRASES);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section id="top" className="relative min-h-screen flex items-center grid-bg overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(34,211,238,0.10), transparent 70%)",
          transform: `translateY(${offset * 0.4}px)`,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <Reveal>
          <div className="inline-flex items-center gap-3 font-mono text-xs tracking-widest text-cyan-300 border border-cyan-800/60 bg-cyan-950/30 px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            CASHLESS-FIRST · LIVE Q4 2026 · XIMENDING, TAIPEI
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white leading-[1.05]">
            Everything<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400">
              connected.
            </span><br />
            By design.
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-8 max-w-xl text-sm md:text-base text-slate-400 leading-relaxed">
            A cashless-first retail commerce system — ordering, service, payment, invoicing, kitchen.
            Engineered as one, not assembled from parts.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-6 font-mono text-xs md:text-sm text-cyan-300 h-6 tracking-wider">
            <span className="text-slate-600 mr-2">&gt;</span>
            {typed}
            <span className="caret bg-cyan-400 h-4 ml-0.5 align-middle" />
          </div>
        </Reveal>
        <Reveal delay={420}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact"
              className="font-mono text-xs tracking-widest px-7 py-3.5 bg-cyan-400 text-[#04060a] font-medium hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              GET IN TOUCH
            </a>
            <a href="#system"
              className="font-mono text-xs tracking-widest px-7 py-3.5 border border-slate-700 text-slate-300 hover:border-cyan-500/60 hover:text-cyan-300 transition-all flex items-center gap-2">
              EXPLORE SYSTEM
              <iconify-icon icon="solar:arrow-down-linear" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="border-y border-cyan-900/40 bg-[#060a12] py-4 overflow-hidden" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => (
          <span key={i} className="font-mono text-xs tracking-[0.3em] text-cyan-600 mx-8 flex items-center gap-8 whitespace-nowrap">
            {m}
            <iconify-icon icon="solar:bolt-linear" class="text-cyan-800" />
          </span>
        ))}
      </div>
    </div>
  );
}

function StatItem({ stat, start, delay }) {
  const v = useCountUp(stat.value, start);
  return (
    <Reveal delay={delay} className="text-center">
      <div className="font-mono text-6xl md:text-7xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 to-cyan-500">
        {v}{stat.suffix}
      </div>
      <div className="mt-3 font-mono text-xs tracking-widest text-slate-400">{stat.label}</div>
      <div className="mt-1 text-xs text-slate-600">{stat.zh}</div>
    </Reveal>
  );
}

function Stats() {
  const [ref, visible] = useInView(0.3);
  return (
    <section ref={ref} className="py-24 border-b border-slate-900">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12">
        {STATS.map((s, i) => (
          <StatItem key={s.label} stat={s} start={visible} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section id="modules" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          tag="01 / MODULES"
          en="Everything inside"
          zh="同一套系統,涵蓋每一個營運環節"
          intro="Eight operational modules, one core, one dataset. No middleware between any of them."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-900 border border-slate-900">
          {MODULES.map((m, i) => (
            <Reveal key={m.en} delay={i * 60}>
              <div className="group bg-[#04060a] p-7 h-full hover:bg-cyan-950/20 transition-colors cursor-default relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                <iconify-icon icon={m.icon} class="text-3xl text-slate-500 group-hover:text-cyan-300 transition-colors" />
                <div className="mt-5 font-mono text-sm tracking-widest text-white">{m.en}</div>
                <div className="mt-1 text-xs text-slate-500">{m.zh}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section id="why" className="py-28 bg-[#060a12] border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          tag="02 / WHY"
          en="Built as one. Not assembled."
          zh="一體成形,而非拼裝整合"
          intro="A typical deployment stitches together a POS vendor, a payment terminal, an invoicing service and a kitchen display — four contracts, four points of failure. TIDE is engineered as a single system."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {WHY.map((w, i) => (
            <Reveal key={w.en} delay={i * 130}>
              <div className="group border border-slate-800 bg-[#04060a] p-8 h-full hover:border-cyan-700/60 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(34,211,238,0.08)] transition-all duration-300">
                <div className="w-12 h-12 border border-cyan-900/60 flex items-center justify-center group-hover:border-cyan-500/60 transition-colors">
                  <iconify-icon icon={w.icon} class="text-2xl text-cyan-400" />
                </div>
                <h3 className="mt-6 text-xl font-medium tracking-tight text-white">{w.en}</h3>
                <p className="mt-1 text-xs text-cyan-200/60">{w.zh}</p>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function System() {
  const [active, setActive] = useState(null);
  const node = active !== null ? NODES[active] : null;
  return (
    <section id="system" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          tag="03 / SYSTEM"
          en="One order. End to end."
          zh="一筆訂單的完整路徑"
          intro="Five stages, one system. Hover over each node to see its scope of operation."
        />
        <Reveal>
          <div className="border border-slate-800 bg-[#060a12] p-8 md:p-12">
            {/* pipeline */}
            <div className="relative">
              <div className="absolute top-8 left-0 right-0 h-px bg-slate-800 hidden md:block">
                <span className="signal-dot" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-3 relative">
                {NODES.map((n, i) => (
                  <button
                    key={n.id}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    aria-label={`${n.en} ${n.zh}`}
                    className="group flex md:flex-col items-center md:items-center gap-4 md:gap-0 text-left md:text-center outline-none"
                  >
                    <div
                      className={`w-16 h-16 shrink-0 border flex items-center justify-center bg-[#04060a] transition-all duration-300 ${
                        active === i
                          ? "border-cyan-400 text-cyan-300 node-active"
                          : "border-slate-700 text-slate-500 group-hover:border-cyan-600"
                      }`}
                    >
                      <iconify-icon icon={n.icon} class="text-2xl" />
                    </div>
                    <div className="md:mt-4">
                      <div className="font-mono text-xs text-cyan-600">{n.id}</div>
                      <div className={`font-mono text-sm tracking-widest transition-colors ${active === i ? "text-cyan-300" : "text-white"}`}>
                        {n.en}
                      </div>
                      <div className="text-xs text-slate-500">{n.zh}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* detail panel */}
            <div className="mt-10 border-t border-slate-800 pt-8 min-h-[110px]">
              <div className="font-mono text-xs tracking-widest text-cyan-500 mb-3 flex items-center gap-2">
                <iconify-icon icon="solar:routing-2-linear" />
                {node ? `${node.id} — ${node.en} / ${node.zh}` : "PIPELINE — 預設說明"}
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl transition-opacity duration-300">
                {node ? node.body : PIPELINE_DEFAULT}
              </p>
            </div>
          </div>
          <p className="mt-4 font-mono text-xs text-slate-600 tracking-wider">
            THE MOVING SIGNAL TRACES ONE ORDER THROUGH THE SYSTEM — 光點即一筆訂單的系統路徑
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section id="platform" className="py-28 bg-[#060a12] border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          tag="04 / PLATFORM"
          en="Deployment specification."
          zh="部署規格"
          intro="TIDE ships as software on payment-certified commercial hardware. Reference specification for the showroom deployment:"
        />
        <Reveal>
          <div className="border border-slate-800 bg-[#03050a] font-mono text-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-[#070c14]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-slate-500">tide-core — deployment.spec</span>
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM NOMINAL
              </span>
            </div>
            <div className="divide-y divide-slate-900">
              {PLATFORM.map((p, i) => (
                <Reveal key={p.key} delay={i * 70}>
                  <div className="grid md:grid-cols-[160px_1fr] gap-2 md:gap-6 px-5 py-5 hover:bg-cyan-950/15 transition-colors">
                    <div className="text-cyan-400 text-xs tracking-widest pt-0.5">{p.key}</div>
                    <div>
                      <div className="text-slate-200 text-xs md:text-sm">{p.spec}</div>
                      <div className="mt-1.5 text-xs text-slate-500 font-sans">{p.zh}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <p className="mt-4 font-mono text-xs text-slate-600 tracking-wider">
            HARDWARE PARTNER SELECTION IN FINAL VALIDATION — 硬體合作夥伴選型進入最終實機驗證階段
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const STATUS_STYLE = {
  COMPLETE: "text-emerald-400 border-emerald-700/50",
  "IN PROGRESS": "text-cyan-300 border-cyan-600/50",
  SCHEDULED: "text-amber-300 border-amber-700/50",
  PLANNED: "text-slate-400 border-slate-700",
};

function Program() {
  const t = useCountdown(new Date("2026-12-07T00:00:00+08:00").getTime());
  const cells = [
    { v: t.days, l: "DAYS" }, { v: t.hours, l: "HOURS" },
    { v: t.min, l: "MIN" }, { v: t.sec, l: "SEC" },
  ];
  return (
    <section id="program" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          tag="05 / PROGRAM"
          en="Operating proof. Not a demo."
          zh="營運實證,而非展示樣品"
          intro="Q4 2026, Ximending, Taipei — a fully operational retail store running every transaction on TIDE, in a company-owned property. The resident brand will be announced at opening."
        />
        <div className="grid lg:grid-cols-2 gap-12">
          {/* timeline */}
          <div className="relative pl-8">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/60 via-slate-800 to-slate-900" />
            {TIMELINE.map((item, i) => (
              <Reveal key={item.period} delay={i * 110} className="relative pb-10 last:pb-0">
                <span className={`absolute -left-8 top-1 w-4 h-4 border-2 bg-[#04060a] ${
                  item.status === "COMPLETE" ? "border-emerald-400" :
                  item.status === "IN PROGRESS" ? "border-cyan-400 node-active" : "border-slate-600"
                }`} style={{ marginLeft: "1px" }} />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-cyan-300 tracking-wider">{item.period}</span>
                  <span className={`font-mono text-xs px-2 py-0.5 border tracking-widest ${STATUS_STYLE[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-medium tracking-tight text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.zh}</p>
              </Reveal>
            ))}
          </div>
          {/* countdown */}
          <Reveal delay={200}>
            <div className="border border-slate-800 bg-[#060a12] p-8 md:p-10 h-full flex flex-col justify-center">
              <div className="font-mono text-xs tracking-widest text-slate-500 flex items-center gap-2">
                <iconify-icon icon="solar:alarm-linear" class="text-cyan-400" />
                COUNTDOWN — TO OPENING
              </div>
              <div className="mt-8 grid grid-cols-4 gap-3">
                {cells.map((c) => (
                  <div key={c.l} className="border border-slate-800 bg-[#04060a] py-5 text-center hover:border-cyan-800 transition-colors">
                    <div className="font-mono text-3xl md:text-4xl font-semibold tracking-tight text-cyan-300 tabular-nums">
                      {String(c.v).padStart(2, "0")}
                    </div>
                    <div className="mt-2 font-mono text-xs tracking-widest text-slate-600">{c.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-2 font-mono text-xs tracking-widest text-slate-500">
                <iconify-icon icon="solar:map-point-linear" class="text-cyan-400" />
                XIMENDING, TAIPEI — Q4 2026
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "error" | "sent"
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setEmail("");
  };
  return (
    <section id="contact" className="py-28 bg-[#060a12] border-t border-slate-900 grid-bg">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <div className="font-mono text-xs text-cyan-400 tracking-widest mb-5">CONTACT</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
            Ride the next wave with us.
          </h2>
          <p className="mt-4 text-sm text-slate-400">留下信箱,系統上線時第一時間通知您。</p>
          <form onSubmit={submit} noValidate className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
              placeholder="you@company.com"
              aria-label="Email address"
              className={`flex-1 bg-[#04060a] border px-4 py-3.5 font-mono text-sm text-white placeholder:text-slate-600 outline-none transition-colors ${
                status === "error" ? "border-red-500/70" : "border-slate-700 focus:border-cyan-500"
              }`}
            />
            <button type="submit"
              className="font-mono text-xs tracking-widest px-6 py-3.5 bg-cyan-400 text-[#04060a] font-medium hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
              NOTIFY ME
            </button>
          </form>
          <div className="mt-4 h-5 font-mono text-xs" role="status">
            {status === "error" && <span className="text-red-400">PLEASE ENTER A VALID EMAIL — 請輸入有效信箱</span>}
            {status === "sent" && <span className="text-emerald-400">SIGNAL RECEIVED — 已收到,感謝您的關注</span>}
          </div>
          <a href="mailto:info@72-studio.com"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-slate-400 hover:text-cyan-300 transition-colors">
            <iconify-icon icon="solar:letter-linear" />
            info@72-studio.com
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-xs tracking-[0.25em] text-cyan-500">
          YOU RIDE THE WAVES; WE BUILD THE TIDE.
        </div>
        <div className="font-mono text-xs text-slate-600 tracking-wider flex items-center gap-2">
          <iconify-icon icon="solar:waterdrops-linear" class="text-cyan-700" />
          TIDE CORE v0.9 · INTEGRATION BUILD · © 2026 TIDE
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="scanlines">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Modules />
        <Why />
        <System />
        <Platform />
        <Program />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}