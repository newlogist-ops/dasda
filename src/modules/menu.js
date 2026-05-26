/* M1H Floating Menu Module */
(function () {
  'use strict';

  function el(tag, attrs = {}, html = '') {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else node.setAttribute(k, v);
    });
    if (html) node.innerHTML = html;
    return node;
  }

  function makeToggle(label, key, M1H) {
    const row = el('label', { class: 'm1h-row' });
    row.innerHTML = `<span>${label}</span><input type="checkbox" ${M1H.settings[key] ? 'checked' : ''}>`;
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
            <div class="m1h-sub">HOME abre/fecha • configs também no Settings do HaxBall</div>
          </div>
          <button id="m1h-close">×</button>
        </div>
        <div class="m1h-section">
          <div class="m1h-section-title">Atalhos rápidos</div>
          <div id="m1h-floating-options"></div>
        </div>
      `;

      document.documentElement.appendChild(root);
      const options = root.querySelector('#m1h-floating-options');
      options.appendChild(makeToggle('Linhas simplificadas', 'simplifiedLines', M1H));
      options.appendChild(makeToggle('HUD minimalista', 'hudMinimal', M1H));
      options.appendChild(makeToggle('Chat limpo', 'cleanChat', M1H));

      root.querySelector('#m1h-close').onclick = () => {
        root.classList.add('m1h-hidden');
        M1H.setSetting('menuOpen', false);
      };

      function syncInputs() {
        root.querySelectorAll('input[type="checkbox"]').forEach(input => {
          const label = input.closest('label')?.textContent || '';
          if (label.includes('Linhas')) input.checked = !!M1H.settings.simplifiedLines;
          if (label.includes('HUD')) input.checked = !!M1H.settings.hudMinimal;
          if (label.includes('Chat')) input.checked = !!M1H.settings.cleanChat;
        });
      }

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

      window.addEventListener('m1h:setting', syncInputs);
    }
  });
})();
