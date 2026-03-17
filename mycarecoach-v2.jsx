import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   MyCareCoach — Énergique & Sport Edition
   Palette: Noir profond, orange électrique, cyan vif, blanc pur
   Typo: Sora (display) + Outfit (body)
   ═══════════════════════════════════════════════════════════════ */

const C = {
  bg: "#0A0A0F",
  bgCard: "#14141F",
  bgCard2: "#1A1A28",
  bgHover: "#1E1E30",
  orange: "#FF6B2C",
  orangeGlow: "rgba(255,107,44,0.25)",
  cyan: "#00D4FF",
  cyanGlow: "rgba(0,212,255,0.2)",
  lime: "#A8FF44",
  limeGlow: "rgba(168,255,68,0.2)",
  red: "#FF4757",
  redGlow: "rgba(255,71,87,0.15)",
  white: "#FFFFFF",
  text: "#E8E8F0",
  muted: "#6B6B80",
  border: "#2A2A3D",
  gradient1: "linear-gradient(135deg, #FF6B2C 0%, #FF9F43 100%)",
  gradient2: "linear-gradient(135deg, #00D4FF 0%, #0097E6 100%)",
  gradient3: "linear-gradient(135deg, #A8FF44 0%, #4ECDC4 100%)",
};

// ─── SVG Icons ──────────────────────────────────────────────
const I = {
  dashboard: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  clients: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85"/></svg>,
  calendar: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chat: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  nutrition: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  payment: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  stats: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  fire: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 2c.5 3.5 3 6 3 9a6 6 0 11-12 0c0-3 2.5-5.5 3-9 1 2.5 3 3.5 3 3.5S11.5 4 12 2z"/></svg>,
  trophy: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>,
  heart: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  plus: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  arrow: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  back: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  send: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  phone: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  check: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  weight: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="3"/><path d="M6.5 8a7 7 0 0011 0"/><path d="M3 21h18l-2-13H5L3 21z"/></svg>,
  target: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  settings: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

// ─── Data ───────────────────────────────────────────────────
const clientsData = [
  { id: 1, name: "Sophie Martin", age: 34, goal: "Perte de poids", progress: 72, nextSession: "Auj. 14h", avatar: "SM", status: "active", tag: "HIIT", weight: "68kg", bodyFat: "24%", calories: 1850, protein: 120, carbs: 180, fat: 65, paid: true, streak: 12, sessions: 24, lastMsg: "À toute à l'heure !", msgTime: "12:30" },
  { id: 2, name: "Lucas Dupont", age: 28, goal: "Prise de masse", progress: 45, nextSession: "Dem. 10h", avatar: "LD", status: "active", tag: "FORCE", weight: "82kg", bodyFat: "16%", calories: 2800, protein: 180, carbs: 320, fat: 85, paid: true, streak: 8, sessions: 16, lastMsg: "Je peux décaler jeudi ?", msgTime: "11:15" },
  { id: 3, name: "Émilie Bernard", age: 52, goal: "Rééducation dos", progress: 88, nextSession: "Mer. 16h", avatar: "EB", status: "warning", tag: "SANTÉ", weight: "71kg", bodyFat: "28%", calories: 1650, protein: 90, carbs: 200, fat: 55, paid: false, streak: 20, sessions: 38, lastMsg: "Merci pour le programme !", msgTime: "Hier" },
  { id: 4, name: "Marc Leroy", age: 41, goal: "Marathon", progress: 60, nextSession: "Jeu. 8h", avatar: "ML", status: "active", tag: "CARDIO", weight: "76kg", bodyFat: "18%", calories: 2400, protein: 140, carbs: 280, fat: 75, paid: true, streak: 15, sessions: 30, lastMsg: "10km ce matin, 48min !", msgTime: "08:42" },
  { id: 5, name: "Camille Roux", age: 30, goal: "Souplesse", progress: 35, nextSession: "Ven. 17h", avatar: "CR", status: "new", tag: "YOGA", weight: "58kg", bodyFat: "22%", calories: 1700, protein: 85, carbs: 210, fat: 60, paid: true, streak: 3, sessions: 5, lastMsg: "Bonjour ! J'ai une question", msgTime: "10:00" },
  { id: 6, name: "Jean Moreau", age: 63, goal: "Activité adaptée", progress: 55, nextSession: "Sam. 9h", avatar: "JM", status: "warning", tag: "SENIOR", weight: "85kg", bodyFat: "30%", calories: 1800, protein: 95, carbs: 220, fat: 70, paid: false, streak: 6, sessions: 14, lastMsg: "Rdv samedi confirmé", msgTime: "Hier" },
];

const todaySessions = [
  { time: "08:00", client: "Marc Leroy", type: "Course tempo", duration: "45'", done: true },
  { time: "10:30", client: "Lucas Dupont", type: "Push / Pull", duration: "60'", done: true },
  { time: "14:00", client: "Sophie Martin", type: "HIIT Circuit", duration: "50'", done: false, current: true },
  { time: "16:00", client: "Émilie Bernard", type: "Rééducation", duration: "40'", done: false },
  { time: "17:30", client: "Camille Roux", type: "Yoga Flow", duration: "55'", done: false },
];

const weekData = [
  { d: "L", v: 5 }, { d: "M", v: 4 }, { d: "Me", v: 6 }, { d: "J", v: 3 }, { d: "V", v: 7 }, { d: "S", v: 4 }, { d: "D", v: 1 },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  sessions: i === 3 ? 3 : i === 6 ? 2 : i === 10 ? 4 : i === 13 ? 1 : i === 17 ? 3 : i === 20 ? 2 : i === 24 ? 5 : i === 27 ? 3 : [0,1,0,2,0,1,0,0,1,2,0,0,1,0,2,0,1,0,0,1,0,2,0,0,1,0,1,0,2,0,1][i] || 0,
}));

