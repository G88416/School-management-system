# School Management System - Communication Features Guide

## Overview
The School Management System includes comprehensive communication features including voice calls, video calls, voice notes, and messaging. This guide will help you use these features effectively.

## Features

### 1. Voice Calls
Conference-style voice calls that allow multiple participants to join.

**How to Start a Voice Call:**
1. Ensure you are logged in
2. Navigate to the Live Chat section
3. Click the green phone icon (📞)
4. Allow microphone access when prompted
5. Wait for participants to join

**Controls:**
- **Mute/Unmute**: Click the microphone button to toggle your audio
- **End Call**: Click the red phone icon to leave the call

**Troubleshooting:**
- **"Microphone access was denied"**: Go to your browser settings and allow microphone access for this website
- **"No microphone found"**: Connect a microphone and refresh the page
- **"Microphone is already in use"**: Close other applications using your microphone

---

### 2. Video Calls
Conference-style video calls with camera and microphone support.

**How to Start a Video Call:**
1. Ensure you are logged in
2. Navigate to the Live Chat section
3. Click the yellow video icon (📹)
4. Allow camera and microphone access when prompted
5. Your video will appear, and others can join

**Controls:**
- **Mute/Unmute Audio**: Click the microphone button
- **Toggle Camera**: Click the video camera button to turn your camera on/off
- **End Call**: Click the red phone icon to leave the call

**Video Quality:**
- Default resolution: 640x480
- The system automatically adjusts based on your internet connection

**Troubleshooting:**
- **"Camera access was denied"**: Enable camera and microphone in browser settings
- **"No camera found"**: Connect a webcam and refresh
- **"Camera is already in use"**: Close other video applications
- **Poor video quality**: Check your internet connection speed

---

### 3. Voice Notes
Record and send voice messages to other users.

**How to Send a Voice Note:**
1. Ensure you are logged in
2. Navigate to the Live Chat section
3. Click the blue microphone icon (🎤)
4. Speak your message (timer shows recording duration)
5. Click "Send" when done, or "Cancel" to discard

**Playback:**
- Click the play button on any voice note to listen
- Click pause to stop playback
- Multiple voice notes can be stored in the chat history

**Limitations:**
- Recommended recording duration: < 2 minutes for optimal performance
- Audio format: Automatically selected based on browser support (WebM with Opus codec preferred, fallback to OGG or MP4)
- Storage: Local browser storage (data persists across sessions)

**Troubleshooting:**
- **"Unable to access microphone"**: Check browser permissions
- **Voice note not playing**: Try a different browser (Chrome/Firefox recommended)
- **Recording quality poor**: Speak closer to your microphone

---

### 4. Messaging
Send text messages to individuals or groups.

**How to Send a Message:**
1. Type your message in the text input field
2. Press Enter or click the "Send" button
3. Your message will appear in the chat

**Direct Messaging:**
1. Click "Send Message" in the navigation menu
2. Select recipient from dropdown
3. Type your message
4. Optional: Enable "Send via SMS" for WinSMS integration (requires separate WinSMS API configuration by system administrator)
5. Click "Send"

**Features:**
- Real-time message delivery
- Message history stored locally
- SMS integration available (requires WinSMS configuration)

---

## Browser Requirements

### Fully Supported Browsers:
- ✅ **Google Chrome** 60+ (Recommended)
- ✅ **Microsoft Edge** 79+ (Recommended)
- ✅ **Mozilla Firefox** 55+
- ✅ **Safari** 11+ (some permission prompts may appear)

### Not Supported:
- ❌ Internet Explorer 11 or earlier
- ❌ Older versions of Opera Mini

### Required Browser Features:
- getUserMedia API (for camera/microphone access)
- MediaRecorder API (for voice notes)
- WebRTC (for peer-to-peer calls)

---

## Permissions Setup

