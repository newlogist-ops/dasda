/* M1H: Configurações dentro do Settings original do HaxBall */
(function () {
  'use strict';

  function opt(value, label, current) {
    return `<option value="${value}" ${String(current) === String(value) ? 'selected' : ''}>${label}</option>`;
  }

  function makeSelect(M1H, label, key, options) {
    const row = document.createElement('div');
    row.className = 'm1h-option-row';
    row.innerHTML = `
      <div class="m1h-option-label">${label}</div>
      <select data-m1h-key="${key}">
        ${options.map(o => opt(o.value, o.label, M1H.get(key))).join('')}
      </select>
    `;

    const select = row.querySelector('select');
    select.addEventListener('change', () => {
      const raw = select.value;
      const val = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw;
      M1H.set(key, val);
    });

    return row;
  }

  function makeButton(M1H, label, action) {
    const btn = document.createElement('button');
    btn.className = 'm1h-settings-btn';
    btn.textContent = label;
    btn.addEventListener('click', action);
    return btn;
  }

  function inject(M1H) {
    const dialog = document.querySelector('.dialog.settings-view');
    if (!dialog || dialog.dataset.m1hInjected === '1') return;

    const videoSec = dialog.querySelector('[data-hook="videosec"]');
    const miscSec = dialog.querySelector('[data-hook="miscsec"]');

    if (!videoSec && !miscSec) return;

    dialog.dataset.m1hInjected = '1';

    const box = document.createElement('div');
    box.className = 'm1h-settings-box';
    box.innerHTML = `
      <h2>M1H Client</h2>
      <div class="m1h-settings-desc">Configurações carregadas pelo GitHub.</div>
    `;

    box.appendChild(makeSelect(M1H, 'Traços simples', 'simpleLinesMode', [
      { value: 'off', label: 'Desligado' },
      { value: 'light', label: 'Simples - leve' },
      { value: 'medium', label: 'Simples - médio' },
      { value: 'strong', label: 'Simples - forte' }
    ]));

    box.appendChild(makeSelect(M1H, 'Força visual dos traços', 'simpleLinesStrength', [
      { value: 1, label: '1 - baixa' },
      { value: 2, label: '2 - média' },
      { value: 3, label: '3 - alta' }
    ]));

    box.appendChild(makeSelect(M1H, 'Contraste do campo', 'fieldContrast', [
      { value: 1, label: 'Normal' },
      { value: 1.06, label: 'Leve' },
      { value: 1.12, label: 'Médio' },
      { value: 1.2, label: 'Forte' }
    ]));

    box.appendChild(makeSelect(M1H, 'Saturação do campo', 'fieldSaturation', [
      { value: 1, label: 'Normal' },
      { value: 0.92, label: 'Menos cor' },
      { value: 0.82, label: 'Seco' },
      { value: 1.12, label: 'Mais cor' }
    ]));

    box.appendChild(makeSelect(M1H, 'Tema M1H', 'theme', [
      { value: 'neon', label: 'Neon' },
      { value: 'red', label: 'Red' },
      { value: 'clean', label: 'Clean' }
    ]));

    box.appendChild(makeButton(M1H, 'Aplicar agora', () => {
      window.dispatchEvent(new CustomEvent('m1h:setting', { detail: { key: '*', value: true, settings: { ...M1H.settings } } }));
    }));

    box.appendChild(makeButton(M1H, 'Resetar M1H', () => {
      localStorage.removeItem(M1H.storeKey);
      location.reload();
    }));

    // Coloca primeiro no Video. Se não tiver Video, coloca no Misc.
    (videoSec || miscSec).appendChild(box);

    window.addEventListener('m1h:setting', () => {
      dialog.querySelectorAll('select[data-m1h-key]').forEach(sel => {
        const key = sel.dataset.m1hKey;
        sel.value = String(M1H.get(key));
      });
    });
  }

  window.M1H?.registerModule('hax-settings', {
    init(M1H) {
      const scan = () => inject(M1H);

      const obs = new MutationObserver(scan);
      obs.observe(document.documentElement, { childList: true, subtree: true });

      document.addEventListener('click', () => setTimeout(scan, 80), true);
      document.addEventListener('keydown', () => setTimeout(scan, 80), true);

      setInterval(scan, 700);
      scan();
    }
  });
})();
