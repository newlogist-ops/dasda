/* M1H Client Core */
(function () {
  'use strict';

  if (window.M1H) return;

  const M1H = {
    name: 'M1H Client',
    version: '0.1.0',
    storeKey: 'm1h_client_settings_v1',
    modules: {},
    settings: {
      menuOpen: true,
      theme: 'neon',
      simplifiedLines: false,
      compactMenu: false,
      showClock: true
    },

    log(...args) {
      console.log('%c[M1H]', 'color:#00e5ff;font-weight:bold', ...args);
    },

    registerModule(id, module) {
      this.modules[id] = module;
      this.log('Módulo registrado:', id);
    },

    loadSettings() {
      try {
        const saved = JSON.parse(localStorage.getItem(this.storeKey) || '{}');
        this.settings = { ...this.settings, ...saved };
      } catch (_) {}
    },

    saveSettings() {
      localStorage.setItem(this.storeKey, JSON.stringify(this.settings));
    },

    setSetting(key, value) {
      this.settings[key] = value;
      this.saveSettings();
      window.dispatchEvent(new CustomEvent('m1h:setting', { detail: { key, value } }));
    },

    boot() {
      if (this.booted) return;
      this.booted = true;

      this.loadSettings();

      Object.entries(this.modules).forEach(([id, mod]) => {
        try {
          if (mod && typeof mod.init === 'function') mod.init(this);
        } catch (e) {
          console.warn('[M1H] Falha ao iniciar módulo:', id, e);
        }
      });

      this.log('Cliente iniciado', this.version);
      window.dispatchEvent(new CustomEvent('m1h:ready'));
    }
  };

  window.M1H = M1H;
})();
