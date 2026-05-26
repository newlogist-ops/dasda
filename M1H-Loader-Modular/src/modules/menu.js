/* M1H Menu Module */
(function () {
  'use strict';

  function el(tag, attrs = {}, html = '') {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'style') node.setAttribute('style', v);
      else node[k] = v;
    });
    if (html) node.innerHTML = html;
    return node;
  }

  function makeToggle(label, key, M1H) {
    const row = el('label', { class: 'm1h-row' });
    row.innerHTML = `
      <span>${label}</span>
      <input type="checkbox" ${M1H.settings[key] ? 'checked' : ''}>
    `;

    const input = row.querySelector('input');
    input.addEventListener('change', () => M1H.setSetting(key, input.checked));
    return row;
  }

  window.M1H?.registerModule('menu', {
    init(M1H) {
      if (document.getElementById('m1h-menu')) return;

      const root = el('div', { id: 'm1h-menu', class: M1H.settings.menuOpen ? '' : 'm1h-hidden' });
      root.innerHTML = `
        <div class="m1h-head">
          <div>
            <div class="m1h-title">M1H Client</div>
            <div class="m1h-sub">Loader modular • ${M1H.version}</div>
          </div>
          <button id="m1h-close">×</button>
        </div>

        <div class="m1h-section">
          <div class="m1h-section-title">Visual</div>
          <select id="m1h-theme">
            <option value="neon">Neon Cyan</option>
            <option value="redline">Redline</option>
            <option value="clean">Clean Dark</option>
          </select>
        </div>

        <div class="m1h-section" id="m1h-options">
          <div class="m1h-section-title">Módulos</div>
        </div>

        <div class="m1h-section">
          <button id="m1h-reload" class="m1h-btn">Recarregar página</button>
          <button id="m1h-reset" class="m1h-btn ghost">Resetar configs</button>
        </div>

        <div class="m1h-foot">
          Pressione <b>HOME</b> para abrir/fechar.
        </div>
      `;

      document.documentElement.appendChild(root);

      const options = root.querySelector('#m1h-options');
      options.appendChild(makeToggle('Linhas simplificadas', 'simplifiedLines', M1H));
      options.appendChild(makeToggle('Menu compacto', 'compactMenu', M1H));
      options.appendChild(makeToggle('Relógio no menu', 'showClock', M1H));

      const theme = root.querySelector('#m1h-theme');
      theme.value = M1H.settings.theme;
      theme.addEventListener('change', () => M1H.setSetting('theme', theme.value));

      root.querySelector('#m1h-close').onclick = () => {
        root.classList.add('m1h-hidden');
        M1H.setSetting('menuOpen', false);
      };

      root.querySelector('#m1h-reload').onclick = () => location.reload();
      root.querySelector('#m1h-reset').onclick = () => window.M1HSettings.reset();

      function toggleMenu() {
        const open = root.classList.toggle('m1h-hidden') === false;
        M1H.setSetting('menuOpen', open);
      }

      window.addEventListener('keydown', (e) => {
        if (e.code === 'Home') {
          e.preventDefault();
          toggleMenu();
        }
      });

      window.addEventListener('m1h:setting', (ev) => {
        if (ev.detail.key === 'compactMenu') root.classList.toggle('m1h-compact', !!ev.detail.value);
      });

      root.classList.toggle('m1h-compact', !!M1H.settings.compactMenu);
    }
  });
})();
