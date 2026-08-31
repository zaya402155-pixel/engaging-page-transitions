/**
 * SITE LOADER — premium theatre-curtain opening.
 *
 * Shown once per browser session. Two velvet curtains part from a glowing
 * brass seam while the wordmark rises, then the whole stage lifts away to
 * reveal the site. Fully CSS-timed so it cannot hang on slow devices.
 */
import { useEffect, useState } from "react";

const SESSION_KEY = "kmg.loader.seen.v2";
const DURATION_MS = 5200;

export function SiteLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, DURATION_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="opening" aria-hidden>
      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />
      <div className="opening-glow" />
      <div className="curtain-valance" />
      <div className="opening-title">
        <span>Kennedy</span>
        <strong>Moon Grill</strong>
        <i>FIRE. FLAVOUR. NAROWAL.</i>
      </div>
    </div>
  );
}
