# Firebase and Video Server Configuration Guide

## Overview
The School Management System now automatically initializes Firebase (for cross-device sync) and the CommHub Pro video server (for video conferencing) on page load. This guide explains how to configure and use these features.

## 🎥 Video Server (CommHub Pro)

### Automatic Setup
✅ **No configuration required!**

The video server is **automatically configured and connected** when you open the application.

- **Server URL**: Pre-configured in application (WSS endpoint)
- **Auto-connects**: Yes, on page load
- **Auto-reconnects**: Yes, with exponential backoff
- **Status**: Check the login page status indicator

> **Note for Developers**: The server endpoint is configured in the application code. For production deployments, use environment variables or configuration files to manage server URLs securely.

### Features
- 📹 Group video conferencing
- 🎤 Voice calling
- 🖥️ Screen sharing
- 💬 Chat during calls
- 🎙️ Voice notes

### Usage
1. **Login** to the system
2. **Navigate** to Media > CommHub Pro
3. **Enter a room name** (or accept the default)
4. **Click "Join Room"** - Video server is already connected!
5. **Grant camera/microphone permissions** when prompted

### Connection Status
Check the status on the login page:
- 🟢 **Green "Connected"** - Ready to use
- 🟡 **Yellow "Reconnecting..."** - Temporary issue, will reconnect automatically
- 🔴 **Red "Failed"** - Check your internet connection

### Troubleshooting
If video calls don't work:
1. **Check permissions**: Browser must allow camera/microphone access
2. **Check internet**: Video requires stable connection
3. **Check firewall**: Ensure WebSocket connections (port 443) are allowed
4. **Refresh page**: Reload if connection status shows red

---

## 🔥 Firebase (Cross-Device Real-Time Sync)

### What is Firebase?
Firebase enables **real-time synchronization** of data across all devices:
- Messages sync instantly across phones, tablets, computers
- Admin changes reflect immediately on all connected devices
- Voice notes and media stored in cloud
- Works across different browsers and locations

### Auto-Initialization
Firebase **automatically initializes** on page load **IF** you have configured credentials in Settings.

### Configuration Steps

#### 1. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Click on Project Settings (⚙️ gear icon)
4. Scroll down to "Your apps" section
5. Click on Web app (</>) to add or view your web app
6. Copy the following configuration values:
   - API Key
   - Project ID
   - Database URL
   - Auth Domain
   - Storage Bucket
   - Messaging Sender ID
   - App ID

#### 2. Enable Firebase Services
In Firebase Console, enable:
- **Realtime Database**: For data sync
- **Cloud Storage**: For voice notes and media
- **Cloud Messaging**: For push notifications

#### 3. Configure in Application
1. **Login** as Admin
2. Go to **Settings** (in sidebar)
3. Click on **Real-Time Sync** tab
4. Enter your Firebase credentials:
   ```
   API Key:           your-api-key-here
   Project ID:        your-project-id
   Database URL:      https://your-project-default-rtdb.firebaseio.com
                      OR https://your-project.asia-southeast1.firebasedatabase.app
   Auth Domain:       your-project.firebaseapp.com
   Storage Bucket:    your-project.appspot.com
   Messaging Sender:  your-sender-id
   App ID:            1:your-sender-id:web:your-app-id
   School ID:         [optional - defaults to "default-school"]
   ```
   > **Important**: Keep your API key secure. Never share it publicly or commit it to version control.
5. Click **"Save & Connect"**
6. Wait for success message: "Connected to Firebase!"

#### 4. Verify Connection
1. Click **"Test Connection"** button
2. Check status shows: 🟢 **"Connected"**
3. Reload page - Firebase will auto-connect

### Connection Status
Check Firebase status in multiple places:
- **Login page**: Status indicator
- **Settings > Real-Time Sync**: Main status display
- **Browser console**: Detailed logs

Status indicators:
- 🟢 **Connected** - Real-time sync active
- 🟡 **Not Configured** - Enter credentials in Settings
- 🟡 **SDK Loaded** - Firebase SDK present but not initialized
- 🔴 **Connection Failed** - Check credentials and internet
- ⚠️ **SDK Not Loaded** - Check internet connection

### Features Enabled with Firebase
Once configured, Firebase enables:

✅ **Cross-Device Sync**
- Login on phone, tablet, computer simultaneously
- Changes appear instantly on all devices
- No manual refresh needed

✅ **Real-Time Messaging**
- Messages sync across all devices immediately
- Voice notes stored in cloud and accessible anywhere
- Announcements delivered instantly

✅ **Cloud Storage**
- Voice recordings uploaded to Firebase Storage
- Media accessible from any device
- Automatic backup of important data

✅ **Push Notifications** (if supported by browser)
- Incoming call notifications
- New message alerts
- Important announcements

### Without Firebase
If Firebase is not configured:
- ✅ System works normally with local storage
- ✅ Data saved on current device
- ✅ BroadcastChannel sync (same browser, different tabs)
- ❌ No cross-device sync
- ❌ No cloud storage for voice notes
- ❌ No push notifications

### Troubleshooting Firebase

#### "Not Configured" Status
**Solution**: Configure Firebase credentials in Settings > Real-Time Sync

#### "Connection Failed" Status
**Possible causes**:
1. **Incorrect credentials** - Double-check all values
2. **No internet** - Check connection
3. **Firebase services not enabled** - Enable Realtime Database, Storage, Messaging in Firebase Console
4. **Invalid database URL** - Must end with `.firebaseio.com` or `.firebasedatabase.app` (for newer regions)
5. **Firewall blocking** - Ensure Firebase domains are accessible

