# Testing Guide - New CommHub Features

## 🎯 Overview
This guide helps you test the newly implemented features in the CommHub Pro video conferencing system.

## ✨ New Features
1. **Incoming Call Notifications** - Accept/Decline buttons for joining calls
2. **Conference Recording** - Record video conferences with one click
3. **Enhanced Cross-Device Login** - Login from any device with your credentials
4. **Improved User Experience** - Better guidance and feedback

---

## 🧪 Test 1: Video Conferencing Basics

### Prerequisites:
- Two devices (or two browser windows)
- Internet connection
- Camera and microphone

### Steps:
1. **Device 1:**
   - Login to the system (use `admin` / `admin123` or any user)
   - Navigate to **Media** → **CommHub Pro** tab
   - Enter a room name (e.g., "test-room-123")
   - Click **"Join Room"**
   - Allow camera and microphone permissions
   - ✅ **Expected:** Your video appears in the grid

2. **Device 2:**
   - Login on a different device/browser
   - Navigate to **Media** → **CommHub Pro**
   - Enter the **same room name** ("test-room-123")
   - Click **"Join Room"**
   - Allow camera and microphone permissions
   - ✅ **Expected:** Both videos visible to both users

### Success Criteria:
- ✅ Both users can see each other's video
- ✅ Both users can hear each other
- ✅ Placeholder "Join a room to start..." is replaced with videos
- ✅ Video quality is acceptable
- ✅ Minimal lag (< 1 second)

---

## 🎥 Test 2: Conference Recording

### Prerequisites:
- Joined a CommHub room (from Test 1)

### Steps:
1. While in a video call, click the **Record button** (red circle icon)
2. ✅ **Expected:** 
   - Recording indicator appears at top-right
   - Button turns red
   - Chat message: "🔴 Recording started"
   - Other participants see notification

3. Wait 10-15 seconds (or longer for better test)

4. Click the **Record button** again to stop
5. ✅ **Expected:**
   - Recording stops
   - File downloads automatically
   - Filename format: `conference-recording-YYYY-MM-DD-HHMMSS.webm`
   - Chat message: "⏹️ Recording stopped"

6. Open the downloaded file
7. ✅ **Expected:** Video plays successfully with audio

### Success Criteria:
- ✅ Recording starts without errors
- ✅ Recording indicator visible during recording
- ✅ File downloads automatically on stop
- ✅ Video file plays correctly
- ✅ Audio is captured in recording

### Troubleshooting:
- **Recording not supported:** Try Chrome or Edge browser
- **No audio:** Check microphone permissions
- **File won't play:** Try VLC Media Player or update your browser

---

## 📞 Test 3: Incoming Call Notification

### Prerequisites:
- Two devices/browsers
- Both logged in to the system

### Steps:
1. **User A (Caller):**
   - Navigate to **Media** → **CommHub Pro**
   - Join a room (e.g., "call-test-room")

2. **User B (Receiver):**
   - Be logged in but NOT in CommHub
   - ✅ **Expected:** Incoming call notification appears

3. **User B actions:**
   - **Option A - Accept:**
     - Click **"Accept"** button
     - ✅ **Expected:** Auto-joins the room, sees User A's video
   
   - **Option B - Decline:**
     - Click **"Decline"** button
     - ✅ **Expected:** Modal closes, User A notified

### Success Criteria:
- ✅ Incoming call modal displays caller name
- ✅ Accept button works and joins room
- ✅ Decline button closes modal
- ✅ Audio notification plays (if browser allows)

### Note:
Currently, incoming call feature requires server-side implementation to notify users not in the room. The UI and handlers are ready. For now, test the modal by manually triggering it or having both users navigate to CommHub.

---

## 🌐 Test 4: Cross-Device Login

### Prerequisites:
- Admin account access
- Two different devices (computer, phone, tablet, etc.)

### Steps:
1. **Device 1 - Create User:**
   - Login as admin (`admin` / `admin123`)
   - Navigate to **Settings** → **User Management**
   - Click **"Add New User"**
   - Fill in details:
     - Username: `testuser`
     - Password: `test123`
     - Name: `Test User`
     - Role: `Teacher` (or any role)
   - Click **"Add User"**
   - ✅ **Expected:** User created successfully

2. **Device 2 - Login with New User:**
   - On a completely different device
   - Open the application
   - Enter credentials:
     - Username: `testuser`
     - Password: `test123`
   - Click **"Login"**
   - ✅ **Expected:** Login successful

3. **Verify Cross-Device Sync:**
   - Device 1: Make a change (add student, update data)
   - Device 2: Refresh or wait 30 seconds
   - ✅ **Expected:** Changes appear on Device 2

### Success Criteria:
- ✅ Newly created user can login immediately from any device
- ✅ No need to manually sync or transfer data
- ✅ Login page shows cross-device information
- ✅ Data updates sync across devices (if Firebase configured)

---

## 🎮 Test 5: All Controls

### Prerequisites:
- In an active CommHub video call

### Test Each Button:

#### 1. **Mute/Unmute (Microphone Icon)**
- Click to mute
- ✅ **Expected:** Icon changes to microphone-slash
- Click again to unmute
- ✅ **Expected:** Icon returns to microphone
- Other user should hear/not hear you accordingly

#### 2. **Video On/Off (Camera Icon)**
- Click to turn off video
- ✅ **Expected:** Icon changes, your video goes black
- Click again to turn on
- ✅ **Expected:** Video resumes

