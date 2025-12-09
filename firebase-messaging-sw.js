// Firebase Messaging Service Worker
// Handles background push notifications for calls and messages

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
// Configuration is dynamically loaded from IndexedDB or passed via postMessage
// This placeholder will be replaced at runtime
let firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Listen for config updates from the main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FIREBASE_CONFIG') {
        firebaseConfig = event.data.config;
        console.log('[firebase-messaging-sw.js] Firebase config updated');
    }
});

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message:', payload);

        const { notification, data } = payload;
        
        // Customize notification options based on message type
        let notificationTitle = notification?.title || 'BIS School Management';
        let notificationOptions = {
            body: notification?.body || 'You have a new notification',
            icon: '/icon-192x192.png',
            badge: '/icon-96x96.png',
            vibrate: [200, 100, 200],
            requireInteraction: false
        };

        // Handle different notification types
        if (data && data.type === 'call') {
            notificationTitle = `📞 Incoming ${data.callType === 'video' ? 'Video' : 'Voice'} Call`;
            notificationOptions.body = `${data.caller} is calling you...`;
            notificationOptions.requireInteraction = true;
            notificationOptions.actions = [
                { action: 'answer', title: '✓ Answer', icon: '/icon-answer.png' },
                { action: 'reject', title: '✗ Decline', icon: '/icon-reject.png' }
            ];
            notificationOptions.tag = 'incoming-call';
            notificationOptions.vibrate = [300, 200, 300, 200, 300];
            notificationOptions.data = { callId: data.callId }; // Store callId in notification data
            
            // Play notification sound
            notificationOptions.silent = false;
        } else if (data && data.type === 'message') {
            notificationTitle = '💬 New Message';
            notificationOptions.body = `${data.sender}: ${data.text}`;
            notificationOptions.tag = 'new-message';
        } else if (data && data.type === 'voiceNote') {
            notificationTitle = '🎤 Voice Note';
            notificationOptions.body = `${data.sender} sent you a voice note`;
            notificationOptions.tag = 'voice-note';
        }

        // Show notification
        return self.registration.showNotification(notificationTitle, notificationOptions);
    });

    // Handle notification clicks
    self.addEventListener('notificationclick', (event) => {
        console.log('[Service Worker] Notification click received:', event);

        event.notification.close();

        // Handle action buttons
        if (event.action === 'answer') {
            // Open the app and signal to answer the call
            // Extract callId from notification data
            const notificationData = event.notification.data || {};
            const callId = notificationData.callId || '';
            event.waitUntil(
                clients.openWindow('/?action=answer-call&callId=' + callId)
            );
        } else if (event.action === 'reject') {
            // Reject the call (no action needed, just close)
            console.log('Call rejected by user');
        } else {
            // Default action: open the app
            event.waitUntil(
                clients.matchAll({ type: 'window', includeUncontrolled: true })
                    .then((clientList) => {
                        // If a window is already open, focus it
                        for (let i = 0; i < clientList.length; i++) {
                            const client = clientList[i];
                            if (client.url === '/' && 'focus' in client) {
                                return client.focus();
                            }
                        }
                        // Otherwise, open a new window
                        if (clients.openWindow) {
                            return clients.openWindow('/');
                        }
                    })
            );
        }
    });

    console.log('[firebase-messaging-sw.js] Firebase Messaging Service Worker initialized');

} catch (error) {
    console.error('[firebase-messaging-sw.js] Error initializing Firebase:', error);
}
