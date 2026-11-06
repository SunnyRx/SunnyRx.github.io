/* ===========================================================
 * sw-registration.js
 * ===========================================================
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0
 * Register service worker.
 * ========================================================== */

function showServiceWorkerMessage(config) {
  if (typeof createSnackbar === 'function') createSnackbar(config);
}

function handleRegistration(registration) {
  function watchInstallingWorker() {
    const installingWorker = registration.installing;
    if (!installingWorker) return;
    const updating = !!navigator.serviceWorker.controller;
    const onStateChange = () => {
      // Wait for activation, including migration of cached articles.
      if (installingWorker.state !== 'activated') return;
      installingWorker.removeEventListener('statechange', onStateChange);
      if (updating) showServiceWorkerMessage({
        message: 'Site updated.',
        actionText: 'refresh',
        action: () => location.reload()
      });
    };
    installingWorker.addEventListener('statechange', onStateChange);
    onStateChange();
  }
  registration.addEventListener('updatefound', watchInstallingWorker);
  watchInstallingWorker();
}

if ('serviceWorker' in navigator) {
  // Resolve from this script, so /blog/js/sw-registration.js registers /blog/sw.js.
  const script = document.currentScript;
  const workerURL = script && script.src
    ? new URL('../sw.js', script.src)
    : new URL('/sw.js', location.href);
  const firstVisit = !navigator.serviceWorker.controller;

  navigator.serviceWorker.addEventListener('message', event => {
    const data = event.data;
    if (!data || data.command !== 'UPDATE_FOUND') return;
    const currentURL = new URL(location.href);
    currentURL.hash = '';
    if (data.url !== currentURL.href) return;
    showServiceWorkerMessage({
      message: 'Content updated.',
      actionText: 'refresh',
      action: () => location.reload()
    });
  });

  navigator.serviceWorker.register(workerURL.href)
    .then(registration => {
      handleRegistration(registration);
      if (!firstVisit) return;
      return navigator.serviceWorker.ready.then(() => {
        const announceReady = () => {
          if (!navigator.serviceWorker.controller) return;
          navigator.serviceWorker.removeEventListener('controllerchange', announceReady);
          showServiceWorkerMessage({ message: 'App ready for offline use.', duration: 3000 });
        };
        navigator.serviceWorker.addEventListener('controllerchange', announceReady);
        announceReady();
      });
    })
    .catch(error => console.log('ServiceWorker registration failed: ', error));
}
