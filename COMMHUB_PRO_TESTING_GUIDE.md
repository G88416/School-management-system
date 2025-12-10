# CommHub Pro - Testing Guide

## 🧪 Complete Testing Guide for CommHub Pro Video Conferencing

This guide provides comprehensive instructions for testing CommHub Pro to ensure it works globally and supports multiple users.

---

## ⚙️ Server Status

### Current Configuration
- **Signaling Server**: `wss://commhub-signaling-production.up.railway.app`
- **WebRTC ICE Servers**: Google STUN servers (`stun:stun.l.google.com:19302`)
- **Status**: Permanently deployed on Railway
- **Global Access**: Yes, accessible from anywhere with internet connection

### How the Server Works
1. **Signaling Server**: Handles WebRTC signaling (offers, answers, ICE candidates)
2. **STUN Server**: Helps peers discover their public IP addresses
3. **Peer-to-Peer**: Video/audio streams directly between users (not through server)

---

## 📋 Pre-Testing Checklist

Before starting tests, ensure:
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Stable internet connection
- [ ] Camera and microphone permissions granted
- [ ] HTTPS connection (required for WebRTC)
- [ ] JavaScript enabled in browser
- [ ] No firewall blocking WebRTC connections

---

## 🌐 Testing Server Availability Globally

### Test 1: Check Server Connection
**Objective**: Verify the signaling server is accessible

**Steps**:
1. Open the application (index.html)
2. Navigate to **Media → CommHub Pro**
3. Open browser developer console (F12)
4. Look for connection message: `✅ CommHub Pro connected to signaling server`
5. Check for notification: "Connected to CommHub Pro server"

**Expected Result**: 
- Console shows successful connection
- Green "Server: Active" indicator in sidebar
- No connection errors

**Troubleshooting**:
- If connection fails, check internet connection
- Verify URL is accessible: Try pinging `commhub-signaling-production.up.railway.app`
- Check browser console for specific error messages

---

### Test 2: Global Accessibility
**Objective**: Verify server works from different locations

**Steps**:
1. Test from your primary location (home/office)
2. Test from mobile data connection
3. If possible, test from different geographic location
4. Try different networks (home WiFi, mobile hotspot, public WiFi)

**Expected Result**: 
- Server connects successfully from all locations
- No geographic restrictions
- Connection time < 5 seconds

---

## 👥 Testing Two-User Connection

### Test 3: Two Users in Same Room
**Objective**: Verify basic multi-user functionality

**Setup**:
- **Device 1**: Computer/laptop
- **Device 2**: Phone or another computer
- **Both**: Connected to internet

**Steps**:
1. **User 1**:
   - Open application on Device 1
   - Navigate to **Media → CommHub Pro**
   - Enter room name (e.g., "test-room-123")
   - Click "Join Room"
   - Allow camera/microphone permissions
   - Note: You should see your video appear

2. **User 2**:
   - Open application on Device 2 (use different browser/device)
   - Navigate to **Media → CommHub Pro**
   - Enter **same room name** ("test-room-123")
   - Click "Join Room"
   - Allow camera/microphone permissions

3. **Verification**:
   - User 1 should see User 2's video appear
   - User 2 should see User 1's video appear
   - Both users appear in Participants list
   - Console shows "user-connected" event

**Expected Result**:
- ✅ Both videos visible to each other
- ✅ Audio works bidirectionally
- ✅ No lag or freezing (< 500ms delay)
- ✅ Video quality is acceptable
- ✅ Participants list shows both users

---

### Test 4: Chat Functionality
**Objective**: Verify text chat works between users

**Steps**:
1. With both users connected (from Test 3)
2. User 1 sends a chat message: "Hello from User 1"
3. User 2 should receive the message immediately
4. User 2 sends a reply: "Hi from User 2"
5. User 1 should receive the reply

**Expected Result**:
- ✅ Messages appear instantly (< 1 second delay)
- ✅ Messages show correct sender name
- ✅ Chat history persists during session
- ✅ No messages lost

---

### Test 5: Video/Audio Controls
**Objective**: Test mute, video toggle, and other controls

**Steps**:
1. User 1 clicks **Mute** button
   - Check if User 2 can no longer hear User 1
2. User 1 clicks **Video Off** button
   - Check if User 2's view shows User 1's video is off
