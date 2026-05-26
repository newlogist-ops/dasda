# M1H Client Loader Modular

Esse pacote é a base correta para o M1H como Tampermonkey + módulos no GitHub.

## Estrutura

```txt
userscript/loader.user.js
src/core.js
src/styles/main.css
src/modules/settings.js
src/modules/themes.js
src/modules/menu.js
src/modules/lines.js
```

## Como usar

1. Crie um repositório no GitHub, exemplo:

```txt
M1H-Client
```

2. Suba a pasta `src/` para o repositório.

3. Abra `userscript/loader.user.js` e troque:

```js
const REPO_BASE = 'https://cdn.jsdelivr.net/gh/SEU_USUARIO/M1H-Client@main/src/';
```

por exemplo:

```js
const REPO_BASE = 'https://cdn.jsdelivr.net/gh/noobxgamepreix/M1H-Client@main/src/';
```

4. Instale o `loader.user.js` no Tampermonkey.

5. Abra:

```txt
https://www.haxball.com/play
```

6. Pressione `HOME` para abrir/fechar o menu.

## Como adicionar módulos

Crie um arquivo novo:

```txt
src/modules/meu-modulo.js
```

Modelo:

```js
(function () {
  'use strict';

  window.M1H?.registerModule('meu-modulo', {
    init(M1H) {
      console.log('Meu módulo iniciou', M1H.settings);
    }
  });
})();
```

Depois adicione no `FILES` do loader:

```js
'modules/meu-modulo.js'
```
