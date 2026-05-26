/* M1H HaxBall Settings Injection Module */
(function () {
  'use strict';

  function qs(root, sel) {
    return root ? root.querySelector(sel) : null;
  }

  function createToggle(M1H, label, key, desc) {
    const div = document.createElement('div');
    div.className = 'toggle m1h-hax-toggle';
    div.dataset.m1hKey = key;
    div.innerHTML = `<i class="${M1H.settings[key] ? 'icon-ok' : 'icon-cancel'}"></i>${label}${desc ? `<small>${desc}</small>` : ''}`;

    div.addEventListener('click', () => {
      M1H.setSetting(key, !M1H.settings[key]);
      updateToggle(div, M1H.settings[key]);
    });

    return div;
  }

  function updateToggle(div, value) {
    const i = div.querySelector('i');
    if (!i) return;
    i.className = value ? 'icon-ok' : 'icon-cancel';
  }

  function createSelect(M1H, label, key, options) {
    const row = document.createElement('div');
    row.className = 'm1h-hax-select';
    row.innerHTML = `${label}: <select data-m1h-key="${key}">${options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select>`;
    const sel = row.querySelector('select');
    sel.value = M1H.settings[key];

    sel.addEventListener('change', () => {
      const val = isNaN(Number(sel.value)) ? sel.value : Number(sel.value);
      M1H.setSetting(key, val);
    });

    return row;
  }

  function injectIntoSettings(M1H) {
    const dialog = document.querySelector('.dialog.settings-view');
    if (!dialog || dialog.dataset.m1hInjected === '1') return;

    const misc = qs(dialog, '[data-hook="miscsec"]');
    const video = qs(dialog, '[data-hook="videosec"]');

    if (!misc && !video) return;

    dialog.dataset.m1hInjected = '1';

    if (misc) {
      const box = document.createElement('div');
      box.className = 'm1h-hax-section';
      box.innerHTML = `<h2>M1H Client</h2><div class="m1h-hax-sub">Configurações do cliente carregadas pelo Tampermonkey.</div>`;

      box.appendChild(createToggle(M1H, 'Linhas simplificadas', 'simplifiedLines', 'Visual mais limpo no campo.'));
      box.appendChild(createToggle(M1H, 'HUD minimalista', 'hudMinimal', 'Reduz elementos visuais extras.'));
      box.appendChild(createToggle(M1H, 'Chat limpo', 'cleanChat', 'Deixa o chat menos poluído.'));
      box.appendChild(createToggle(M1H, 'Ocultar avatares', 'hideAvatars', 'Visual mais seco durante o jogo.'));

      misc.appendChild(box);
    }

    if (video) {
      const box = document.createElement('div');
      box.className = 'm1h-hax-section';
      box.innerHTML = `<h2>M1H Video</h2>`;

      box.appendChild(createSelect(M1H, 'Tema M1H', 'theme', [
        { value: 'neon', label: 'Neon Cyan' },
        { value: 'redline', label: 'Redline' },
        { value: 'clean', label: 'Clean Dark' }
      ]));

      box.appendChild(createSelect(M1H, 'Força das linhas simplificadas', 'simplifiedLinesStrength', [
        { value: 1, label: 'Leve' },
        { value: 2, label: 'Média' },
        { value: 3, label: 'Forte' }
      ]));

      video.appendChild(box);
    }

    window.addEventListener('m1h:setting', (ev) => {
      dialog.querySelectorAll('[data-m1h-key]').forEach(node => {
        const key = node.dataset.m1hKey;
        if (!(key in M1H.settings)) return;

        if (node.classList.contains('m1h-hax-toggle')) {
          updateToggle(node, !!M1H.settings[key]);
        } else if (node.tagName === 'SELECT') {
          node.value = String(M1H.settings[key]);
        }
      });
    });
  }

  window.M1H?.registerModule('hax-settings', {
    init(M1H) {
      const scan = () => injectIntoSettings(M1H);

      const obs = new MutationObserver(scan);
      obs.observe(document.documentElement, { childList: true, subtree: true });

      document.addEventListener('click', () => setTimeout(scan, 50), true);
      document.addEventListener('keydown', () => setTimeout(scan, 50), true);
      setInterval(scan, 1000);

      scan();
    }
  });
})();