3. User 2 clicks **Screen Share** button
   - Check if User 1 sees User 2's screen
4. User 1 clicks **Raise Hand** button
   - Check if User 2 sees notification
5. User 2 clicks **Reaction** button
   - Check if User 1 sees emoji animation

**Expected Result**:
- ✅ All controls work as expected
- ✅ State changes reflected to other user
- ✅ No crashes or errors
- ✅ Animations work smoothly

---

### Test 6: Three or More Users
**Objective**: Verify scalability with multiple participants

**Setup**:
- **Device 1**: User 1
- **Device 2**: User 2
- **Device 3**: User 3 (optional: additional devices)

**Steps**:
1. All users join the same room name
2. Verify all videos appear in grid layout
3. Test chat with all users
4. Test leaving and rejoining

**Expected Result**:
- ✅ All user videos visible
- ✅ Grid layout adjusts automatically
- ✅ Performance remains acceptable
- ✅ When user leaves, their video disappears
- ✅ When user rejoins, they reconnect successfully

**Performance Notes**:
- 2-3 users: Excellent performance
- 4-6 users: Good performance
- 7+ users: May vary by device/connection

---

### Test 7: Mobile Device Testing
**Objective**: Verify mobile responsiveness and functionality

**Steps**:
1. Open application on mobile device (phone or tablet)
2. Navigate to **Media → CommHub Pro**
3. Join a room
4. Test all features:
   - Video display
   - Audio
   - Chat
   - Controls (mute, video, etc.)
5. Test rotation (portrait ↔ landscape)

**Expected Result**:
- ✅ UI adapts to mobile screen size
- ✅ Touch controls work properly
- ✅ Video quality acceptable on mobile data
- ✅ Layout switches properly with rotation
- ✅ No UI elements overlap or hidden

---

### Test 8: Network Quality Testing
**Objective**: Test performance under different network conditions

**Scenarios to Test**:
1. **Good Connection** (WiFi, 50+ Mbps):
   - Expected: HD video, no lag, instant messages

2. **Moderate Connection** (4G, 10-20 Mbps):
   - Expected: Good video quality, slight buffering acceptable

3. **Poor Connection** (3G, < 5 Mbps):
   - Expected: Lower video quality, possible lag, but should remain connected

4. **Switching Networks**:
   - User switches from WiFi to mobile data
   - Expected: Connection maintains or reconnects automatically

**Test Steps**:
1. Start call on good connection
2. Switch to mobile hotspot (if available)
3. Monitor video quality and connection stability
4. Try moving around (if on mobile)

---

### Test 9: Extended Session Testing
**Objective**: Verify stability over longer periods

**Steps**:
1. Start a call with 2 users
2. Keep call active for 15-30 minutes
3. Periodically test features:
   - Send chat messages every 5 minutes
   - Toggle video/audio
   - Share screen briefly
4. Monitor for:
   - Connection drops
   - Memory leaks (browser slowdown)
   - Audio/video quality degradation

**Expected Result**:
- ✅ Connection remains stable
- ✅ No unexpected disconnects
- ✅ Performance stays consistent
- ✅ No browser crashes

---

### Test 10: Cross-Platform Testing
**Objective**: Verify compatibility across devices and browsers

**Test Matrix**:
| Device | Browser | Expected Result |
|--------|---------|----------------|
| Windows PC | Chrome | ✅ Full support |
| Windows PC | Firefox | ✅ Full support |
| Windows PC | Edge | ✅ Full support |
| Mac | Safari | ✅ Full support |
| Mac | Chrome | ✅ Full support |
| Android | Chrome | ✅ Full support |
| iPhone | Safari | ✅ Full support |
| iPad | Safari | ✅ Full support |

**Steps**:
1. Test on each combination
2. Document any issues or limitations
3. Verify all features work

---

## 🐛 Common Issues and Solutions

### Issue 1: Cannot Connect to Server
**Symptoms**: "Unable to connect to video server" error

**Solutions**:
1. Check internet connection
2. Verify firewall not blocking WebSocket connections (port 443)
3. Try different network
4. Check if Railway server is up: https://status.railway.app/
5. Clear browser cache and reload

---

### Issue 2: Camera/Microphone Not Working
**Symptoms**: No video/audio stream

