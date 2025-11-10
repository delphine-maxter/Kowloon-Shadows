
// main.js — minimal CSS injection (no font overrides) + reliable click redirect

(function () {
  // ---- CONFIG ----
  const BUTTON_ID = 'unlockBtn';            // Make sure your HTML has <button id="unlockBtn">
  const REDIRECT_URL = 'tour.html';         // Where to go after click
  const OPACITY_MS = 220;                   // fade duration
  const TRANSFORM_MS = 220;                 // fade duration (transform)
  const GLOW_MS = 160;                      // glow transition

  // Harmonized red glow (title often DarkRed #8B0000; glow slightly brighter)
  const BASE_GLOW = 'rgba(180, 58, 58, 0.85)';
  const BASE_GLOW_SHADOW = 'rgba(180, 58, 58, 0.65)';
  const HOVER_GLOW = 'rgba(210, 74, 74, 0.95)';
  const HOVER_GLOW_SHADOW = 'rgba(210, 74, 74, 0.75)';

  // ---- CSS injection (scoped to the button only; no fonts touched) ----
  function injectCss() {
    const css = `
#${BUTTON_ID} {
  /* do NOT set font properties here; inherit site styles */
  background: #1f1f1f;
  color: #ffd9c7;                   /* optional: warm text for the button only */
  border: 1px solid #b43a3a;
  padding: 0.75rem 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition:
    opacity ${OPACITY_MS}ms ease,
    transform ${TRANSFORM_MS}ms ease,
    box-shadow ${GLOW_MS}ms ease,
    filter ${GLOW_MS}ms ease;
}

#${BUTTON_ID}.glow {
  box-shadow: 0 0 14px 5px ${BASE_GLOW};
  filter: drop-shadow(0 0 6px ${BASE_GLOW_SHADOW});
}
#${BUTTON_ID}.glow:hover,
#${BUTTON_ID}.glow:focus {
  box-shadow: 0 0 18px 7px ${HOVER_GLOW};
  filter: drop-shadow(0 0 8px ${HOVER_GLOW_SHADOW});
}

#${BUTTON_ID}.fade-out {
  opacity: 0;
  transform: scale(0.96);
  box-shadow: 0 0 0 0 rgba(0,0,0,0);
  filter: none;
  pointer-events: none;             /* avoid double clicks during the transition */
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

  // ---- Behavior ----
  function attachBehavior() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) {
      console.error(`[unlock] Button #${BUTTON_ID} not found. Add <button id="${BUTTON_ID}">UNLOCK</button> to your HTML.`);
      return;
    }

    // Ensure label and glow
    if (!btn.textContent || !btn.textContent.trim()) btn.textContent = 'UNLOCK';
    btn.classList.add('glow');

    // Be explicit: button should be enabled & clickable
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';

    // Click → fade → redirect
    btn.addEventListener('click', () => {
      // If some other overlay is blocking clicks, log it
      const rect = btn.getBoundingClientRect();
      const elAtPoint = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (elAtPoint && elAtPoint !== btn && !btn.contains(elAtPoint)) {
        console.warn('[unlock] Another element may be on top of the button:', elAtPoint);
      }

      // Start fade sequence
      btn.blur();
      btn.classList.remove('glow');
      // Force reflow to separate glow removal from fade-out
      // eslint-disable-next-line no-unused-expressions
      btn.offsetHeight;
      btn.classList.add('fade-out');

      // Redirect when transition ends (opacity or transform)
      const onEnd = (evt) => {
        if (evt.propertyName === 'opacity' || evt.propertyName === 'transform') {
          btn.removeEventListener('transitionend', onEnd);
          window.location.href = REDIRECT_URL;
        }
      };
      btn.addEventListener('transitionend', onEnd);

      // Fallback timer (guarantee redirect even if transitionend is missed)
      const maxMs = Math.max(OPACITY_MS, TRANSFORM_MS) + 80;
      setTimeout(() => {
        try { btn.removeEventListener('transitionend', onEnd); } catch (_) {}
        window.location.href = REDIRECT_URL;
      }, maxMs);
    });
  }

  // ---- Init ----
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
