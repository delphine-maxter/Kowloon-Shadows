
// main.js — Single-file version that injects CSS for the button,
// applies a dark-red harmonized glow, and handles fade-out + redirect.

(function () {
  // ---------- CONFIG ----------
  const BUTTON_ID = 'unlockBtn';        // The button element ID in your HTML
  const REDIRECT_URL = 'tour.html';     // Target page after fade-out
  const TITLE_SELECTOR = 'h1.page-title'; // Optional: colorize title if present

  // Durations (must match CSS transitions we inject below)
  const OPACITY_MS = 280;
  const TRANSFORM_MS = 280;
  const GLOW_MS = 220;

  // Dark-red theme (harmonized with title)
  const TITLE_DARK_RED_HEX = '#8B0000'; // DarkRed for the title
  // Button glow tones (slightly brighter reds to harmonize with title)
  const BASE_GLOW = 'rgba(180, 58, 58, 0.85)';
  const BASE_GLOW_SHADOW = 'rgba(180, 58, 58, 0.65)';
  const HOVER_GLOW = 'rgba(210, 74, 74, 0.95)';
  const HOVER_GLOW_SHADOW = 'rgba(210, 74, 74, 0.75)';

  // ---------- CSS INJECTION ----------
  function injectCss() {
    const css = `
/* Harmonize the page title with dark red */
${TITLE_SELECTOR} {
  color: ${TITLE_DARK_RED_HEX};
  margin: 0 0 0.5rem 0;
  font: 700 2rem/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

/* Base button styling */
#${BUTTON_ID} {
  background: #1f1f1f;
  color: #ffd9c7;                 /* warm light text that pairs with dark red */
  border: 1px solid #b43a3a;      /* medium red border */
  padding: 0.75rem 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  font: 600 15px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;

  /* Smooth transitions for glow and fade */
  transition:
    opacity ${OPACITY_MS}ms ease,
    transform ${TRANSFORM_MS}ms ease,
    box-shadow ${GLOW_MS}ms ease,
    filter ${GLOW_MS}ms ease;
}

/* Base glow (harmonized red) */
#${BUTTON_ID}.glow {
  box-shadow: 0 0 14px 5px ${BASE_GLOW};
  filter: drop-shadow(0 0 6px ${BASE_GLOW_SHADOW});
}

/* Hover / focus glow (slightly stronger) */
#${BUTTON_ID}.glow:hover,
#${BUTTON_ID}.glow:focus {
  box-shadow: 0 0 18px 7px ${HOVER_GLOW};
  filter: drop-shadow(0 0 8px ${HOVER_GLOW_SHADOW});
}

/* Fade-out animation for the whole button */
#${BUTTON_ID}.fade-out {
  opacity: 0;
  transform: scale(0.96);           /* swap to translateY(8px) if you prefer slide */
  box-shadow: 0 0 0 0 rgba(0,0,0,0);
  filter: none;
  pointer-events: none;              /* avoid double-clicks during transition */
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  #${BUTTON_ID} {
    transition: opacity 50ms linear, transform 50ms linear, box-shadow 50ms linear, filter 50ms linear;
  }
}
    `.trim();

    const style = document.createElement('style');
    style.setAttribute('data-injected', 'unlock-button-styles');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- BEHAVIOR ----------
  function attachBehavior() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) {
      console.warn(`[K-Shadows] Button #${BUTTON_ID} not found. Add <button id="${BUTTON_ID}">UNLOCK</button> to your HTML.`);
      return;
    }

    // Ensure initial label and glow class
    if (!btn.textContent || !btn.textContent.trim()) {
      btn.textContent = 'UNLOCK';
    }
    btn.classList.add('glow');

    btn.addEventListener('click', () => {
      // Begin fade sequence
      btn.blur();                 // avoid focus ring flash
      btn.classList.remove('glow'); // step 1: remove glow
      // Force reflow so the browser sees distinct steps (glow removal vs fade-out)
      // eslint-disable-next-line no-unused-expressions
      btn.offsetHeight;
      btn.classList.add('fade-out'); // step 2: fade the entire button

      // Redirect when transition ends (opacity or transform)
      const onTransitionEnd = (evt) => {
        if (evt.propertyName === 'opacity' || evt.propertyName === 'transform') {
          btn.removeEventListener('transitionend', onTransitionEnd);
          window.location.href = REDIRECT_URL;
        }
      };
      btn.addEventListener('transitionend', onTransitionEnd);

      // Safety fallback if transitionend doesn’t fire (e.g., CSS overridden)
      const maxMs = Math.max(OPACITY_MS, TRANSFORM_MS) + 80;
      setTimeout(() => {
        try { btn.removeEventListener('transitionend', onTransitionEnd); } catch (_) {}
        window.location.href = REDIRECT_URL;
      }, maxMs);
    });
  }

  // ---------- INIT ----------
  function init() {
    injectCss();
    attachBehavior();
  }

  // Run after DOM is ready (or immediately if already loaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
