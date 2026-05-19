importScripts("/scram/scramjet.shared.js");
importScripts("/scram/scramjet.worker.js");

const sw = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      await sw.loadConfig();
      if (sw.route(event)) {
        return sw.fetch(event);
      }
      return fetch(event.request);
    })()
  );
});
