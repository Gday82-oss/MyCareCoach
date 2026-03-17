import { useState, useEffect, useRef } from "react";

// ─── Palette & Tokens ───────────────────────────────────────────
const T = {
  bg: "#F7F5F0",
  card: "#FFFFFF",
  accent: "#1B6B4A",
  accentLight: "#E8F5EE",
  accentDark: "#134D35",
  warm: "#E8A54B",
  warmLight: "#FFF4E0",
  coral: "#E06D5B",
  coralLight: "#FDEDEA",
  text: "#1A1A1A",
  textMuted: "#7A7A7A",
  border: "#EAEAE5",
  shadow: "0 2px 16px rgba(27,107,74,0.06)",
  shadowHover: "0 6px 28px rgba(27,107,74,0.12)",
};

// ─── Icons (inline SVG components) ──────────────────────────────
const Icon = ({ name, size = 20, color = T.textMuted }) => {
  const icons = {
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
    clients: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    calendar: <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>,
    programs: <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>,
    stats: <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>,
    chat: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
    heart: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>,
    fire: <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>,
    bell: <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>,
    plus: <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>,
    search: <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    arrow: <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>,
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>,
    trophy: <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>,
    weight: <path d="M12 3C10.34 3 9 4.34 9 6c0 .35.07.69.18 1H5c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h2v7c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-7h2c.55 0 1-.45 1-1V9c0-1.1-.9-2-2-2h-4.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {icons[name]}
    </svg>
  );
};

// ─── Micro-animation hook ───────────────────────────────────────
const useStagger = (count, delay = 80) => {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    const timers = [];
    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => setVisible((v) => [...v, i]), i * delay));
    }
    return () => timers.forEach(clearTimeout);
  }, [count, delay]);
  return visible;
};

// ─── Data ───────────────────────────────────────────────────────
const clients = [
  { id: 1, name: "Sophie Martin", age: 34, goal: "Perte de poids", progress: 72, nextSession: "Aujourd'hui 14h", avatar: "SM", status: "active", tag: "cardio" },
  { id: 2, name: "Lucas Dupont", age: 28, goal: "Renforcement musculaire", progress: 45, nextSession: "Demain 10h", avatar: "LD", status: "active", tag: "force" },
  { id: 3, name: "Émilie Bernard", age: 52, goal: "Rééducation dos", progress: 88, nextSession: "Mer. 16h", avatar: "EB", status: "warning", tag: "santé" },
  { id: 4, name: "Marc Leroy", age: 41, goal: "Endurance marathon", progress: 60, nextSession: "Jeu. 8h", avatar: "ML", status: "active", tag: "cardio" },
  { id: 5, name: "Camille Roux", age: 30, goal: "Souplesse & mobilité", progress: 35, nextSession: "Ven. 17h", avatar: "CR", status: "new", tag: "mobilité" },
  { id: 6, name: "Jean Moreau", age: 63, goal: "Activité adaptée senior", progress: 55, nextSession: "Sam. 9h", avatar: "JM", status: "warning", tag: "santé" },
];

const todaySessions = [
  { time: "08:00", client: "Marc Leroy", type: "Cardio HIIT", duration: "45 min", color: T.accent },
  { time: "10:30", client: "Lucas Dupont", type: "Musculation", duration: "60 min", color: T.warm },
  { time: "14:00", client: "Sophie Martin", type: "Circuit training", duration: "50 min", color: T.coral },
  { time: "16:00", client: "Émilie Bernard", type: "Rééducation", duration: "40 min", color: T.accent },
  { time: "17:30", client: "Camille Roux", type: "Yoga & mobilité", duration: "55 min", color: T.warm },
];

const weeklyData = [
  { day: "Lun", sessions: 5, revenue: 250 },
  { day: "Mar", sessions: 4, revenue: 200 },
  { day: "Mer", sessions: 6, revenue: 300 },
  { day: "Jeu", sessions: 3, revenue: 150 },
  { day: "Ven", sessions: 7, revenue: 350 },
  { day: "Sam", sessions: 4, revenue: 200 },
  { day: "Dim", sessions: 1, revenue: 50 },
];

