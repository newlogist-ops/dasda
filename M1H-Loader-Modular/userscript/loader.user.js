// ==UserScript==
// @name         M1H Client Loader
// @namespace    m1h.client.loader
// @version      0.1.0
// @description  Loader modular do M1H Client para HaxBall.
// @author       Bruno / M1H
// @match        https://www.haxball.com/play*
// @match        https://haxball.com/play*
// @match        https://*.haxball.com/play*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
  'use strict';

  /*
    COMO USAR:
    1) Suba a pasta src/ para seu GitHub.
    2) Troque REPO_BASE abaixo pelo seu link jsDelivr.
       Exemplo:
       https://cdn.jsdelivr.net/gh/SEU_USUARIO/M1H-Client@main/src/
    3) Instale este arquivo no Tampermonkey.
  */

  const REPO_BASE = 'https://cdn.jsdelivr.net/gh/SEU_USUARIO/M1H-Client@main/src/';

  const FILES = [
    'core.js',
    'styles/main.css',
    'modules/settings.js',
    'modules/themes.js',
    'modules/menu.js',
    'modules/lines.js'
  ];

  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        nocache: true,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText);
          else reject(new Error(`HTTP ${res.status} em ${url}`));
        },
        onerror: () => reject(new Error(`Falha ao carregar ${url}`))
      });
    });
  }

  function injectJS(code, name) {
    const s = document.createElement('script');
    s.textContent = `\n//# sourceURL=m1h-${name}\n` + code;
    (document.documentElement || document.head).appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }

  function injectCSS(css, name) {
    const style = document.createElement('style');
    style.id = `m1h-css-${name}`;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  async function boot() {
    window.__M1H_LOADER_STATUS__ = { loading: true, loaded: [], errors: [] };

    for (const file of FILES) {
      const url = REPO_BASE + file + '?v=' + Date.now();

      try {
        const code = await gmGet(url);

        if (file.endsWith('.css')) injectCSS(code, file.replaceAll('/', '-'));
        else injectJS(code, file.replaceAll('/', '-'));

        window.__M1H_LOADER_STATUS__.loaded.push(file);
      } catch (err) {
        console.error('[M1H Loader]', err);
        window.__M1H_LOADER_STATUS__.errors.push(String(err.message || err));
      }
    }

    window.__M1H_LOADER_STATUS__.loading = false;

    const ready = () => {
      if (window.M1H && typeof window.M1H.boot === 'function') {
        window.M1H.boot();
      } else {
        console.warn('[M1H Loader] M1H.boot não encontrado. Verifique REPO_BASE e módulos.');
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ready, { once: true });
    } else {
      ready();
    }
  }

  boot();
})();