**Steps to fix**:
1. Verify credentials are correct
2. Test internet connection
3. Check Firebase Console for service status
4. Try **"Test Connection"** button
5. Check browser console for error details

#### Data Not Syncing
**Check**:
1. Firebase status shows "Connected" ✅
2. Internet connection is stable
3. Multiple devices are logged in to same account
4. Changes are being saved (use "Save Data" button if needed)

#### Clear Configuration
To remove Firebase and go back to local-only mode:
1. Settings > Real-Time Sync
2. Click **"Clear Configuration"**
3. Confirm deletion
4. System will use local storage only

---

## 📊 Connection Status Dashboard

### Login Page Indicators
The login page shows real-time status of all services:

```
System Connectivity Status
━━━━━━━━━━━━━━━━━━━━━━━━
🗄️  Local Storage:  ✅ Available
☁️  Firebase:        🟡 Not Configured
🎥  Video Server:    ✅ Connected
📡  Internet:        ✅ Online
```

### Understanding Status Colors
- 🟢 **Green**: Service working perfectly
- 🟡 **Yellow**: Service available but needs configuration or attention
- 🔴 **Red**: Service unavailable or failed
- ⚠️ **Warning**: Service partially working or deprecated

---

## 🚀 Quick Start Guide

### For Regular Users
1. **Login** - Everything auto-connects
2. **Use features** - Video calls, messaging work instantly
3. **Check status** - Green indicators on login page

### For Admins (Firebase Setup)
1. **Get Firebase account** - Visit Firebase Console
2. **Create project** - Follow Firebase setup wizard
3. **Get credentials** - From Project Settings
4. **Configure app** - Settings > Real-Time Sync
5. **Test** - Click "Test Connection"
6. **Done!** - Auto-connects on next load

### For Developers
1. **Video Server** - Already configured, see `initCommHubSocket()`
2. **Firebase** - Config in `buildFirebaseConfig()` and `initializeFirebase()`
3. **Auto-init** - Called from `window.addEventListener('load', ...)` with 1s delay
4. **Status updates** - Event handlers update UI badges in real-time
5. **Console logs** - Detailed status messages for debugging

---

## 🔧 Technical Details

### Video Server Architecture
- **Technology**: Socket.IO over WebSocket/Polling
- **Protocol**: WSS (WebSocket Secure)
- **Port**: 443 (WSS - WebSocket Secure, not HTTP/HTTPS)
- **Reconnection**: Automatic with exponential backoff (2s to 10s)
- **Timeout**: 20 seconds initial, 60 seconds ping timeout
- **Transports**: WebSocket preferred, falls back to long-polling

> **Note**: WSS (WebSocket Secure) uses port 443 like HTTPS but is a different protocol designed for bidirectional, real-time communication.

### Firebase Architecture
- **Database**: Realtime Database (NoSQL)
- **Storage**: Cloud Storage for media files
- **Messaging**: FCM for push notifications
- **Sync**: Real-time listeners on data paths
- **Structure**: `/schools/{schoolId}/...`

### Data Flow
```
User Action → Local Storage → Firebase (if configured)
                           ↓
                   Other Devices ← Firebase Listeners
                           ↓
                   Update Local Storage → Refresh UI
```

### Auto-Initialization Sequence
```
Page Load
  ↓ (1 second delay)
checkAllConnections()
  ↓
autoInitializeCommHub()
  ├─ Check if Socket.IO loaded
  ├─ Initialize socket connection
  ├─ Setup event handlers
  └─ Update status indicator
  ↓
autoInitializeFirebase()
  ├─ Check if Firebase SDK loaded
  ├─ Load configuration from localStorage
  ├─ Validate credentials
  ├─ Initialize if valid
  └─ Update status indicator
```

---

## 📞 Support

### Common Issues

**Issue**: Video calls won't start
- **Solution**: Grant camera/microphone permissions in browser

**Issue**: Firebase shows "Not Configured"
- **Solution**: Add credentials in Settings > Real-Time Sync

**Issue**: Connection status shows yellow/red
- **Solution**: Check internet connection and reload page

**Issue**: Data not syncing across devices
- **Solution**: Verify Firebase is configured and showing green status

### Getting Help
1. **Check console logs**: Press F12 → Console tab
2. **Check status indicators**: Green = OK, Red = Problem
3. **Test connections**: Use "Check" button on login page
4. **Read error messages**: Notifications provide specific guidance

### Documentation
- **Backend Connectivity**: See `BACKEND_CONNECTIVITY_STATUS.md`
- **CommHub Guide**: See `COMMHUB_QUICK_REFERENCE.md`
- **Video Server Deployment**: See `WEBSOCKET_SERVER_DEPLOYMENT.md`

---

## ✅ Summary

### Video Server
- ✅ **Auto-configured** - Works out of the box
- ✅ **Auto-connects** - Persistent connection maintained
- ✅ **Auto-reconnects** - Handles temporary disconnections
- ✅ **Visual status** - Real-time indicators

### Firebase
- ⚙️ **Optional configuration** - For cross-device sync
- ✅ **Auto-initializes** - When credentials configured
- ✅ **Auto-syncs** - Real-time data propagation
- ✅ **Visual status** - Shows connection state

Both systems are designed to **"just work"** with minimal user intervention!
