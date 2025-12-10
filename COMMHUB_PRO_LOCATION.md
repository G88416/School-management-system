# CommHub Pro - Location Guide

## 📍 Where is CommHub Pro Located?

### In the Application UI:
CommHub Pro can be accessed through the following navigation path:

1. **Sidebar Navigation** → Click on "Media" module
2. **Media Tabs** → Click on "CommHub Pro" tab (after Video Creator)

### Visual Path:
```
Main App → Media Center → CommHub Pro Tab
```

---

## 📄 Location in index.html File:

### HTML Section:
- **File**: `index.html`
- **Line Range**: Lines **~5893-6000**
- **Element ID**: `media-commhub-pro` (tab pane)
- **Container ID**: `commhub-container`

### JavaScript Functions:
- **File**: `index.html` (embedded JavaScript)
- **Line Range**: Lines **~30195-30660**
- **Functions Include**:
  - `initCommHubSocket()` - Initialize connection
  - `joinCommHubRoom()` - Join a video room
  - `leaveCommHubRoom()` - Leave the room
  - `toggleCommHubMute()` - Toggle microphone
  - `toggleCommHubVideo()` - Toggle camera
  - `toggleCommHubScreen()` - Share screen
  - And more...

---

## 🎯 Key Components:

### 1. Video Grid
- **ID**: `commhubVideoGrid`
- **Purpose**: Displays video streams from all participants

### 2. Sidebar
- **ID**: `commhub-sidebar`
- **Contains**: Room controls, participant list, and chat

### 3. Participants List
- **ID**: `commhubParticipants`
- **Shows**: All users currently in the room

### 4. Chat Messages
- **ID**: `commhubChatMessages`
- **Purpose**: Real-time text chat during video calls

### 5. Control Buttons
- Mute/Unmute: `commhubMuteBtn`
- Video On/Off: `commhubVideoBtn`
- Screen Share: `commhubScreenBtn`
- Raise Hand: `commhubHandBtn`
- Reactions: `commhubReactBtn`
- Leave Room: `commhubLeaveBtn`

---

## 🚀 Features:

- ✅ Group video conferencing (WebRTC)
- ✅ Real-time text chat
- ✅ Screen sharing
- ✅ Raise hand functionality
- ✅ Emoji reactions
- ✅ Participant management
- ✅ Room-based meetings

---

## 🔧 Technical Details:

### Technology Stack:
- **WebRTC** for video/audio streaming
- **Socket.IO** for signaling
- **ICE Servers**: Google STUN servers

### Signaling Server:
- **Permanent Server**: `wss://commhub-signaling-production.up.railway.app`
- **Status**: Deployed and active
- **Note**: Server is permanently deployed - no setup required!

### Configuration:
```javascript
const SIGNALING_SERVER = "wss://commhub-signaling-production.up.railway.app";
const COMMHUB_ICE_CONFIG = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
```

---

## 📝 How to Use:

1. Navigate to: **Media → CommHub Pro**
2. Enter a room name in the input field
3. Click "Join Room" button
4. Allow camera and microphone permissions
5. Start your video conference!

---

## 🛠️ Setup Requirements:

1. **Signaling Server**: 
   - ✅ **Already deployed and active!**
   - No setup required - server is permanently hosted on Railway
   - Automatic connection when you use CommHub Pro

2. **Browser Requirements**:
   - Modern browser with WebRTC support
   - HTTPS connection (required for camera/mic access)
   - Camera and microphone permissions

---

## 🔍 Quick Search Tips:

To quickly find CommHub Pro in the code:
- Search for: `"CommHub Pro"`
- Search for: `"group-video-chat"`
- Search for: `"commhub-container"`
- Search for: `"initCommHubSocket"`

---

## 📞 Access Roles:

CommHub Pro is accessible to:
- ✅ All users (through Media module)
- ✅ Teachers
- ✅ Admin
- ✅ HOD
- ✅ Parents (non-student role)

---

## 📊 Code Structure:

```
index.html
│
├── HTML Structure (Lines ~5893-6000)
│   ├── Tab Navigation (Media Module)
│   ├── CommHub Container
│   ├── Sidebar (Room Join, Participants)
│   ├── Video Grid
│   └── Control Buttons
│
└── JavaScript (Lines ~30195-30660)
    ├── Socket Connection
    ├── Room Management
    ├── WebRTC Peer Connections
    ├── Video/Audio Controls
    └── Chat Functions
```

---

## 💡 Need Help?

If you can't find CommHub Pro:
1. Make sure you're logged in (any role except students)
2. Navigate to the Media section in the sidebar
3. Look for the "CommHub Pro" tab (after Video Creator)
4. Click to start video conferencing!

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Powered by**: WebRTC + Socket.IO