const invoices = [
  { id: "INV-042", client: "Sophie Martin", amount: 450, status: "paid", date: "01/03" },
  { id: "INV-041", client: "Lucas Dupont", amount: 380, status: "paid", date: "01/03" },
  { id: "INV-040", client: "Émilie Bernard", amount: 320, status: "overdue", date: "15/02" },
  { id: "INV-039", client: "Marc Leroy", amount: 500, status: "paid", date: "01/03" },
  { id: "INV-038", client: "Jean Moreau", amount: 280, status: "overdue", date: "15/02" },
  { id: "INV-037", client: "Camille Roux", amount: 200, status: "paid", date: "25/02" },
];

// ─── Reusable Components ────────────────────────────────────

const GlowDot = ({ color, size = 8 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
);

const Badge = ({ text, color = C.orange, bg }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase",
    color: color, background: bg || `${color}18`, padding: "3px 10px", borderRadius: 6,
    border: `1px solid ${color}30`,
  }}>{text}</span>
);

const ProgressBar = ({ value, color = C.orange, height = 6 }) => (
  <div style={{ height, borderRadius: height, background: `${C.muted}30`, overflow: "hidden", width: "100%" }}>
    <div style={{
      height: "100%", borderRadius: height, width: `${value}%`,
      background: `linear-gradient(90deg, ${color}, ${color}CC)`,
      boxShadow: `0 0 12px ${color}40`,
      transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
    }} />
  </div>
);

const Ring = ({ value, size = 52, stroke = 5, color = C.orange }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${C.muted}25`} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - (value/100)*circ} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: size > 60 ? 16 : 12, fontWeight: 700, fill: C.white, fontFamily: "'Sora', sans-serif" }}>
        {value}%
      </text>
    </svg>
  );
};

const Card = ({ children, style = {}, glow, onClick }) => (
  <div onClick={onClick} style={{
    background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}`,
    boxShadow: glow ? `0 0 30px ${glow}` : "none",
    transition: "all 0.3s", cursor: onClick ? "pointer" : "default", ...style,
  }}>
    {children}
  </div>
);

