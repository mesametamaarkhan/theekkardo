self.addEventListener('push', function(event) {
	const data = event.data.json();
	const { title, body } = data.notification;
	const { click_action } = data.data; // get click_action from `data`
	
	console.log("Push event received:", click_action);
	event.waitUntil(
	  self.registration.showNotification(title, {
		body,
		icon: '/icon.png',
		data: {
		  click_action: click_action || '/',
		}
	  })
	);
  });

self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] Notification click Received:', event);
  
	event.notification.close();
  
	const click_action = event.notification?.data?.click_action || '/';
  
	event.waitUntil(
	  clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
		if (windowClients.length > 0) {
		  // If app tab is already open
		  let client = windowClients[0];
		  client.navigate(click_action); // <--- Always navigate
		  return client.focus();
		}
		// If no tab is open, open a new window
		if (clients.openWindow) {
		  return clients.openWindow(click_action);
		}
	  })
	);
  });
  
  
//   self.addEventListener('notificationclick', function(event) {
// 	event.notification.close();
  
// 	const clickAction = event.notification.data.click_action || '/';
  
// 	event.waitUntil(
// 	  clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
// 		for (const client of clientList) {
// 		  if (client.url.includes(location.origin)) {
// 			client.navigate(clickAction);
// 			return client.focus();
// 		  }
// 		}
// 		return clients.openWindow(clickAction);
// 	  })
// 	);
//   });
  