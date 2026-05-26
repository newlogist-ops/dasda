/* M1H Themes Module */
(function () {
  'use strict';

  const themes = {
    neon: {
      '--m1h-bg': 'rgba(5, 8, 16, .94)',
      '--m1h-panel': 'rgba(12, 18, 32, .92)',
      '--m1h-accent': '#00e5ff',
      '--m1h-accent2': '#7c3cff',
      '--m1h-text': '#eef7ff',
      '--m1h-muted': '#8ea7bb',
      '--m1h-border': 'rgba(0, 229, 255, .24)'
    },
    redline: {
      '--m1h-bg': 'rgba(16, 6, 9, .94)',
      '--m1h-panel': 'rgba(32, 12, 18, .92)',
      '--m1h-accent': '#ff335f',
      '--m1h-accent2': '#ff9b3d',
      '--m1h-text': '#fff3f5',
      '--m1h-muted': '#bd8f99',
      '--m1h-border': 'rgba(255, 51, 95, .26)'
    },
    clean: {
      '--m1h-bg': 'rgba(8, 8, 10, .94)',
      '--m1h-panel': 'rgba(22, 22, 26, .92)',
      '--m1h-accent': '#ffffff',
      '--m1h-accent2': '#999999',
      '--m1h-text': '#f5f5f5',
      '--m1h-muted': '#aaa',
      '--m1h-border': 'rgba(255,255,255,.18)'
    }
  };

  function applyTheme(id) {
    const theme = themes[id] || themes.neon;
    Object.entries(theme).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }

  window.M1H?.registerModule('themes', {
    init(M1H) {
      applyTheme(M1H.settings.theme);

      window.addEventListener('m1h:setting', (ev) => {
        if (ev.detail.key === 'theme') applyTheme(ev.detail.value);
      });

      window.M1HThemes = {
        list: () => Object.keys(themes),
        apply: (id) => M1H.setSetting('theme', id)
      };
    }
  });
})();
