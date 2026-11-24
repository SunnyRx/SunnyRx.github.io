// Self-destructing Service Worker to cleanly retire the legacy Jekyll/Hux PWA cache.
self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			try {
				const cacheNames = await caches.keys();
				await Promise.all(cacheNames.map((name) => caches.delete(name)));
			} catch {
				// Ignore storage errors during cleanup
			}
			await self.registration.unregister();
			const clients = await self.clients.matchAll({ type: "window" });
			for (const client of clients) {
				try {
					client.navigate(client.url);
				} catch {
					// Ignore non-navigable clients
				}
			}
		})(),
	);
});
