
// main.js — glow + hover glow + fade-out + redirect (single-file version)

(function () {
  // Config
  const BUTTON_ID = 'unlockBtn';
  const REDIRECT_URL = 'tour.html';

  // Durations used in CSS-like transitions (keep in sync with the styles below)
  const OPACITY_TRANS_MS = 280;
  const TRANSFORM_TRANS_MS = 280;
  const GLOW_TRANS_MS = 220;

  // Utility: apply multiple style properties
  function applyStyles(el, styles) {
    for (const [key, value] of Object.entries(styles)) {
      el.style[key] = value;
    }
  }

  // Base glow and hover glow styles
  const baseGlow = {
    boxShadow: '0 0 14px 5px rgba(255, 200, 80, 0.85)',
    filter: 'drop-shadow(0 0 6px rgba(255, 200, 80, 0.6))'
  };
  const hoverGlow = {
    // Slightly stronger, warmer glow on hover/focus
    boxShadow: '0 0 18px 7px rgba(255, 210, 100, 0.95)',
    filter: 'drop-shadow(0 0 8px rgba(255, 210, 100, 0.75))'
  };

  function init() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;

    // Base button visuals
    applyStyles(btn, {
      background: '#222',
      color: '#ffd37a',
      border: '1px solid #ffc45a',
      padding: '0.75rem 1.1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Helvetica Neue', sans-serif",
      fontWeight: '600',
      fontSize: '15px',
      lineHeight: '1.1',
      // Transition settings for smooth glow changes and fade-out
      transition:
        `opacity ${OPACITY_TRANS_MS}ms ease, ` +
        `transform ${TRANSFORM_TRANS_MS}ms ease, ` +
        `box-shadow ${GLOW_TRANS_MS}ms ease, ` +
        `filter ${GLOW_TRANS_MS}ms ease`,
      // Initial states
      opacity: '1',
      transform: 'scale(1)'
    });

    // Initial label
    if (!btn.textContent || btn.textContent.trim().length === 0) {
      btn.textContent = 'UNLOCK';
    }

    // Apply base glow initially
    applyStyles(btn, baseGlow);

    // ----- Hover glow handlers -----
    // Hover (mouse)
    btn.addEventListener('mouseenter', () => {
      // Only apply hover glow if the button is still visible (not fading)
      if (btn.style.opacity !== '0') {
        applyStyles(btn, hoverGlow);
      }
    });

    btn.addEventListener('mouseleave', () => {
      // Return to base glow when leaving hover
      if (btn.style.opacity !== '0') {
        applyStyles(btn, baseGlow);
      }
    });

    // Keyboard focus
    btn.addEventListener('focus', () => {
      if (btn.style.opacity !== '0') {
        applyStyles(btn, hoverGlow);
      }
    });

    btn.addEventListener('blur', () => {
      if (btn.style.opacity !== '0') {
        applyStyles(btn, baseGlow);
      }
    });

    // ----- Click to fade out and redirect -----
    btn.addEventListener('click', () => {
      // Prevent double clicks during animation
      btn.style.pointerEvents = 'none';
      btn.blur();

      // Remove glow immediately to make the change visible before full fade
      applyStyles(btn, {
        boxShadow: '0 0 0 0 rgba(0,0,0,0)',
        filter: 'none'
      });

      // Force reflow so browser separates glow change from the full fade
      // eslint-disable-next-line no-unused-expressions
      btn.offsetHeight;

      // Animate full button fade (opacity + subtle shrink)
      applyStyles(btn, {
        opacity: '0',
        transform: 'scale(0.96)'
      });

      // Redirect on transition end (listen for opacity/transform)
      const onTransitionEnd = (evt) => {
        if (evt.propertyName === 'opacity' || evt.propertyName === 'transform') {
          btn.removeEventListener('transitionend', onTransitionEnd);
          window.location.href = REDIRECT_URL;
        }
      };
      btn.addEventListener('transitionend', onTransitionEnd);

      // Safety fallback in case transitionend doesn’t fire
      const maxMs = Math.max(OPACITY_TRANS_MS, TRANSFORM_TRANS_MS) + 60;
      setTimeout(() => {
        try { btn.removeEventListener('transitionend', onTransitionEnd); } catch (_) {}
        window.location.href = REDIRECT_URL;
      }, maxMs);
    });

    // Optional: accessibility—respect reduced motion by shortening animations
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      // Cut animations to near-zero but keep the sequence intact
      applyStyles(btn, {
        transition: 'opacity 50ms linear, transform 50ms linear, box-shadow 50ms linear, filter 50ms linear'
      });
    }
  }

  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
