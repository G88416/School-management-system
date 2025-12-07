# BIS - Bophelong Independent School Management System

Advanced School Management System with real-time communication, video/voice calling, and comprehensive administration tools.

## 🚀 Features

### Core Management
- **Student Management** - Track student records, enrollment, and academic progress
- **Attendance Tracking** - Real-time attendance management for all students
- **Fee Management** - Complete fee tracking, payment processing with Stripe integration
- **Staff Management** - HR module with payroll, leave management, and performance tracking
- **Admission System** - Online application processing and enrollment management

### Real-Time Communication (NEW ✨)
- **Cross-Device Message Syncing** - Messages sync instantly across all devices
- **Video Calling** - WebRTC-powered video calls between teachers, parents, and HODs
- **Voice Calling** - High-quality voice calls with mute and hang-up controls
- **Voice Notes** - Record and send voice messages with cloud storage
- **Push Notifications** - Receive alerts even when app is closed
- **Real-Time Data Sync** - Admin changes reflect immediately on all connected devices

### Progressive Web App (PWA)
- **Installable** - Install on any device like a native app
- **Offline Support** - Continue working without internet connection
- **Auto-Updates** - Service worker ensures you always have the latest version

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for real-time features)
- Firebase account (optional, for cross-device sync)

## 🔧 Setup Instructions

### Basic Setup (Local Sync Only)

1. Clone or download the repository
2. Open `index.html` in a web browser
3. Login with default credentials:
   - **Admin:** username: `admin`, password: `admin123`
   - **Teacher:** username: `teacher`, password: `teacher123`
   - **HOD:** username: `hod`, password: `hod123`
   - **Parent:** username: `parent`, password: `parent123`
   - **Student:** username: `student`, password: `student123`

### Firebase Setup (For Cross-Device Sync)

To enable real-time syncing across multiple devices, follow these steps:

#### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if not needed)

#### 2. Enable Required Services

In your Firebase project:

1. **Realtime Database:**
   - Go to "Realtime Database" in the left menu
   - Click "Create Database"
   - Choose your location
   - Start in "Test mode" (for development)
   
2. **Cloud Storage:**
   - Go to "Storage" in the left menu
   - Click "Get Started"
   - Start in "Test mode" (for development)

3. **Cloud Messaging (Optional):**
   - Go to "Cloud Messaging" in the left menu
   - Note your Sender ID

#### 3. Get Web App Credentials

1. Go to Project Settings (gear icon) → General
2. Scroll down to "Your apps"
3. Click the Web icon (</>)
4. Register your app with a nickname (e.g., "BIS Management")
5. Copy the configuration object (you'll need these values)

#### 4. Configure in BIS Management

1. Login to BIS Management as Admin
2. Go to **Settings** → **Real-Time Sync** tab
3. Enter your Firebase credentials:
   - API Key
   - Project ID
   - Database URL
   - Auth Domain
   - Storage Bucket
   - Messaging Sender ID
   - App ID
4. Click "Save & Connect"
5. Click "Test Connection" to verify setup

#### 5. Set Database Rules (Important!)

For production, update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "schools": {
      "$schoolId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

## 🎯 Usage Guide

### Real-Time Messaging

1. Navigate to **Media** section
2. Type your message in the Live Chat
3. Click Send - message appears instantly on all devices

### Video/Voice Calls

#### Starting a Call:
1. Navigate to Teachers or Parent Portal section
2. Click the video or voice call button
3. Select the recipient
4. Wait for them to answer

#### Receiving a Call:
- An incoming call notification will appear automatically
- Click "Accept" to join the call
- Click "Reject" to decline

#### During a Call:
- **Mute/Unmute:** Click the microphone icon
- **Toggle Video:** Click the video icon (video calls only)
- **End Call:** Click the red phone icon

### Voice Notes

1. Click the "Record Voice Note" button
2. Speak your message
3. Click "Stop Recording" when done
4. Voice note automatically sends and syncs to Firebase

### Managing Users

1. Go to **Settings** → **User Management**
2. Click "Create New User"
3. Fill in user details and select role
4. Users can login immediately with their credentials
5. View all user credentials in the users table

## 🔐 Security Best Practices

### Firebase Security

1. **Never commit Firebase credentials to public repositories**
2. Use Firebase Security Rules to restrict access
3. Enable authentication for production use
4. Rotate API keys regularly
5. Use environment-specific Firebase projects (dev, staging, prod)

### User Management

1. Change default passwords immediately
2. Use strong passwords for admin accounts
3. Regularly audit user access
4. Remove inactive user accounts
5. Limit admin privileges to necessary personnel

## 🐛 Troubleshooting

### Firebase Not Connecting

- Verify all credentials are entered correctly
- Check that Realtime Database and Storage are enabled in Firebase Console
- Ensure database rules allow read/write access
- Check browser console for error messages

### Calls Not Working

- Grant microphone/camera permissions when prompted
- Check firewall settings (WebRTC uses UDP)
- Ensure both parties are online
- Try refreshing the page

### Voice Notes Not Recording

- Grant microphone permission when prompted
- Use HTTPS or localhost (required for MediaRecorder API)
- Check that Firebase Storage is configured
- Ensure browser supports MediaRecorder API

### Offline Mode Not Working

- Ensure service worker is registered (check browser console)
- Clear browser cache and reload
- Use HTTPS or localhost (required for service workers)

## 📱 PWA Installation

### Desktop (Chrome/Edge):
1. Open the app in browser
2. Look for install icon in address bar
3. Click "Install"

### Mobile (iOS):
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"

### Mobile (Android):
1. Open in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen"

## 🔄 Data Synchronization

### Local Sync (No Firebase)
- Uses BroadcastChannel API
- Syncs across tabs on same device
- No cross-device sync
- No cloud storage for voice notes

### Firebase Sync (Configured)
- Real-time sync across all devices
- Persistent cloud storage
- Push notifications
- Offline queue (syncs when reconnected)

## 📊 System Architecture

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 for UI
- Chart.js for visualizations
- Font Awesome icons

### Real-Time Communication
- Firebase Realtime Database
- Firebase Cloud Storage
- Firebase Cloud Messaging (FCM)
- PeerJS (WebRTC wrapper)
- BroadcastChannel API

### Storage
- LocalStorage (primary)
- Firebase Realtime Database (sync)
- Firebase Storage (media files)

## 🤝 Contributing

This is a school management system. For feature requests or bug reports, please contact the administrator.

## 📄 License

Copyright © 2024 G19 Systems. All rights reserved.

## 🆘 Support

For technical support:
- Visit: https://www.g19systems.com/
- Email: support@g19systems.com

---

**Built with ❤️ by G19 Systems for Bophelong Independent School**
