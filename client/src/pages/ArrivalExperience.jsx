import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Stamp, Ticket, TrainFront, Landmark, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Stagger reveal wrapper ─── */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─── Passport card ─── */
const PassportCard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="passport-card">
      <motion.div
        className="passport-stamp"
        initial={{ scale: 0, rotate: -25, opacity: 0 }}
        animate={inView ? { scale: 1, rotate: -13, opacity: 0.82 } : {}}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.55 }}
      >
        <span>CLEARED</span>
        <span>FOR ENTRY</span>
      </motion.div>

      <h3 className="card-heading">
        <Stamp size={22} />
        Arrival Stamp
      </h3>

      {[
        ["Passenger",      "Guest Traveler"],
        ["Location",       "Beirut Int'l Airport"],
        ["Mission",        "Reach your destination"],
        ["Starting Coins", "20 Coins"],
        ["Planning Time",  "90 Seconds"],
      ].map(([label, value], i) => (
        <motion.div
          key={label}
          className="passport-row"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.25 + i * 0.09, ease: "easeOut" }}
        >
          <span className="passport-label">{label}</span>
          <span className="passport-value">{value}</span>
        </motion.div>
      ))}
    </div>
  );
};

/* ─── Ticket card ─── */
const TicketCard = () => (
  <div className="ticket-card">
    <div className="ticket-punch ticket-punch--left" />
    <div className="ticket-punch ticket-punch--right" />

    <h3 className="card-heading">
      <Ticket size={22} />
      Metro Ticket
    </h3>

    <div className="ticket-barcode-strip">
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          className="barcode-bar"
          style={{
            width:   i % 3 === 0 ? "3px" : "2px",
            opacity: 0.18 + (i % 5) * 0.08,
          }}
        />
      ))}
    </div>

    {[
      ["FROM",   "Beirut"],
      ["TO",     "Unknown ？"],
      ["ROLE",   "Navigator"],
      ["STATUS", "Not Started"],
    ].map(([label, value]) => (
      <div key={label} className="ticket-row">
        <span className="ticket-label">{label}</span>
        <span className="ticket-value">{value}</span>
      </div>
    ))}
  </div>
);

/* ─── Metro Route ─── */
const STATIONS = [
  { name: "Beirut",      sub: "Departure" },
  { name: "Jounieh",     sub: "Station 2" },
  { name: "Byblos",      sub: "Station 3" },
  { name: "Tripoli",     sub: "Station 4" },
  { name: "Destination", sub: "Unknown ?" },
];

const STATION_COUNT  = STATIONS.length;
const DURATION_MS    = 5200; // one-way traversal duration

// Pre-compute the % threshold at which each station becomes "active"
// so we don't recalculate inside the hot RAF loop.
const STATION_THRESHOLDS = STATIONS.map((_, i) =>
  i / (STATION_COUNT - 1)
);

