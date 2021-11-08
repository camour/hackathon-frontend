const broadcast = new BroadcastChannel('count-channel');
broadcast.onmessage = (event) => {};


self.addEventListener('push', function(event){ 
    //everytime the server node sends us notification (containing the new data), we pass the content of this notification
    // to our navigator
    broadcast.postMessage({payload: event.data.text()});
    const options = {
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        body: 'EHPAD new notification',
        icon: 'images/example.png',
        vibrate: [100, 50, 100],
        actions: [{ action: "explore", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
    };
    event.waitUntil(self.registration.showNotification('new data', options));

});