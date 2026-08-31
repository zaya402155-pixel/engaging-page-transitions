/**
 * SITE LOADER — the "caddy is coming" pre-roll curtain.
 *
 * Shown once per browser session, before the site paints. A caddy scooter
 * races across a flame-lit road while the oven fills up a progress meter,
 * then the whole panel splits open like an oven door to reveal the site.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import pizza from "@/assets/pizza-white.png";
import logo from "@/assets/cheese-logo.png";
import mascot from "@/assets/mascot-kennedy.png";
import caddyAvatar from "@/assets/caddy-avatar.jpg";

const SESSION_KEY = "kmg.loader.seen.v1";

const PHASES = [
  "Firing the charcoal grill",
  "Stretching the dough",
  "Loading the caddy bag",
  "Caddy is rolling out",
];

export function SiteLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 2600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out so the meter sprints then settles
      setProgress(Math.round((1 - Math.pow(1 - t, 2.2)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setVisible(false), 420);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!visible && typeof document !== "undefined") document.body.style.overflow = "";
  }, [visible]);

  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor((progress / 100) * PHASES.length))];

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="site-loader"
          className="loader-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
          aria-live="polite"
          aria-label="Loading Kennedy Moon Grill"
        >
          {/* oven doors */}
          <motion.div className="loader-door loader-door--top" exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.83, 0, 0.17, 1] } }} />
          <motion.div className="loader-door loader-door--bottom" exit={{ y: "100%", transition: { duration: 0.7, ease: [0.83, 0, 0.17, 1] } }} />

          <motion.div
            className="loader-stage"
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35 } }}
          >
            <div className="loader-glow" />

            <motion.img
              src={logo}
              alt=""
              className="loader-logo"
              initial={{ y: 18, opacity: 0, rotate: -6 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: "backOut" }}
            />

            <div className="loader-orbit">
              <motion.img
                src={pizza}
                alt=""
                className="loader-pizza"
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, ease: "linear", repeat: Infinity }}
              />
              <motion.img
                src={mascot}
                alt=""
                className="loader-mascot"
                animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <motion.p
              key={phase}
              className="loader-phase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {phase}…
            </motion.p>

            <div className="loader-track">
              <motion.div className="loader-fill" style={{ width: `${progress}%` }} />
              <motion.div className="loader-caddy" style={{ left: `${progress}%` }} aria-hidden>
                <span className="loader-caddy-trail" />
                <img src={caddyAvatar} alt="" className="loader-caddy-face" />
              </motion.div>
            </div>

            <div className="loader-count">{progress}%</div>

            <div className="loader-road" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