const MetroRoute = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // ── Motion values: written every frame, never trigger React renders ──
  const trainProgress = useMotionValue(0); // 0–1 ping-pong position

  // Derive CSS-ready values from the motion value directly.
  // Framer applies these to the DOM via its own scheduler — no React diff.
  const trainLeft    = useTransform(trainProgress, (t) => `calc(${t * 100}% - 14px)`);
  const visitedWidth = useTransform(trainProgress, (t) => `${t * 100}%`);

  // ── React state: only for station highlight changes (~5× per traversal) ──
  const [activeStation, setActiveStation] = useState(0);
  // Ref holds the previous nearest index so we can skip setState when
  // the value hasn't changed — avoids any render inside the RAF loop.
  const prevStationRef = useRef(0);

  useEffect(() => {
    if (!inView) return;

    let frameId;
    let startTime = null;

    const tick = (timestamp) => {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;
      // Ping-pong: ramp 0→1 then 1→0, repeating
      const raw = (elapsed % (DURATION_MS * 2)) / DURATION_MS;
      const t   = raw <= 1 ? raw : 2 - raw;

      // ── Write position to motion value — zero React overhead ──
      trainProgress.set(t);

      // ── Station change: compare before calling setState ──
      const nearest = Math.round(t * (STATION_COUNT - 1));
      if (nearest !== prevStationRef.current) {
        prevStationRef.current = nearest;
        setActiveStation(nearest); // fires at most once per station crossing
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, trainProgress]);

  return (
    <div ref={ref} className="metro-route-card metro-route-card--hero">
      {/* Header */}
      <div className="metro-card-header">
        <h3 className="card-heading">
          <TrainFront size={22} />
          Metro Route
        </h3>
        <span className="metro-live-badge">
          <span className="metro-live-dot" />
          Live
        </span>
      </div>

      <div className="metro-route-wrapper">
        {/* Track */}
        <div className="metro-track">
          {/* Gradient fill — one-shot entrance animation */}
          <motion.div
            className="metro-track-fill"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          {/*
            Visited-segment highlight.
            motion.div + style prop means Framer writes the width directly
            to the element's style attribute — no React render required.
          */}
          <motion.div
            className="metro-track-visited"
            style={{ width: visitedWidth }}
          />
        </div>

        {/*
          Train element.
          motion.div + style prop: position updates bypass React entirely.
          Only re-renders when inView changes (once).
        */}
        <motion.div
          className="metro-train"
          style={{ left: trainLeft }}
        >
          <div className="metro-train-glow" />
          <TrainFront size={28} />
        </motion.div>

        {/*
          Station dots + labels.
          These only re-render when activeStation changes — which happens
          at most 8 times per full ping-pong cycle (once per station
          boundary crossing), not 60× per second.
        */}
        <div className="metro-stations">
          {STATIONS.map((s, i) => {
            const isActive  = i === activeStation;
            const isPast    = i < activeStation;
            const isMystery = i === STATION_COUNT - 1;

            return (
              <motion.div
                key={s.name}
                className={[
                  "metro-station",
                  isActive ? "metro-station--active" : "",
                  isPast   ? "metro-station--past"   : "",
                ].filter(Boolean).join(" ")}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  type:      "spring",
                  stiffness: 260,
                  damping:   16,
                  delay:     0.4 + i * 0.12,
                }}
              >
                <div
                  className={[
                    "station-dot",
                    isMystery ? "station-dot--mystery" : "",
                    isActive  ? "station-dot--active"  : "",
                    isPast    ? "station-dot--past"     : "",
                  ].filter(Boolean).join(" ")}
                >
                  {isMystery ? "?" : null}
                  {isActive && !isMystery && <span className="station-pulse" />}
                </div>

                <div className="station-info">
                  <span
                    className={[
                      "station-name",
                      isActive ? "station-name--active" : "",
                    ].filter(Boolean).join(" ")}
                  >
                    {s.name}
                  </span>
                  <span className="station-sub">{s.sub}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Callout — cross-fades only when activeStation changes */}
      <div className="metro-station-callout">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStation}
            className="callout-inner"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <span className="callout-label">Now approaching</span>
            <span className="callout-name">{STATIONS[activeStation].name}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── Destination Cards ─── */
const DESTINATIONS = [
  {
    name:   "Beirut",
    arabic: "بيروت",
    desc:   "صخرة الروشة and the start of your adventure.",
    color:  "#0f5132",
    accent: "#dcfce7",
    emoji:  "🌊",
  },
  {
    name:   "Baalbek",
    arabic: "بعلبك",
    desc:   "Ancient temples and a powerful historical stop.",
    color:  "#7c2d12",
    accent: "#fff7ed",
    emoji:  "🏛️",
  },
  {
    name:   "Tyre",
    arabic: "صور",
    desc:   "Ruins, coastline, and a legendary Phoenician city.",
    color:  "#1e3a5f",
    accent: "#eff6ff",
    emoji:  "⚓",
  },
  {
    name:   "Byblos",
    arabic: "جبيل",
    desc:   "Castle views and one of the oldest cities in the world.",
    color:  "#5b2d8e",
    accent: "#f5f3ff",
    emoji:  "🏰",
  },
];

const DestinationCard = ({ d, delay }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef    = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      className="destination-card"
      style={{ "--card-color": d.color, "--card-accent": d.accent }}
      initial={{ opacity: 0, y: 32 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        className="destination-shimmer"
        initial={{ opacity: 0, x: "-100%" }}
        animate={hovered ? { opacity: 1, x: "250%" } : { opacity: 0, x: "-100%" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />

      <div className="destination-card-top">
        <motion.span
          className="destination-emoji"
          animate={hovered ? { scale: 1.3, rotate: -8 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {d.emoji}
        </motion.span>

        <div className="destination-names">
          <span className="destination-name">{d.name}</span>
          <span className="destination-arabic">{d.arabic}</span>
        </div>

        <MapPin size={16} className="destination-pin" />
      </div>

      <p className="destination-desc">{d.desc}</p>

      <div className="destination-accent-bar-track">
        <motion.div
          className="destination-accent-bar"
          style={{ background: d.color }}
          initial={{ scaleX: 0 }}
          animate={cardInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="destination-tag" style={{ background: d.accent, color: d.color }}>
        Explore
      </div>
    </motion.div>
  );
};

const DestinationCards = () => (
  <div className="destinations-section">
    <Reveal>
      <h3 className="section-heading">
        <Landmark size={22} />
        Discover Along the Way
      </h3>
    </Reveal>
    <div className="destinations-grid">
      {DESTINATIONS.map((d, i) => (
        <DestinationCard key={d.name} d={d} delay={i * 0.09} />
      ))}
    </div>
  </div>
);

/* ─── CTA Panel ─── */
const CTAPanel = () => {
  const navigate = useNavigate();
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="cta-panel"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="cta-panel-glow" />
      <div className="cta-panel-content">
        <div className="cta-panel-text">
          <h3>Ready for the briefing?</h3>
          <p>Learn the rules, understand the phases, then begin your Last Race.</p>
        </div>
        <motion.button
          className="cta-panel-btn"
          onClick={() => navigate("/instructions")}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Continue to Instructions
          <span className="cta-arrow">→</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ─── Main Export ─── */
const ArrivalExperience = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping:   25,
  });

  const railHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="arrival-section">
      <div className="journey-rail">
        <motion.div className="journey-rail-fill" style={{ height: railHeight }} />
      </div>

      <Reveal>
        <h2 className="arrival-heading">Your Arrival Experience</h2>
      </Reveal>

      <Reveal delay={0.05} className="passport-ticket-row">
        <PassportCard />
        <TicketCard />
      </Reveal>

      <Reveal delay={0.1}>
        <MetroRoute />
      </Reveal>

      <DestinationCards />

      <CTAPanel />
    </section>
  );
};

export default ArrivalExperience;
