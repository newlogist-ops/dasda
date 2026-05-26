/* M1H Simplified Lines Module */
(function () {
  'use strict';

  const ID = 'm1h-simplified-lines-style';

  const css = `
    body.m1h-lines-on canvas {
      filter: contrast(1.04) saturate(0.96);
    }

    body.m1h-lines-on .game-view canvas {
      image-rendering: auto;
    }
  `;

  function ensureStyle() {
    if (document.getElementById(ID)) return;
    const style = document.createElement('style');
    style.id = ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function apply(on) {
    ensureStyle();
    if (document.body) document.body.classList.toggle('m1h-lines-on', !!on);
  }

  window.M1H?.registerModule('simplified-lines', {
    init(M1H) {
      const ready = () => apply(M1H.settings.simplifiedLines);

      if (document.body) ready();
      else document.addEventListener('DOMContentLoaded', ready, { once: true });

      window.addEventListener('m1h:setting', (ev) => {
        if (ev.detail.key === 'simplifiedLines') apply(ev.detail.value);
      });

      window.M1HLines = { apply };
    }
  });
})();