// ─── Sidebar ────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => {
  const menuItems = [
    { id: "dashboard", icon: "dashboard", label: "Tableau de bord" },
    { id: "clients", icon: "clients", label: "Mes clients" },
    { id: "calendar", icon: "calendar", label: "Planning" },
    { id: "programs", icon: "programs", label: "Programmes" },
    { id: "stats", icon: "stats", label: "Statistiques" },
    { id: "chat", icon: "chat", label: "Messagerie" },
  ];

  return (
    <div
      style={{
        width: collapsed ? 72 : 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0F3D2B 0%, #1B6B4A 50%, #2A8C63 100%)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "24px 16px" : "24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="heart" size={22} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ opacity: collapsed ? 0 : 1, transition: "opacity 0.2s" }}>
            <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>
              MyCoachCare
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Sport & Santé
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {menuItems.map((item) => {
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: collapsed ? "12px 14px" : "12px 16px",
                borderRadius: 12,
                cursor: "pointer",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                transition: "all 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 20,
                    borderRadius: 4,
                    background: "#fff",
                  }}
                />
              )}
              <Icon name={item.icon} size={20} color={isActive ? "#fff" : "rgba(255,255,255,0.55)"} />
              {!collapsed && (
                <span
                  style={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              )}
              {!collapsed && item.id === "chat" && (
                <div
                  style={{
                    marginLeft: "auto",
                    background: T.coral,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 10,
                  }}
                >
                  3
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile */}
      <div
        style={{
          padding: collapsed ? "16px 12px" : "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #E8A54B, #E06D5B)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          AC
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Alex Couture</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Coach certifié</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, bgColor, delay }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        background: T.card,
        borderRadius: 18,
        padding: "22px 24px",
        boxShadow: hov ? T.shadowHover : T.shadow,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-2px)" : "none",
        cursor: "default",
        flex: 1,
        minWidth: 180,
        animation: `fadeSlideUp 0.5s ${delay}ms both`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={22} color={color} />
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.accent,
            background: T.accentLight,
            padding: "4px 10px",
            borderRadius: 8,
          }}
        >
          {sub}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: T.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  );
};

// ─── Progress Ring ──────────────────────────────────────────────
const ProgressRing = ({ progress, size = 44, stroke = 4 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  const color = progress >= 70 ? T.accent : progress >= 40 ? T.warm : T.coral;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.border} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
};

