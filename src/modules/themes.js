/* M1H Themes */
(function () {
  'use strict';

  const themes = {
    neon: {
      '--m1h-accent': '#00e5ff',
      '--m1h-accent2': '#7c3cff'
    },
    red: {
      '--m1h-accent': '#ff335f',
      '--m1h-accent2': '#ff9b3d'
    },
    clean: {
      '--m1h-accent': '#ffffff',
      '--m1h-accent2': '#999999'
    }
  };

  function apply(id) {
    const t = themes[id] || themes.neon;
    Object.entries(t).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }

  window.M1H?.registerModule('themes', {
    init(M1H) {
      apply(M1H.get('theme'));
      window.addEventListener('m1h:setting', (ev) => {
        if (ev.detail.key === 'theme') apply(ev.detail.value);
      });
    }
  });
})();
