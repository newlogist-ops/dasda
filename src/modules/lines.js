/* M1H Simplified Lines / Visual Module */
(function () {
  'use strict';

  const ID = 'm1h-visual-style';

  function css(M1H) {
    const strength = Number(M1H.settings.simplifiedLinesStrength || 1);
    const contrast = strength === 3 ? 1.14 : strength === 2 ? 1.09 : 1.04;
    const sat = strength === 3 ? 0.82 : strength === 2 ? 0.90 : 0.96;

    return `
      body.m1h-lines-on canvas {
        filter: contrast(${contrast}) saturate(${sat});
      }

      body.m1h-clean-chat [class*="chat"],
      body.m1h-clean-chat .chatbox {
        opacity: .86 !important;
      }

      body.m1h-hide-avatars img[src*="avatar"],
      body.m1h-hide-avatars [class*="avatar"] {
        display: none !important;
      }

      body.m1h-hud-minimal .roomlist-view .header,
      body.m1h-hud-minimal .game-state-view .header {
        opacity: .82;
      }
    `;
  }

  function ensureStyle(M1H) {
    let style = document.getElementById(ID);
    if (!style) {
      style = document.createElement('style');
      style.id = ID;
      document.head.appendChild(style);
    }
    style.textContent = css(M1H);
  }

  function apply(M1H) {
    ensureStyle(M1H);
    if (!document.body) return;
    document.body.classList.toggle('m1h-lines-on', !!M1H.settings.simplifiedLines);
    document.body.classList.toggle('m1h-clean-chat', !!M1H.settings.cleanChat);
    document.body.classList.toggle('m1h-hide-avatars', !!M1H.settings.hideAvatars);
    document.body.classList.toggle('m1h-hud-minimal', !!M1H.settings.hudMinimal);
  }

  window.M1H?.registerModule('visual-lines', {
    init(M1H) {
      const ready = () => apply(M1H);

      if (document.body) ready();
      else document.addEventListener('DOMContentLoaded', ready, { once: true });

      window.addEventListener('m1h:setting', () => apply(M1H));
      window.M1HVisual = { apply: () => apply(M1H) };
    }
  });
})();
