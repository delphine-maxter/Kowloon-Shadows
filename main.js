
// main.js — minimal CSS injection (no font overrides) + working click redirect

(function () {
  // ---------- CONFIG ----------
  const BUTTON_ID = 'unlockBtn';
  const REDIRECT_URL = 'tour.html';

  // Animation timings (must match injected CSS transitions)
  const OPACITY_MS = 280;
  const TRANSFORM_MS = 280;
  const GLOW_MS = 220;

  // Harmonized dark‑red glow (works with a DarkRed title like #8B0000)
  const BASE_GLOW = 'rgba(180, 58, 58, 0.85)';
  const BASE_GLOW_SHADOW = 'rgba(180, 58, 58, 0.65)';
  const HOVER_GLOW = 'rgba(210, 74, 74, 0.95)';
  const HOVER_GLOW_SHADOW = 'rgba(210, 74, 74, 0.75)';

  // ---------- CSS INJECTION (NO FONT PROPERTIES) ----------
  function injectCss() {
    const css = `
/* Button base — inherits site fonts; no font or font-family set here */
#${BUTTON_ID} {
  background: #1f1f1f;
  color: inherit;                 /* inherit your site’s text color (or change if you prefer) */
  border: 1px solid #b43a3a;      /* medium red border */
  padding: 0.75rem 1.1rem;
  border-radius: 6px;
  cursor: pointer;

  /* Smooth transitions for glow and fade */
  transition:
    opacity ${OPACITY_MS}ms ease,
    transform ${TRANSFORM_MS}ms ease,
    box-shadow ${GLOW_MS}ms ease,
    filter ${GLOW_MS}ms ease;
}

/* Optional: if you want a specific button text color without touching global fonts */
#${BUTTON_ID} { color: #ffd9c7; }

/* Base glow (harmonized red) */
#${BUTTON_ID}.glow {
  box-shadow: 0 0 14px 5px ${BASE_GLOW};
  filter: drop-shadow(0 0 6px ${BASE_GLOW_SHADOW});
}

/* Hover / focus glow */
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
      console.warn(`[unlock] Button #${BUTTON_ID} not found. Add <button id="${BUTTON_ID}">UNLOCK</button> to your HTML.`);
      return;
    }

    // Don’t touch typography — just ensure label and visual classes
    if (!btn.textContent || !btn.textContent.trim()) {
      btn.textContent = 'UNLOCK';
    }
    btn.classList.add('glow');

    // Click: fade the button, then redirect
    btn.addEventListener('click', () => {
      btn.blur();                 // avoid focus ring flash
      btn.classList.remove('glow');
      // Force reflow so glow removal and fade-out are separate steps
      // eslint-disable-next-line no-unused-expressions
      btn.offsetHeight;
      btn.classList.add('fade-out');

      // Transition-based redirect
      const onTransitionEnd = (evt) => {
        if (evt.propertyName === 'opacity' || evt.propertyName === 'transform') {
          btn.removeEventListener('transitionend', onTransitionEnd);
          window.location.href = REDIRECT_URL;
        }
      };
      btn.addEventListener('transitionend', onTransitionEnd);

      // Safety fallback (in case transitionend doesn’t fire)
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
