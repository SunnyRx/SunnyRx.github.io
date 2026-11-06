(function () {
  'use strict';

  function init() {
    var page = document.querySelector('.search-page');
    var triggers = document.querySelectorAll('.search-icon a, .search-icon button');
    var input = document.getElementById('search-input');
    var closeButton = page && page.querySelector('.search-icon-close');
    if (!page || !input || !closeButton || !triggers.length || page.hasAttribute('data-search-initialized')) return;
    page.setAttribute('data-search-initialized', 'true');

    var isOpen = false;
    var isComposing = false;
    var returnFocus = null;
    var ownsScrollLock = false;

    function setExpanded(expanded) {
      Array.prototype.forEach.call(triggers, function (trigger) {
        trigger.setAttribute('aria-expanded', String(expanded));
      });
    }

    function open(event) {
      event.preventDefault();
      if (isOpen) return;
      returnFocus = event.currentTarget;
      isOpen = true;
      ownsScrollLock = !document.body.classList.contains('no-scroll');
      document.body.classList.add('no-scroll');
      page.removeAttribute('inert');
      page.setAttribute('aria-hidden', 'false');
      page.classList.add('search-active');
      setExpanded(true);
      input.focus({ preventScroll: true });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      isComposing = false;
      page.classList.remove('search-active');
      setExpanded(false);
      if (ownsScrollLock) document.body.classList.remove('no-scroll');
      ownsScrollLock = false;
      // Move focus before hiding its previous owner from assistive technology.
      if (returnFocus && document.documentElement.contains(returnFocus)) {
        returnFocus.focus({ preventScroll: true });
      }
      page.setAttribute('inert', '');
      page.setAttribute('aria-hidden', 'true');
    }

    function focusableElements() {
      return Array.prototype.filter.call(page.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'), function (element) {
        return !element.disabled && element.tabIndex >= 0 && !element.closest('[inert]') &&
          element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
      });
    }

    Array.prototype.forEach.call(triggers, function (trigger) {
      trigger.addEventListener('click', open);
    });
    closeButton.addEventListener('click', close);
    page.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen || isComposing || event.isComposing || event.keyCode === 229) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'Tab') {
        var elements = focusableElements();
        var first = elements[0];
        var last = elements[elements.length - 1];
        if (event.shiftKey && (document.activeElement === first || !page.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !page.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener('focusin', function (event) {
      if (isOpen && !page.contains(event.target)) input.focus({ preventScroll: true });
    });

    // SimpleJekyllSearch 1.x listens to keyup; also search pasted text and IME commits.
    function refreshResults() {
      input.dispatchEvent(new Event('keyup', { bubbles: true }));
    }
    input.addEventListener('input', function (event) {
      if (!isComposing && !event.isComposing) refreshResults();
    });
    input.addEventListener('compositionstart', function () {
      isComposing = true;
    });
    input.addEventListener('compositionend', function () {
      isComposing = false;
      refreshResults();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