// ─── Client Row ─────────────────────────────────────────────────
const ClientRow = ({ client, index }) => {
  const [hov, setHov] = useState(false);
  const statusColors = { active: T.accent, warning: T.warm, new: T.coral };
  const tagColors = { cardio: { bg: T.coralLight, fg: T.coral }, force: { bg: T.warmLight, fg: T.warm }, santé: { bg: T.accentLight, fg: T.accent }, mobilité: { bg: "#F0E6FF", fg: "#7C4DFF" } };
  const tc = tagColors[client.tag] || tagColors.santé;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 20px",
        borderRadius: 14,
        background: hov ? "#FAFAF7" : "transparent",
        transition: "all 0.2s",
        cursor: "pointer",
        animation: `fadeSlideUp 0.4s ${index * 60}ms both`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Avatar */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {client.avatar}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 12,
            height: 12,
            borderRadius: 6,
            background: statusColors[client.status],
            border: "2px solid #fff",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{client.name}</span>
          <span style={{ fontSize: 11, background: tc.bg, color: tc.fg, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
            {client.tag}
          </span>
        </div>
        <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{client.goal}</div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProgressRing progress={client.progress} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{client.progress}%</div>
          <div style={{ fontSize: 11, color: T.textMuted }}>{client.nextSession}</div>
        </div>
      </div>

      {/* Arrow */}
      <Icon name="arrow" size={18} color={hov ? T.accent : T.border} />
    </div>
  );
};

// ─── Session Timeline ───────────────────────────────────────────
const SessionTimeline = () => {
  const [activeIdx, setActiveIdx] = useState(2);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {todaySessions.map((s, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        return (
          <div
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 16px",
              borderRadius: 14,
              background: isActive ? `${s.color}08` : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              opacity: isPast ? 0.5 : 1,
              animation: `fadeSlideUp 0.4s ${i * 80}ms both`,
            }}
          >
            {/* Time */}
            <div style={{ width: 48, fontSize: 13, fontWeight: 600, color: isActive ? s.color : T.textMuted, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
              {s.time}
            </div>

            {/* Dot & Line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <div
                style={{
                  width: isActive ? 14 : 10,
                  height: isActive ? 14 : 10,
                  borderRadius: "50%",
                  background: isPast ? T.border : s.color,
                  border: isActive ? `3px solid ${s.color}33` : "none",
                  transition: "all 0.3s",
                }}
              />
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, color: T.text }}>{s.client}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>
                {s.type} · {s.duration}
              </div>
            </div>

            {isPast && <Icon name="check" size={18} color={T.accent} />}
            {isActive && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#fff",
                  background: s.color,
                  padding: "4px 12px",
                  borderRadius: 8,
                }}
              >
                En cours
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Mini Bar Chart ─────────────────────────────────────────────
const MiniChart = () => {
  const maxSessions = Math.max(...weeklyData.map((d) => d.sessions));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, padding: "0 4px" }}>
      {weeklyData.map((d, i) => {
        const h = (d.sessions / maxSessions) * 80;
        const isToday = i === 2;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{d.sessions}</div>
            <div
              style={{
                width: "100%",
                height: h,
                borderRadius: 8,
                background: isToday ? `linear-gradient(180deg, ${T.accent}, ${T.accentDark})` : T.border,
                transition: "height 0.8s cubic-bezier(0.4,0,0.2,1)",
                animation: `growUp 0.8s ${i * 100}ms both`,
              }}
            />
            <div style={{ fontSize: 11, color: isToday ? T.accent : T.textMuted, fontWeight: isToday ? 700 : 400 }}>
              {d.day}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Quick Action Button ────────────────────────────────────────
const QuickAction = ({ icon, label, color, bgColor, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        borderRadius: 14,
        background: hov ? bgColor : T.card,
        border: `1.5px solid ${hov ? color : T.border}`,
        cursor: "pointer",
        transition: "all 0.25s",
        transform: hov ? "scale(1.02)" : "none",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={18} color={color} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{label}</span>
    </div>
  );
};

// ─── Main App ───────────────────────────────────────────────────
export default function MyCoachCare() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: ${T.bg}; }
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growUp {
          from { height: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.textMuted}; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
        <Sidebar active={activeNav} setActive={setActiveNav} collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            marginLeft: collapsed ? 72 : 240,
            transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
            padding: "0 32px 40px",
            maxWidth: collapsed ? "calc(100% - 72px)" : "calc(100% - 240px)",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 0",
              position: "sticky",
              top: 0,
              background: T.bg,
              zIndex: 50,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: T.textMuted, fontWeight: 500, animation: "fadeSlideUp 0.4s both" }}>
                Bonjour Alex
              </div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: T.text,
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: -0.5,
                  animation: "fadeSlideUp 0.4s 100ms both",
                }}
              >
                Tableau de bord
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.card,
                  borderRadius: 12,
                  padding: "10px 16px",
                  border: `1.5px solid ${T.border}`,
                  width: 240,
                  animation: "fadeSlideUp 0.4s 200ms both",
                }}
              >
                <Icon name="search" size={18} />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Rechercher..."
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    color: T.text,
                    fontFamily: "'DM Sans', sans-serif",
                    width: "100%",
                  }}
                />
              </div>

              {/* Notifications */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: T.card,
                  border: `1.5px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  animation: "fadeSlideUp 0.4s 300ms both",
                }}
              >
                <Icon name="bell" size={20} />
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: T.coral,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <StatCard icon="clients" label="Clients actifs" value="24" sub="+3 ce mois" color={T.accent} bgColor={T.accentLight} delay={0} />
            <StatCard icon="calendar" label="Séances aujourd'hui" value="5" sub="2 restantes" color={T.warm} bgColor={T.warmLight} delay={100} />
            <StatCard icon="fire" label="Séances ce mois" value="87" sub="+12% vs sept." color={T.coral} bgColor={T.coralLight} delay={200} />
            <StatCard icon="trophy" label="Taux de rétention" value="94%" sub="Excellent" color={T.accent} bgColor={T.accentLight} delay={300} />
          </div>

          {/* Main Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Client List Card */}
              <div
                style={{
                  background: T.card,
                  borderRadius: 20,
                  padding: "24px",
                  boxShadow: T.shadow,
                  animation: "fadeSlideUp 0.5s 200ms both",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Playfair Display', serif" }}>
                      Mes clients
                    </h2>
                    <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>6 clients suivis cette semaine</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: T.accent,
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Icon name="plus" size={16} color="#fff" />
                    Nouveau client
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {clients.map((c, i) => (
                    <ClientRow key={c.id} client={c} index={i} />
                  ))}
                </div>
              </div>

              {/* Weekly Overview */}
              <div
                style={{
                  background: T.card,
                  borderRadius: 20,
                  padding: "24px",
                  boxShadow: T.shadow,
                  animation: "fadeSlideUp 0.5s 400ms both",
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
                  Activité de la semaine
                </h2>
                <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>30 séances · 1 500 € de CA</p>
                <MiniChart />
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Today's Sessions */}
              <div
                style={{
                  background: T.card,
                  borderRadius: 20,
                  padding: "24px",
                  boxShadow: T.shadow,
                  animation: "fadeSlideUp 0.5s 300ms both",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Playfair Display', serif" }}>
                      Aujourd'hui
                    </h2>
                    <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Mar. 4 mars 2026</p>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.accent,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Voir tout <Icon name="arrow" size={14} color={T.accent} />
                  </div>
                </div>
                <SessionTimeline />
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  background: T.card,
                  borderRadius: 20,
                  padding: "24px",
                  boxShadow: T.shadow,
                  animation: "fadeSlideUp 0.5s 500ms both",
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>
                  Actions rapides
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <QuickAction icon="plus" label="Nouvelle séance" color={T.accent} bgColor={T.accentLight} />
                  <QuickAction icon="programs" label="Créer un programme" color={T.warm} bgColor={T.warmLight} />
                  <QuickAction icon="weight" label="Bilan corporel" color={T.coral} bgColor={T.coralLight} />
                  <QuickAction icon="chat" label="Envoyer un message" color="#7C4DFF" bgColor="#F0E6FF" />
                </div>
              </div>

              {/* Motivation Card */}
              <div
                style={{
                  borderRadius: 20,
                  padding: "28px 24px",
                  background: `linear-gradient(135deg, ${T.accent} 0%, #2A8C63 100%)`,
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  animation: "fadeSlideUp 0.5s 600ms both",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.7, fontWeight: 600, marginBottom: 8 }}>
                    Objectif du mois
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
                    100 séances
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
                    87 réalisées — plus que 13 !
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.2)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "87%",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.9)",
                        transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
