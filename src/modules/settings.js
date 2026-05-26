/* M1H Settings Module */
(function () {
  'use strict';

  window.M1H?.registerModule('settings', {
    init(M1H) {
      window.M1HSettings = {
        get: (key) => M1H.settings[key],
        set: (key, value) => M1H.setSetting(key, value),
        all: () => ({ ...M1H.settings }),
        reset: () => {
          localStorage.removeItem(M1H.storeKey);
          location.reload();
        }
      };
    }
  });
})();
