# Firebase Setup Guide for BIS Management System

This guide will help you set up Firebase for real-time cross-device synchronization in the BIS Management System.

## Table of Contents
1. [Overview](#overview)
2. [Creating a Firebase Project](#creating-a-firebase-project)
3. [Enabling Required Services](#enabling-required-services)
4. [Getting Credentials](#getting-credentials)
5. [Configuring BIS Management](#configuring-bis-management)
6. [Security Rules](#security-rules)
7. [Testing](#testing)

## Overview

Firebase provides the backend infrastructure for:
- **Real-time messaging** across all devices
- **Cloud storage** for voice notes and media files
- **Push notifications** for updates
- **Data synchronization** for student records, attendance, etc.

### What You'll Need:
- Google account (free)
- 15-30 minutes for initial setup
- Admin access to BIS Management System

## Creating a Firebase Project

### Step 1: Access Firebase Console

1. Open your browser and go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Click the **"Add project"** button (or **"Create a project"** if this is your first)

### Step 2: Project Setup Wizard

1. **Project name:** Enter a name (e.g., "BIS Management Prod" or "Bophelong-School")
   - This is internal only, users won't see it
   
2. **Google Analytics:** 
   - You can disable this for now (optional for school management)
   - If enabled, accept terms and select your Google Analytics account
   
3. Click **"Create project"** and wait ~30 seconds for provisioning

4. Click **"Continue"** when ready

## Enabling Required Services

### 1. Realtime Database

The Realtime Database stores messages, announcements, and sync data.

1. In Firebase Console, click **"Realtime Database"** in the left sidebar
2. Click **"Create Database"**
3. Choose a database location:
   - Select closest to your school (e.g., `us-central1` for US, `europe-west1` for Europe)
   - **For South Africa:** Choose `us-central1` (closest available)
4. Security rules:
   - Select **"Start in test mode"** for development
   - Click **"Enable"**
   
   ⚠️ **Important:** Test mode allows all reads/writes. We'll secure this later.

5. Your database will be created with a URL like: `https://your-project.firebaseio.com`

### 2. Cloud Storage

Cloud Storage stores voice notes, attachments, and uploaded files.

1. Click **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Security rules:
   - Select **"Start in test mode"**
   - Click **"Next"**
4. Choose storage location:
   - Use same region as your database
   - Click **"Done"**

5. Your storage bucket will be: `your-project.appspot.com`

### 3. Cloud Messaging (Optional but Recommended)

Enables push notifications to user devices.

1. Click **"Cloud Messaging"** in the left sidebar
2. Note your **Sender ID** (you'll need this later)
3. No additional setup needed - it's enabled by default

## Getting Credentials

### Step 1: Register Web App

1. Go to **Project Settings** (click the gear icon ⚙️ in the left sidebar)
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`)
4. In the dialog:
   - **App nickname:** Enter "BIS Management Web" (or any name)
   - **Firebase Hosting:** Leave unchecked
   - Click **"Register app"**

### Step 2: Copy Configuration

You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefGHIJKLMNOP",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Copy these values** - you'll need them in the next step!

Click **"Continue to console"** when done.

## Configuring BIS Management

### Step 1: Login as Admin

1. Open BIS Management System
2. Login with admin credentials

### Step 2: Navigate to Settings

1. Click **"Settings"** in the sidebar
2. Click the **"Real-Time Sync"** tab

### Step 3: Enter Firebase Credentials

Paste the values from Firebase into the form:

| Field | Value | Example |
|-------|-------|---------|
| API Key | `apiKey` | AIzaSyB1234567890abcdefGHIJKLMNOP |
| Project ID | `projectId` | your-project |
| Database URL | `databaseURL` | https://your-project.firebaseio.com |
| Auth Domain | `authDomain` | your-project.firebaseapp.com |
| Storage Bucket | `storageBucket` | your-project.appspot.com |
| Messaging Sender ID | `messagingSenderId` | 123456789012 |
| App ID | `appId` | 1:123456789012:web:abcdef123456 |
| School ID | Custom identifier | bophelong-school |

### Step 4: Save and Connect

1. Click **"Save & Connect"**
2. Wait for success message
3. Click **"Test Connection"** to verify

You should see:
- Status: **Connected** (green)
- Sync Type: **Firebase + BroadcastChannel**

## Security Rules

⚠️ **IMPORTANT:** Test mode rules are insecure. Update them for production.

### Realtime Database Rules

1. Go to **Realtime Database** → **Rules** tab
2. Replace the rules with:

```json
{
  "rules": {
    "schools": {
      "$schoolId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "messages": {
          ".indexOn": ["timestamp"]
        },
        "announcements": {
          ".indexOn": ["timestamp", "priority"]
        },
        "calls": {
          "$userId": {
            ".read": "$userId === auth.uid || auth.token.admin === true",
            ".write": "$userId === auth.uid || auth.token.admin === true"
          }
        }
      }
    }
  }
}
```

**For development (no authentication yet):**
```json
{
  "rules": {
    "schools": {
      "$schoolId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

3. Click **"Publish"**

### Storage Rules

1. Go to **Storage** → **Rules** tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /schools/{schoolId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**For development:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}
```

3. Click **"Publish"**

## Testing

### Test 1: Message Sync

1. Open BIS Management on two different devices (or browsers)
2. Login as admin on both
3. Go to **Media** → **Live Chat**
4. Send a message on Device 1
5. **Verify:** Message appears instantly on Device 2 ✅

### Test 2: Announcements

1. On Device 1 (as admin), go to **Communication** → **Announcements**
2. Create a new announcement
3. **Verify:** Notification appears on Device 2 ✅

### Test 3: Voice Notes (requires Firebase Storage)

1. Go to **Media** section
2. Click **"Record Voice Note"**
3. Speak a message
4. Click **"Stop Recording"**
5. **Verify:** Voice note appears in chat with play button ✅

### Test 4: Video Call (requires WebRTC)

1. Open on two devices
2. Login as different users (e.g., Admin and Teacher)
3. Navigate to **Teachers** section
4. Click video call button
5. **Verify:** Incoming call notification appears on second device ✅

## Monitoring and Analytics

### View Real-Time Data

1. **Realtime Database Console:**
   - See all synced data in real-time
   - Navigate through `/schools/[schoolId]/messages`
   
2. **Storage Console:**
   - View uploaded voice notes
   - Check storage usage

3. **Usage Dashboard:**
   - Monitor daily active users
   - Track bandwidth usage
   - View storage consumption

### Quotas (Free Tier)

Firebase Spark (free) plan includes:
- **Realtime Database:** 1GB storage, 10GB/month downloads
- **Storage:** 5GB storage, 1GB/day downloads
- **Cloud Functions:** 125K invocations/month
- **Cloud Messaging:** Unlimited notifications

For most schools, this is sufficient. Upgrade to Blaze (pay-as-you-go) if needed.

## Troubleshooting

### Connection Failed

**Problem:** "Firebase connection failed" error

**Solutions:**
1. Verify all credentials are correct (copy-paste from Firebase Console)
2. Check that Realtime Database is enabled
3. Ensure database URL includes `https://`
4. Check browser console for specific error messages

### Rules Error

**Problem:** "Permission denied" errors

**Solutions:**
1. Ensure database rules allow read/write
2. For development, use test mode rules temporarily
3. Check that `schoolId` matches in app and database

### Voice Notes Not Uploading

**Problem:** Voice notes not saving

**Solutions:**
1. Verify Storage is enabled in Firebase
2. Check storage rules allow write access
3. Ensure app is using HTTPS (required for MediaRecorder)
4. Check browser supports MediaRecorder API

### Slow Performance

**Problem:** Sync is slow or delayed

**Solutions:**
1. Choose database region closest to your location
2. Check internet connection speed
3. Reduce number of active listeners
4. Use Firebase Performance Monitoring to identify bottlenecks

## Best Practices

### Production Deployment

1. **Enable Authentication:**
   - Use Firebase Authentication for user management
   - Secure database rules with auth checks
   
2. **Environment Separation:**
   - Create separate projects for dev/staging/prod
   - Use different schoolId for each environment
   
3. **Backup Strategy:**
   - Enable automated backups in Firebase
   - Export data regularly from Settings → Data Vault

4. **Monitoring:**
   - Set up Firebase alerts for quota limits
   - Monitor error rates in Firebase Console
   - Track user engagement

5. **Security:**
   - Rotate API keys quarterly
   - Review security rules monthly
   - Audit user access regularly

## Support and Resources

### Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
- [Cloud Storage Guide](https://firebase.google.com/docs/storage)

### Community
- [Firebase Community Slack](https://firebase.community/)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)

### G19 Systems Support
- Website: https://www.g19systems.com/
- Email: support@g19systems.com

---

**Last Updated:** December 2024  
**BIS Management System v1.0.0**