### Chrome/Edge:
1. Click the lock icon in the address bar
2. Select "Site settings"
3. Change Microphone to "Allow"
4. Change Camera to "Allow" (for video calls)
5. Refresh the page

### Firefox:
1. Click the lock icon in the address bar
2. Click the arrow next to "Blocked" or "Allowed"
3. Enable Microphone and Camera permissions
4. Reload the page

### Safari:
1. Safari > Preferences > Websites
2. Select Camera and Microphone from the left sidebar
3. Find your website and set to "Allow"
4. Refresh the page

---

## Common Issues and Solutions

### Issue: "Please log in" message appears
**Solution:** You must log in to the system before using communication features. Use your credentials to log in first.

### Issue: Features not working after login
**Solution:** 
1. Refresh the page after logging in
2. Clear browser cache and cookies
3. Try a different browser

### Issue: Audio/Video not working
**Solution:**
1. Check if other apps are using your camera/microphone
2. Restart your browser
3. Update your browser to the latest version
4. Check browser permissions (see Permissions Setup above)

### Issue: Voice notes not saving
**Solution:**
1. Check if browser storage is enabled
2. Clear old data if storage is full
3. Check if cookies are enabled

### Issue: Poor call quality
**Solution:**
1. Check your internet connection
2. Close other bandwidth-heavy applications
3. Move closer to your WiFi router
4. Reduce the number of participants in the call

### Issue: Echo during calls
**Solution:**
1. Use headphones/earbuds
2. Reduce speaker volume
3. The system uses echo cancellation, but it may not work in all scenarios

---

## Privacy and Security

- **Local Storage**: Communication data is stored locally in your browser
- **Permissions**: The system only accesses your camera/microphone when you explicitly start a call or recording
- **Data Transmission**: Voice and video calls use WebRTC for peer-to-peer communication
- **Clearing Data**: You can clear communication history by clearing browser data

---

## Tips for Best Experience

1. **Use a modern browser**: Chrome or Firefox provide the best experience
2. **Use headphones**: Prevents echo and improves audio quality
3. **Good lighting**: For video calls, ensure you have adequate lighting
4. **Stable internet**: Use a wired connection or strong WiFi for best results
5. **Close unnecessary tabs**: Reduces browser resource usage
6. **Update regularly**: Keep your browser updated for security and features

---

## Technical Support

If you continue to experience issues:
1. Check the browser console (F12) for error messages
2. Take a screenshot of any error messages
3. Note which browser and version you're using
4. Contact your system administrator with this information

---

## System Requirements

**Minimum:**
- Processor: Dual-core 2.0 GHz
- RAM: 4 GB
- Internet: 1 Mbps (for voice), 2 Mbps (for video)
- Microphone: Any USB or built-in microphone
- Camera: 480p webcam (for video calls)

**Recommended:**
- Processor: Quad-core 2.5 GHz or better
- RAM: 8 GB or more
- Internet: 5 Mbps or faster
- Microphone: USB headset with noise cancellation
- Camera: 720p or 1080p webcam

---

## Frequently Asked Questions

**Q: Can I use these features on mobile?**
A: Yes, mobile browsers (Chrome Mobile, Safari Mobile) support these features, but desktop browsers provide better performance.

**Q: How many people can join a call?**
A: The system supports multiple participants with no hard-coded limit. However, optimal performance and audio/video quality is achieved with 4-6 participants. More participants may result in degraded quality depending on network conditions.

**Q: Are calls recorded?**
A: No, calls are not automatically recorded. Only voice notes that you explicitly record are saved.

**Q: Can I download voice notes?**
A: Voice notes are stored in your browser's local storage. They can be played back but not directly downloaded.

**Q: What happens if I lose internet during a call?**
A: The call will disconnect. You'll need to start a new call when your connection is restored.

**Q: Do I need to install any plugins?**
A: No, all features work directly in modern browsers without additional plugins.

---

**Last Updated:** December 2024  
**Version:** 1.0