**Solutions**:
1. Grant browser permissions (check URL bar)
2. Check device settings (camera/mic not in use by other app)
3. Try different browser
4. Restart browser/device
5. Check if HTTPS is enabled (required for WebRTC)

---

### Issue 3: Cannot See Other User's Video
**Symptoms**: Other participant's video not displaying

**Solutions**:
1. Check both users are in the same room
2. Verify both users granted camera permissions
3. Check browser console for WebRTC errors
4. Try refreshing the page and rejoining
5. Verify firewall not blocking peer-to-peer connections

---

### Issue 4: Poor Video Quality
**Symptoms**: Blurry video, lag, freezing

**Solutions**:
1. Check internet speed (need at least 1-2 Mbps per stream)
2. Close other bandwidth-heavy applications
3. Reduce number of participants
4. Switch to better network connection
5. Lower video resolution (browser may do this automatically)

---

### Issue 5: Echo or Audio Feedback
**Symptoms**: Hearing own voice echoed back

**Solutions**:
1. Use headphones
2. Lower speaker volume
3. Ensure only one device has audio on if testing alone
4. Check microphone sensitivity settings
5. Mute when not speaking

---

## 📊 Testing Report Template

After completing tests, document results:

```
CommHub Pro Testing Report
Date: [Date]
Tester: [Name]

1. Server Connection: [ ] Pass [ ] Fail
   Notes: _______________

2. Two-User Connection: [ ] Pass [ ] Fail
   Notes: _______________

3. Chat Functionality: [ ] Pass [ ] Fail
   Notes: _______________

4. Video/Audio Controls: [ ] Pass [ ] Fail
   Notes: _______________

5. Multiple Users (3+): [ ] Pass [ ] Fail
   Notes: _______________

6. Mobile Testing: [ ] Pass [ ] Fail
   Notes: _______________

7. Network Quality: [ ] Pass [ ] Fail
   Notes: _______________

8. Extended Session: [ ] Pass [ ] Fail
   Notes: _______________

9. Cross-Platform: [ ] Pass [ ] Fail
   Notes: _______________

Overall Status: [ ] All Tests Passed [ ] Some Issues [ ] Major Issues
Recommendations: _______________
```

---

## 🔧 Advanced Testing

### Developer Testing

**View WebRTC Statistics**:
1. Open browser console (F12)
2. Type: `Object.values(commhubPeers).forEach(pc => console.log(pc.getStats()))`
3. Review connection statistics

**Monitor Events**:
```javascript
// Enable verbose logging
commhubSocket.onAny((event, ...args) => {
    console.log('Socket event:', event, args);
});
```

**Check Connection State**:
```javascript
// Check peer connection states
Object.entries(commhubPeers).forEach(([userId, pc]) => {
    console.log(`User ${userId}: ${pc.connectionState}`);
});
```

---

## ✅ Success Criteria

CommHub Pro is working correctly if:
- ✅ Server connects from any location with internet
- ✅ Two users can see and hear each other
- ✅ Chat messages deliver instantly
- ✅ All controls (mute, video, screen share) work
- ✅ Mobile devices work with responsive UI
- ✅ Multiple users (3+) can join successfully
- ✅ Connection remains stable for 15+ minutes
- ✅ Works across different browsers/devices
- ✅ Performance is acceptable on moderate connections

---

## 🎯 Next Steps

After successful testing:
1. Document any issues found
2. Test with actual school users (teachers, students, parents)
3. Gather feedback on user experience
4. Monitor server performance and costs
5. Consider adding features:
   - Recording
   - Breakout rooms
   - Virtual backgrounds
   - Waiting room
   - Meeting passwords

---

## 📞 Support

If tests fail or you need help:
1. Check browser console for errors
2. Review this guide's troubleshooting section
3. Verify server status: https://status.railway.app/
4. Test with different devices/networks
5. Document specific error messages for debugging

---

## 📝 Notes

- **Privacy**: All video/audio streams are peer-to-peer (not stored on server)
- **Security**: Use HTTPS for all connections
- **Bandwidth**: Each video stream uses ~1-2 Mbps
- **Scaling**: For 10+ users, consider using a TURN server
- **Cost**: Current setup is free tier on Railway (check usage limits)

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Ready for Testing ✅