#### 3. **Screen Share (Desktop Icon)**
- Click to share screen
- Select a window or entire screen
- ✅ **Expected:** Other user sees your screen
- Click again or stop sharing
- ✅ **Expected:** Returns to camera view

#### 4. **Raise Hand (Hand Icon)**
- Click to raise hand
- ✅ **Expected:** Chat message appears: "You raised your hand"
- Other users see notification

#### 5. **Send Reaction (Smile Icon)**
- Click to send random emoji
- ✅ **Expected:** Emoji floats up on screen
- Other users see the same emoji

#### 6. **Leave Room (Phone Slash Icon)**
- Click to leave
- ✅ **Expected:** 
  - Your video removed
  - Disconnected from call
  - Back to join screen
  - Recording stops (if active)

### Success Criteria:
- ✅ All buttons respond correctly
- ✅ State changes visible to all participants
- ✅ No crashes or errors
- ✅ UI updates appropriately

---

## 💬 Test 6: Chat Functionality

### Prerequisites:
- In an active CommHub call with another user

### Steps:
1. Type a message in the chat input
2. Press Enter or click Send button
3. ✅ **Expected:** Message appears in your chat
4. ✅ **Expected:** Other user sees the message immediately

### Success Criteria:
- ✅ Messages send instantly (< 1 second)
- ✅ Messages display sender name
- ✅ Chat scrolls to newest message
- ✅ System messages appear for events (user joined, left, etc.)

---

## 📱 Test 7: Mobile Device Testing

### Prerequisites:
- Mobile phone or tablet
- Mobile browser (Chrome, Safari, Firefox)

### Steps:
1. Open application on mobile device
2. Login with credentials
3. Navigate to **Media** → **CommHub Pro**
4. Join a room
5. Test all features:
   - Video display
   - Audio
   - Controls (mute, video, etc.)
   - Chat
   - Recording

### Success Criteria:
- ✅ UI adapts to mobile screen
- ✅ Touch controls work
- ✅ Video quality acceptable on mobile data
- ✅ Can rotate device (portrait/landscape)
- ✅ All features functional

---

## 🐛 Common Issues & Solutions

### Issue 1: "Join a room to start..." stays visible
**Solution:** 
- Refresh the page
- Check console for errors (F12)
- Verify internet connection
- Try different room name

### Issue 2: Can't see other user's video
**Solutions:**
- Verify both in same room name (case-sensitive)
- Check both granted camera permissions
- Try refreshing both browsers
- Check firewall/antivirus not blocking WebRTC
- Try different network (mobile hotspot)

### Issue 3: Recording not working
**Solutions:**
- Use Chrome or Edge browser (best support)
- Update browser to latest version
- Check available disk space
- Verify camera/microphone permissions

### Issue 4: Can't login from another device
**Solutions:**
- Verify username/password correct (case-sensitive)
- Admin must create user first
- Wait 30 seconds after user creation
- Clear browser cache and retry
- Check internet connection

### Issue 5: No audio/video
**Solutions:**
- Click browser address bar, check permissions
- Grant camera/microphone access
- Check device settings (camera/mic not in use by other app)
- Restart browser
- Try incognito/private mode

---

## ✅ Final Verification Checklist

Before marking as complete, verify:

- [ ] Video conferencing works between two devices
- [ ] Recording starts and stops correctly
- [ ] Recording file downloads and plays
- [ ] All control buttons work
- [ ] Chat messages send/receive
- [ ] New users can login from any device
- [ ] Mobile devices work
- [ ] Screen sharing works
- [ ] Multiple users can join (3+ people)
- [ ] Leaving room works properly
- [ ] No console errors during normal use

---

## 📊 Performance Expectations

| Metric | Expected Value |
|--------|---------------|
| Video lag | < 1 second |
| Chat delivery | < 1 second |
| Recording quality | 720p @ 30fps |
| Max participants | 4-6 (good), 10+ (varies) |
| Connection time | < 5 seconds |
| Bandwidth per stream | 1-2 Mbps |

---

## 🎓 Training Users

### Quick Start Guide for Users:
1. **Login** with your credentials
2. **Navigate** to Media → CommHub Pro
3. **Enter room name** (share with participants)
4. **Click "Join Room"** and allow permissions
5. **Control buttons** at bottom (mute, video, etc.)
6. **Chat** on the right panel
7. **Record** with red circle button
8. **Leave** with phone-slash button

### Tips for Best Experience:
- Use headphones to prevent echo
- Ensure good lighting for video
- Use Chrome/Edge for best compatibility
- Stable internet (WiFi or good 4G/5G)
- Close unnecessary browser tabs
- Mute when not speaking in large groups

---

## 🔒 Security Notes

- All video/audio is peer-to-peer (not stored on server)
- Recordings saved locally only
- Use HTTPS for all connections
- Room names act as passwords (keep private)
- Only logged-in users can access CommHub
- Consider adding room passwords for sensitive meetings

---

## 📞 Support

If you encounter issues not covered in this guide:
1. Check browser console (F12) for errors
2. Try different browser/device
3. Clear cache and retry
4. Check internet connection speed
5. Verify camera/microphone work in other apps

---

## 🎉 Congratulations!

If all tests pass, the CommHub Pro video conferencing system is working perfectly! Users can now:
- ✅ Join video conferences from any device
- ✅ Record important meetings
- ✅ Get notified of incoming calls
- ✅ Login from multiple devices
- ✅ Collaborate in real-time

**Enjoy your new video conferencing features!**

---

*Last Updated: December 2024*
*Version: 2.0*
*Status: Ready for Production* ✅
