(function () {
  var STORAGE_KEY = 'rx-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      if (value === null) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, value);
      }
    } catch (e) {
    }
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(themeOrNull) {
    var root = document.documentElement;
    if (!themeOrNull) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', themeOrNull);
    }

    updateButton(themeOrNull || 'system');
    updateThemeColorMeta(themeOrNull);
  }

  function updateThemeColorMeta(themeOrNull) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;

    var theme = themeOrNull || getSystemTheme();
    if (theme === 'dark') {
      meta.setAttribute('content', '#0F1115');
    } else {
      meta.setAttribute('content', '#FFFFFF');
    }
  }

  function cycleTheme(current) {
    if (current === 'system') return 'light';
    if (current === 'light') return 'dark';
    return 'system';
  }

  function updateButton(mode) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    var icon = btn.querySelector('i');
    if (!icon) return;

    icon.classList.remove('fa-adjust', 'fa-sun-o', 'fa-moon-o');

    if (mode === 'system') {
      icon.classList.add('fa-adjust');
      btn.setAttribute('aria-label', 'Theme: System');
      btn.setAttribute('title', 'Theme: System');
      btn.setAttribute('data-mode', 'system');
      return;
    }

    if (mode === 'light') {
      icon.classList.add('fa-sun-o');
      btn.setAttribute('aria-label', 'Theme: Light');
      btn.setAttribute('title', 'Theme: Light');
      btn.setAttribute('data-mode', 'light');
      return;
    }

    icon.classList.add('fa-moon-o');
    btn.setAttribute('aria-label', 'Theme: Dark');
    btn.setAttribute('title', 'Theme: Dark');
    btn.setAttribute('data-mode', 'dark');
  }

  function init() {
    var stored = getStoredTheme();

    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
    } else {
      applyTheme(null);
    }

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = btn.getAttribute('data-mode') || 'system';
        var next = cycleTheme(current);

        if (next === 'system') {
          storeTheme(null);
          applyTheme(null);
        } else {
          storeTheme(next);
          applyTheme(next);
        }
      });
    }

    if (window.matchMedia) {
      var mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.addEventListener) {
        mql.addEventListener('change', function () {
          var currentStored = getStoredTheme();
          if (currentStored === 'light' || currentStored === 'dark') return;
          applyTheme(null);
        });
      } else if (mql.addListener) {
        mql.addListener(function () {
          var currentStored = getStoredTheme();
          if (currentStored === 'light' || currentStored === 'dark') return;
          applyTheme(null);
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
