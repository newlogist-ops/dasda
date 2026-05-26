/* M1H Settings API */
(function () {
  'use strict';

  window.M1H?.registerModule('settings', {
    init(M1H) {
      window.M1HSettings = {
        get: (k) => M1H.get(k),
        set: (k, v) => M1H.set(k, v),
        all: () => ({ ...M1H.settings }),
        reset: () => {
          localStorage.removeItem(M1H.storeKey);
          location.reload();
        }
      };
    }
  });
})();
