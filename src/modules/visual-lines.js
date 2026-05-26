/* M1H Visual Lines */
(function () {
  'use strict';

  const STYLE_ID = 'm1h-visual-lines-style';

  function getCSS(M1H) {
    const mode = M1H.get('simpleLinesMode');
    const strength = Number(M1H.get('simpleLinesStrength') || 1);
    const contrast = Number(M1H.get('fieldContrast') || 1);
    const saturation = Number(M1H.get('fieldSaturation') || 1);

    let extra = '';
    if (mode === 'light') {
      extra = 'contrast(1.04) saturate(0.96)';
    } else if (mode === 'medium') {
      extra = 'contrast(1.10) saturate(0.88)';
    } else if (mode === 'strong') {
      extra = 'contrast(1.18) saturate(0.78)';
    } else {
      extra = `contrast(${contrast}) saturate(${saturation})`;
    }

    const outlineOpacity = mode === 'strong' ? '.32' : mode === 'medium' ? '.22' : mode === 'light' ? '.14' : '0';

    return `
      body canvas {
        filter: ${extra} !important;
      }

      body::after {
        content: "";
        pointer-events: none;
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        opacity: ${outlineOpacity};
        background:
          linear-gradient(90deg, transparent 49.8%, var(--m1h-accent, #00e5ff) 50%, transparent 50.2%),
          linear-gradient(0deg, transparent 49.8%, var(--m1h-accent, #00e5ff) 50%, transparent 50.2%);
        mix-blend-mode: screen;
      }

      .m1h-simple-lines-active .dialog.settings-view {
        outline: 1px solid var(--m1h-accent, #00e5ff);
      }
    `;
  }

  function apply(M1H) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = getCSS(M1H);

    if (document.body) {
      document.body.classList.toggle('m1h-simple-lines-active', M1H.get('simpleLinesMode') !== 'off');
    }
  }

  window.M1H?.registerModule('visual-lines', {
    init(M1H) {
      const run = () => apply(M1H);

      if (document.body) run();
      else document.addEventListener('DOMContentLoaded', run, { once: true });

      window.addEventListener('m1h:setting', run);
      window.M1HVisualLines = { apply: run };
    }
  });
})();
