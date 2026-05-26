/* M1H Core */
(function () {
  'use strict';

  if (window.M1H) return;

  window.M1H = {
    name: 'M1H Client',
    version: '0.3.0',
    storeKey: 'm1h_client_settings_v3',
    modules: {},
    settings: {
      simpleLinesMode: 'off',
      simpleLinesStrength: 1,
      fieldContrast: 1,
      fieldSaturation: 1,
      theme: 'neon'
    },

    registerModule(id, mod) {
      this.modules[id] = mod;
      console.log('%c[M1H] módulo:', 'color:#00e5ff;font-weight:bold', id);
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

    set(key, value) {
      this.settings[key] = value;
      this.saveSettings();
      window.dispatchEvent(new CustomEvent('m1h:setting', { detail: { key, value, settings: { ...this.settings } } }));
    },

    get(key) {
      return this.settings[key];
    },

    boot() {
      if (this.booted) return;
      this.booted = true;
      this.loadSettings();

      Object.entries(this.modules).forEach(([id, mod]) => {
        try {
          if (mod && typeof mod.init === 'function') mod.init(this);
        } catch (e) {
          console.error('[M1H] erro no módulo', id, e);
        }
      });

      console.log('%c[M1H Client iniciado]', 'color:#00e5ff;font-weight:bold', this.version);
      window.dispatchEvent(new CustomEvent('m1h:ready'));
    }
  };
})();