// ─── SIDEBAR ────────────────────────────────────────────────
const Sidebar = ({ active, setActive, setView }) => {
  const nav = [
    { id: "dashboard", icon: I.dashboard, label: "Dashboard" },
    { id: "clients", icon: I.clients, label: "Clients" },
    { id: "calendar", icon: I.calendar, label: "Planning" },
    { id: "nutrition", icon: I.nutrition, label: "Nutrition" },
    { id: "chat", icon: I.chat, label: "Messages", badge: 3 },
    { id: "payments", icon: I.payment, label: "Paiements" },
    { id: "stats", icon: I.stats, label: "Stats" },
  ];
  return (
    <div style={{
      width: 72, minHeight: "100vh", background: C.bgCard,
      borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
      alignItems: "center", padding: "20px 0", position: "fixed", left: 0, top: 0, zIndex: 100,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, background: C.gradient1,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32,
        boxShadow: `0 4px 20px ${C.orangeGlow}`,
      }}>
        {I.fire("#fff")}
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {nav.map((n) => {
          const isA = active === n.id;
          return (
            <div key={n.id} onClick={() => { setActive(n.id); setView(n.id); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "12px 0", cursor: "pointer", position: "relative",
              }}
              title={n.label}
            >
              {isA && <div style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 3, height: 24, borderRadius: "0 4px 4px 0", background: C.orange,
                boxShadow: `0 0 12px ${C.orange}`,
              }} />}
              {n.icon(isA ? C.orange : C.muted)}
              {n.badge && (
                <div style={{
                  position: "absolute", top: 8, right: 14, width: 16, height: 16, borderRadius: 8,
                  background: C.red, color: "#fff", fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{n.badge}</div>
              )}
            </div>
          );
        })}
      </nav>

      <div onClick={() => { setActive("mobile"); setView("mobile"); }}
        style={{ cursor: "pointer", padding: 12, borderRadius: 12, background: active === "mobile" ? `${C.cyan}15` : "transparent", marginBottom: 8 }}
        title="Vue Client Mobile"
      >
        {I.phone(active === "mobile" ? C.cyan : C.muted)}
      </div>

      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${C.orange}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.orange, fontSize: 13, fontWeight: 700, fontFamily: "'Sora', sans-serif",
      }}>AC</div>
    </div>
  );
};

