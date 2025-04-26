// public/firebase-messaging-sw.js
self.addEventListener("push", function (event) {
    const data = event.data.json();
    const { title, body } = data.notification;
  
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: "/icon.png",
      })
    );
  });
  