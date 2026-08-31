/**
 * SITE LOADER — premium theatre-curtain opening.
 *
 * Rendered on the very first paint (SSR included) so the curtains are up
 * before the site shows. An inline head script in __root sets
 * `data-kmg-loader-seen` on <html> for returning sessions, and CSS hides
 * the loader instantly in that case — no flash either way. Once per
 * session, the curtains part from a glowing brass seam while the wordmark
 * rises, then the stage lifts away. Fully CSS-timed so it cannot hang.
 */
import { useEffect, useState } from "react";

export const LOADER_SESSION_KEY = "kmg.loader.seen.v2";
const DURATION_MS = 5200;

export function SiteLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(LOADER_SESSION_KEY)) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem(LOADER_SESSION_KEY, "1");
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