// ─── DASHBOARD VIEW ─────────────────────────────────────────
const DashboardView = ({ setView, setSelectedClient }) => {
  const max = Math.max(...weekData.map(d => d.v));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { icon: I.clients, label: "Clients actifs", val: "24", sub: "+3 ce mois", color: C.orange, glow: C.orangeGlow },
          { icon: I.fire, label: "Séances aujourd'hui", val: "5", sub: "2 restantes", color: C.cyan, glow: C.cyanGlow },
          { icon: I.trophy, label: "Ce mois", val: "87", sub: "+12% vs fév.", color: C.lime, glow: C.limeGlow },
          { icon: I.payment, label: "Revenus mars", val: "4 280€", sub: "6 impayés", color: C.orange, glow: C.orangeGlow },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "20px 22px", animation: `fadeUp 0.5s ${i * 80}ms both` }} glow={s.glow}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon(s.color)}</div>
              <Badge text={s.sub} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ padding: "22px", animation: "fadeUp 0.5s 200ms both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif" }}>Mes clients</h2>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>6 profils actifs</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.gradient1, padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", boxShadow: `0 4px 16px ${C.orangeGlow}` }}>
                {I.plus("#fff")} Ajouter
              </div>
            </div>
            {clientsData.map((c, i) => {
              const tagColors = { HIIT: C.orange, FORCE: C.cyan, "SANTÉ": C.lime, CARDIO: C.red, YOGA: "#C471ED", SENIOR: C.orange };
              const tc = tagColors[c.tag] || C.orange;
              return (
                <div key={c.id} onClick={() => { setSelectedClient(c); setView("clientDetail"); }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", animation: `fadeUp 0.4s ${200 + i * 50}ms both` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${tc}20`, border: `2px solid ${tc}40`, display: "flex", alignItems: "center", justifyContent: "center", color: tc, fontSize: 13, fontWeight: 700, fontFamily: "'Sora', sans-serif", flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{c.name}</span>
                      <Badge text={c.tag} color={tc} />
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{c.goal} · {c.nextSession}</div>
                  </div>
                  <Ring value={c.progress} color={tc} size={44} stroke={4} />
                  {I.arrow(C.muted)}
                </div>
              );
            })}
          </Card>

          <Card style={{ padding: "22px", animation: "fadeUp 0.5s 400ms both" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>Activité semaine</h2>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>30 séances · 1 500€</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
              {weekData.map((d, i) => {
                const h = (d.v / max) * 80;
                const isToday = i === 2;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{d.v}</span>
                    <div style={{ width: "100%", height: h, borderRadius: 8, background: isToday ? C.gradient1 : `${C.muted}25`, boxShadow: isToday ? `0 0 16px ${C.orangeGlow}` : "none", animation: `growUp 0.8s ${i * 80}ms both` }} />
                    <span style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? C.orange : C.muted }}>{d.d}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ padding: "22px", animation: "fadeUp 0.5s 300ms both" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Aujourd'hui</h2>
            {todaySessions.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 10, opacity: s.done ? 0.45 : 1,
                background: s.current ? `${C.orange}10` : "transparent", border: s.current ? `1px solid ${C.orange}30` : "1px solid transparent",
                marginBottom: 4, animation: `fadeUp 0.4s ${300 + i * 60}ms both`,
              }}>
                <span style={{ width: 44, fontSize: 12, fontWeight: 700, color: s.current ? C.orange : C.muted, fontFamily: "'Sora', sans-serif", flexShrink: 0 }}>{s.time}</span>
                <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: s.done ? C.lime : s.current ? C.orange : C.border, boxShadow: s.current ? `0 0 10px ${C.orange}` : "none" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{s.client}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{s.type} · {s.duration}</div>
                </div>
                {s.done && I.check(C.lime)}
                {s.current && <Badge text="NOW" color={C.orange} />}
              </div>
            ))}
          </Card>

          <Card style={{ padding: "24px", animation: "fadeUp 0.5s 500ms both", background: `linear-gradient(135deg, ${C.bgCard} 0%, #1a1020 100%)`, border: `1px solid ${C.orange}25` }} glow={C.orangeGlow}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.orange, fontWeight: 700, marginBottom: 8 }}>🔥 Objectif mars</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif" }}>100 séances</div>
            <div style={{ fontSize: 13, color: C.muted, margin: "6px 0 16px" }}>87 réalisées — plus que 13 !</div>
            <ProgressBar value={87} color={C.orange} height={10} />
          </Card>

          <Card style={{ padding: "22px", animation: "fadeUp 0.5s 600ms both" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 14 }}>Messages récents</h2>
            {clientsData.slice(0, 4).map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.cyan}15`, display: "flex", alignItems: "center", justifyContent: "center", color: C.cyan, fontSize: 11, fontWeight: 700 }}>{c.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</div>
                </div>
                <span style={{ fontSize: 10, color: C.muted }}>{c.msgTime}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── CLIENT DETAIL VIEW ─────────────────────────────────────
const ClientDetailView = ({ client, goBack }) => {
  if (!client) return null;
  const tagColors = { HIIT: C.orange, FORCE: C.cyan, "SANTÉ": C.lime, CARDIO: C.red, YOGA: "#C471ED", SENIOR: C.orange };
  const tc = tagColors[client.tag] || C.orange;
  const progressData = [65, 68, 70, 67, 72, 70, 73, 72, 75, 74, 72, client.progress];
  const maxP = Math.max(...progressData);

  return (
    <div style={{ animation: "fadeUp 0.4s both" }}>
      <div onClick={goBack} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 20, color: C.muted, fontSize: 13, padding: "6px 12px", borderRadius: 8, transition: "all 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.color = C.orange}
        onMouseLeave={e => e.currentTarget.style.color = C.muted}
      >
        {I.back(C.muted)} Retour
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: `${tc}20`, border: `3px solid ${tc}50`, display: "flex", alignItems: "center", justifyContent: "center", color: tc, fontSize: 22, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>{client.avatar}</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif" }}>{client.name}</h1>
            <Badge text={client.tag} color={tc} />
            {!client.paid && <Badge text="IMPAYÉ" color={C.red} />}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{client.age} ans · {client.goal} · {client.sessions} séances · Streak {client.streak}j 🔥</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <div style={{ padding: "10px 20px", borderRadius: 10, background: `${C.cyan}15`, border: `1px solid ${C.cyan}30`, color: C.cyan, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Message</div>
          <div style={{ padding: "10px 20px", borderRadius: 10, background: C.gradient1, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 16px ${C.orangeGlow}` }}>Nouvelle séance</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Poids", val: client.weight, icon: I.weight, color: C.orange },
          { label: "Masse grasse", val: client.bodyFat, icon: I.target, color: C.cyan },
          { label: "Streak", val: `${client.streak} jours`, icon: I.fire, color: C.lime },
        ].map((m, i) => (
          <Card key={i} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${m.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.icon(m.color)}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif" }}>{m.val}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{m.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card style={{ padding: "22px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Progression</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {progressData.map((v, i) => {
              const h = (v / maxP) * 100;
              const isLast = i === progressData.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  {isLast && <span style={{ fontSize: 10, fontWeight: 700, color: tc }}>{v}%</span>}
                  <div style={{ width: "100%", height: h, borderRadius: 6, background: isLast ? `linear-gradient(180deg, ${tc}, ${tc}80)` : `${C.muted}20`, boxShadow: isLast ? `0 0 12px ${tc}40` : "none", animation: `growUp 0.6s ${i * 50}ms both` }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 10, color: C.muted }}>12 dernières semaines</span>
            <span style={{ fontSize: 10, color: tc, fontWeight: 600 }}>Aujourd'hui</span>
          </div>
        </Card>

        <Card style={{ padding: "22px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>Nutrition du jour</h3>
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>{client.calories} kcal objectif</p>
          {[
            { label: "Protéines", val: client.protein, max: 200, unit: "g", color: C.orange },
            { label: "Glucides", val: client.carbs, max: 350, unit: "g", color: C.cyan },
            { label: "Lipides", val: client.fat, max: 100, unit: "g", color: C.lime },
          ].map((n, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.text }}>{n.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: n.color }}>{n.val}{n.unit}</span>
              </div>
              <ProgressBar value={(n.val / n.max) * 100} color={n.color} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── CALENDAR VIEW ──────────────────────────────────────────
const CalendarView = () => {
  const [selDay, setSelDay] = useState(4);
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const offset = 6;
  return (
    <div style={{ animation: "fadeUp 0.4s both" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 20 }}>Planning — Mars 2026</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <Card style={{ padding: "22px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
            {dayNames.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: C.muted, padding: 8 }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {calendarDays.map((d, i) => {
              const isSel = d.day === selDay;
              const hasS = d.sessions > 0;
              return (
                <div key={i} onClick={() => setSelDay(d.day)} style={{
                  padding: "10px 0", borderRadius: 12, textAlign: "center", cursor: "pointer",
                  background: isSel ? C.gradient1 : hasS ? `${C.orange}08` : "transparent",
                  border: isSel ? "none" : hasS ? `1px solid ${C.orange}15` : "1px solid transparent",
                  boxShadow: isSel ? `0 4px 16px ${C.orangeGlow}` : "none", transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 14, fontWeight: isSel ? 700 : 500, color: isSel ? "#fff" : hasS ? C.white : C.muted }}>{d.day}</div>
                  {hasS && !isSel && <div style={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 4 }}>{Array.from({ length: Math.min(d.sessions, 4) }).map((_, j) => <div key={j} style={{ width: 4, height: 4, borderRadius: 2, background: C.orange }} />)}</div>}
                  {isSel && <div style={{ fontSize: 10, color: "#ffffffCC", marginTop: 2 }}>{d.sessions} séance{d.sessions > 1 ? "s" : ""}</div>}
                </div>
              );
            })}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: "22px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 14 }}>{selDay} mars</h3>
            {todaySessions.slice(0, calendarDays[selDay - 1]?.sessions || 2).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: `${C.orange}08`, marginBottom: 6, border: `1px solid ${C.orange}15` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.orange, width: 40 }}>{s.time}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{s.client}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{s.type}</div>
                </div>
              </div>
            ))}
          </Card>
          <div style={{ padding: "14px 20px", borderRadius: 12, background: C.gradient1, textAlign: "center", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: `0 4px 20px ${C.orangeGlow}` }}>
            + Ajouter une séance
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CHAT VIEW ──────────────────────────────────────────────
const ChatView = () => {
  const [selChat, setSelChat] = useState(0);
  const [msg, setMsg] = useState("");
  const messages = [
    { from: "client", text: "Bonjour Coach ! J'ai fait mon cardio ce matin 💪", time: "08:42" },
    { from: "coach", text: "Super Sophie ! Combien de temps ?", time: "09:10" },
    { from: "client", text: "35 minutes de course + 10 min d'étirements", time: "09:12" },
    { from: "coach", text: "Parfait ! Pense à bien t'hydrater. On se voit cet aprèm pour le circuit training 🔥", time: "09:15" },
    { from: "client", text: "À toute à l'heure !", time: "12:30" },
  ];
  return (
    <div style={{ animation: "fadeUp 0.4s both" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 20 }}>Messagerie</h1>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, height: "calc(100vh - 180px)", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{ background: C.bgCard, borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
          {clientsData.map((c, i) => (
            <div key={i} onClick={() => setSelChat(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", background: selChat === i ? `${C.orange}10` : "transparent", borderLeft: selChat === i ? `3px solid ${C.orange}` : "3px solid transparent" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.orange}15`, display: "flex", alignItems: "center", justifyContent: "center", color: C.orange, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</div>
              </div>
              <span style={{ fontSize: 10, color: C.muted }}>{c.msgTime}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", background: C.bg }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.orange}15`, display: "flex", alignItems: "center", justifyContent: "center", color: C.orange, fontSize: 12, fontWeight: 700 }}>{clientsData[selChat].avatar}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{clientsData[selChat].name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><GlowDot color={C.lime} size={6} /><span style={{ fontSize: 11, color: C.muted }}>En ligne</span></div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === "coach" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                <div style={{ padding: "10px 16px", borderRadius: 16, borderBottomRightRadius: m.from === "coach" ? 4 : 16, borderBottomLeftRadius: m.from === "client" ? 4 : 16, background: m.from === "coach" ? C.gradient1 : C.bgCard2, color: m.from === "coach" ? "#fff" : C.text, fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textAlign: m.from === "coach" ? "right" : "left" }}>{m.time}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Écrire un message..." style={{ flex: 1, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", color: C.white, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
            <div style={{ width: 42, height: 42, borderRadius: 12, background: C.gradient1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 4px 16px ${C.orangeGlow}` }}>{I.send("#fff")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAYMENTS VIEW ──────────────────────────────────────────
const PaymentsView = () => (
  <div style={{ animation: "fadeUp 0.4s both" }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 20 }}>Paiements & Facturation</h1>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {[
        { label: "CA ce mois", val: "4 280€", color: C.orange, sub: "+18% vs fév." },
        { label: "En attente", val: "600€", color: C.red, sub: "2 factures" },
        { label: "Clients à jour", val: "83%", color: C.lime, sub: "20/24" },
      ].map((s, i) => (
        <Card key={i} style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{s.label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.val}</div>
          <Badge text={s.sub} color={s.color} />
        </Card>
      ))}
    </div>
    <Card style={{ padding: "22px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Dernières factures</h2>
      <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px 80px 80px", gap: 12, padding: "8px 12px", marginBottom: 4 }}>
        {["Facture", "Client", "Montant", "Date", "Statut"].map(h => <span key={h} style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{h}</span>)}
      </div>
      {invoices.map((inv, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px 80px 80px", gap: 12, padding: "14px 12px", borderRadius: 10, alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{inv.id}</span>
          <span style={{ fontSize: 13, color: C.text }}>{inv.client}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{inv.amount}€</span>
          <span style={{ fontSize: 12, color: C.muted }}>{inv.date}</span>
          <Badge text={inv.status === "paid" ? "Payé" : "Impayé"} color={inv.status === "paid" ? C.lime : C.red} />
        </div>
      ))}
    </Card>
  </div>
);

// ─── NUTRITION VIEW ─────────────────────────────────────────
const NutritionView = () => (
  <div style={{ animation: "fadeUp 0.4s both" }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 20 }}>Suivi Nutritionnel</h1>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {clientsData.slice(0, 4).map((c, i) => {
        const tc = [C.orange, C.cyan, C.lime, C.red][i];
        return (
          <Card key={i} style={{ padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${tc}15`, display: "flex", alignItems: "center", justifyContent: "center", color: tc, fontSize: 12, fontWeight: 700 }}>{c.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{c.calories} kcal / jour</div>
              </div>
            </div>
            {[
              { l: "Protéines", v: c.protein, m: 200, u: "g", c: C.orange },
              { l: "Glucides", v: c.carbs, m: 350, u: "g", c: C.cyan },
              { l: "Lipides", v: c.fat, m: 100, u: "g", c: C.lime },
            ].map((n, j) => (
              <div key={j} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{n.l}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: n.c }}>{n.v}{n.u}</span>
                </div>
                <ProgressBar value={(n.v / n.m) * 100} color={n.c} height={5} />
              </div>
            ))}
          </Card>
        );
      })}
    </div>
  </div>
);

// ─── STATS VIEW ─────────────────────────────────────────────
const StatsView = () => (
  <div style={{ animation: "fadeUp 0.4s both" }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 20 }}>Statistiques</h1>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
      {[
        { l: "Séances totales", v: "312", c: C.orange },
        { l: "Heures coachées", v: "248h", c: C.cyan },
        { l: "Taux rétention", v: "94%", c: C.lime },
        { l: "Note moyenne", v: "4.9★", c: C.orange },
      ].map((s, i) => (
        <Card key={i} style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: s.c, fontFamily: "'Sora', sans-serif" }}>{s.v}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.l}</div>
        </Card>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <Card style={{ padding: "22px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Séances par mois</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {[65, 72, 68, 80, 75, 87].map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: i === 5 ? C.orange : C.muted }}>{v}</span>
              <div style={{ width: "100%", height: (v / 90) * 100, borderRadius: 6, background: i === 5 ? C.gradient1 : `${C.muted}20`, animation: `growUp 0.8s ${i * 100}ms both` }} />
              <span style={{ fontSize: 10, color: C.muted }}>{["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"][i]}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ padding: "22px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Revenus mensuels</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {[3200, 3600, 3400, 3900, 3750, 4280].map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: i === 5 ? C.cyan : C.muted }}>{(v/1000).toFixed(1)}k</span>
              <div style={{ width: "100%", height: (v / 4500) * 100, borderRadius: 6, background: i === 5 ? C.gradient2 : `${C.muted}20`, animation: `growUp 0.8s ${i * 100}ms both` }} />
              <span style={{ fontSize: 10, color: C.muted }}>{["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"][i]}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// ─── MOBILE CLIENT VIEW ─────────────────────────────────────
const MobileClientView = () => {
  const [tab, setTab] = useState("home");
  const client = clientsData[0];

  const tabs = [
    { id: "home", icon: I.dashboard, label: "Accueil" },
    { id: "training", icon: I.fire, label: "Training" },
    { id: "nutrition", icon: I.nutrition, label: "Nutrition" },
    { id: "progress", icon: I.stats, label: "Progrès" },
    { id: "chat", icon: I.chat, label: "Coach" },
  ];

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: C.bg, position: "relative", overflow: "hidden", borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
      <div style={{ padding: "12px 20px 0", display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: C.muted }}>
        <span>9:41</span><span>📶 🔋</span>
      </div>

      <div style={{ padding: "16px 20px 100px", overflowY: "auto" }}>
        {tab === "home" && (
          <div style={{ animation: "fadeUp 0.3s both" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: C.muted }}>Bonjour</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif" }}>Sophie 👋</h1>
            </div>
            <div style={{ borderRadius: 20, padding: "22px", marginBottom: 16, background: "linear-gradient(135deg, #FF6B2C 0%, #FF9F43 50%, #FFD93D 100%)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.8)", fontWeight: 600, marginBottom: 6 }}>Prochaine séance</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Sora', sans-serif" }}>Circuit Training</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>Aujourd'hui à 14h · 50 min</div>
                <div style={{ display: "inline-block", marginTop: 12, padding: "10px 24px", borderRadius: 12, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Voir le détail →</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <Card style={{ padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.orange, fontFamily: "'Sora', sans-serif" }}>12</div>
                <div style={{ fontSize: 11, color: C.muted }}>🔥 Jours de streak</div>
              </Card>
              <Card style={{ padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.cyan, fontFamily: "'Sora', sans-serif" }}>72%</div>
                <div style={{ fontSize: 11, color: C.muted }}>📈 Objectif atteint</div>
              </Card>
            </div>
            <Card style={{ padding: "18px", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12 }}>Nutrition aujourd'hui</div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {[
                  { label: "Prot.", val: "95g", max: 120, color: C.orange },
                  { label: "Gluc.", val: "140g", max: 180, color: C.cyan },
                  { label: "Lip.", val: "42g", max: 65, color: C.lime },
                ].map((n, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <Ring value={Math.round((parseInt(n.val)/n.max)*100)} size={50} stroke={4} color={n.color} />
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{n.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: n.color }}>{n.val}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card style={{ padding: "16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: C.gradient1, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>AC</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>Coach Alex</div>
                <div style={{ fontSize: 11, color: C.muted }}>Pense à bien t'hydrater 💧</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: C.orange }} />
            </Card>
          </div>
        )}

        {tab === "training" && (
          <div style={{ animation: "fadeUp 0.3s both" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Mon training</h2>
            {["Circuit Training HIIT", "Cardio Endurance", "Renforcement Core", "Stretching Recovery"].map((t, i) => (
              <Card key={i} style={{ padding: "18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: i === 0 ? C.gradient1 : `${C.muted}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>{I.fire(i === 0 ? "#fff" : C.muted)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{t}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{[50, 35, 40, 25][i]} min · {["Intense","Modéré","Modéré","Léger"][i]}</div>
                </div>
                {i === 0 && <Badge text="NEXT" color={C.orange} />}
                {I.arrow(C.muted)}
              </Card>
            ))}
          </div>
        )}

        {tab === "nutrition" && (
          <div style={{ animation: "fadeUp 0.3s both" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>Nutrition</h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Objectif : 1 850 kcal / jour</p>
            <Card style={{ padding: "20px", marginBottom: 16, textAlign: "center" }}>
              <Ring value={68} size={100} stroke={8} color={C.orange} />
              <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>1 258 / 1 850 kcal</div>
            </Card>
            {["Petit-déjeuner — 380 kcal", "Déjeuner — 520 kcal", "Collation — 158 kcal", "Dîner — à compléter"].map((m, i) => (
              <Card key={i} style={{ padding: "14px 18px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: i === 3 ? C.muted : C.white, fontWeight: 500 }}>{m}</span>
                {i < 3 ? I.check(C.lime) : I.plus(C.orange)}
              </Card>
            ))}
          </div>
        )}

        {tab === "progress" && (
          <div style={{ animation: "fadeUp 0.3s both" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Mes progrès</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Poids", val: "68 kg", trend: "-2.4", color: C.lime },
                { label: "Masse grasse", val: "24%", trend: "-1.8", color: C.cyan },
                { label: "Séances", val: "24", trend: "+4", color: C.orange },
                { label: "Streak", val: "12j", trend: "Record !", color: C.orange },
              ].map((s, i) => (
                <Card key={i} style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: C.lime, fontWeight: 600, marginTop: 4 }}>{s.trend}</div>
                </Card>
              ))}
            </div>
            <Card style={{ padding: "18px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12 }}>Évolution du poids</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
                {[72, 71.5, 71, 70.5, 70, 69.5, 69, 68.8, 68.5, 68.2, 68, 68].map((w, i) => (
                  <div key={i} style={{ flex: 1, height: ((w - 66) / 8) * 80, borderRadius: 4, background: i === 11 ? C.gradient1 : `${C.muted}20`, animation: `growUp 0.6s ${i * 40}ms both` }} />
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === "chat" && (
          <div style={{ animation: "fadeUp 0.3s both" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Mon coach</h2>
            <Card style={{ padding: "20px", textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: C.gradient1, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 800, boxShadow: `0 8px 24px ${C.orangeGlow}` }}>AC</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>Coach Alex Couture</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Coach certifié Sport & Santé</div>
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { from: "coach", text: "Super Sophie ! Pense à bien t'hydrater. On se voit cet aprèm 🔥" },
                { from: "client", text: "À toute à l'heure !" },
              ].map((m, i) => (
                <div key={i} style={{ alignSelf: m.from === "client" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                  <div style={{ padding: "12px 16px", borderRadius: 16, borderBottomRightRadius: m.from === "client" ? 4 : 16, borderBottomLeftRadius: m.from === "coach" ? 4 : 16, background: m.from === "client" ? C.gradient1 : C.bgCard, color: "#fff", fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 390, padding: "8px 12px 20px", display: "flex", justifyContent: "space-around", background: `${C.bgCard}F0`, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", padding: "6px 10px" }}>
            {t.icon(tab === t.id ? C.orange : C.muted)}
            <span style={{ fontSize: 9, fontWeight: 600, color: tab === t.id ? C.orange : C.muted }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function MyCareCoach() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [view, setView] = useState("dashboard");
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");

  const renderView = () => {
    switch (view) {
      case "dashboard": case "clients": return <DashboardView setView={setView} setSelectedClient={setSelectedClient} />;
      case "clientDetail": return <ClientDetailView client={selectedClient} goBack={() => setView("dashboard")} />;
      case "calendar": return <CalendarView />;
      case "chat": return <ChatView />;
      case "payments": return <PaymentsView />;
      case "nutrition": return <NutritionView />;
      case "stats": return <StatsView />;
      case "mobile": return <MobileClientView />;
      default: return <DashboardView setView={setView} setSelectedClient={setSelectedClient} />;
    }
  };

  const isMobile = view === "mobile";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: ${C.bg}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes growUp { from { height: 0; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active={activeNav} setActive={setActiveNav} setView={(v) => { setView(v); setActiveNav(v); }} />
        <div style={{ flex: 1, marginLeft: 72, padding: isMobile ? 0 : "0 32px 40px" }}>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 0", position: "sticky", top: 0, background: C.bg, zIndex: 50 }}>
              <div>
                <div style={{ fontSize: 13, color: C.muted }}>Bonjour Alex 👋</div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: "'Sora', sans-serif" }}>MyCareCoach</h1>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 16px", width: 220 }}>
                  {I.search(C.muted)}
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ border: "none", outline: "none", background: "transparent", color: C.white, fontSize: 13, fontFamily: "'Outfit', sans-serif", width: "100%" }} />
                </div>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.bgCard, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
                  {I.bell(C.muted)}
                  <div style={{ position: "absolute", top: 10, right: 10, width: 7, height: 7, borderRadius: 4, background: C.red, boxShadow: `0 0 6px ${C.red}` }} />
                </div>
              </div>
            </div>
          )}
          {renderView()}
        </div>
      </div>
    </>
  );
}
