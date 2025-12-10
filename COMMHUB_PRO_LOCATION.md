# CommHub Pro - Location Guide

## 📍 Where is CommHub Pro Located?

### In the Application UI:
CommHub Pro can be accessed through the following navigation path:

1. **Sidebar Navigation** → Click on "Teachers" module
2. **Teacher Tabs** → Click on "Teacher Chat" tab  
3. **Communication Tabs** → Click on "Group Video (CommHub Pro)" tab

### Visual Path:
```
Main App → Teachers Module → Teacher Chat → Group Video Tab → CommHub Pro
```

---

## 📄 Location in index.html File:

### HTML Section:
- **File**: `index.html`
- **Line Range**: Approximately lines **4253-4353**
- **Element ID**: `group-video-chat` (tab pane)
- **Container ID**: `commhub-container`

### JavaScript Functions:
- **File**: `index.html` (embedded JavaScript)
- **Line Range**: Approximately lines **30180-30646**
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
- Default: `wss://your-group-server.up.railway.app`
- Note: You need to deploy your own signaling server on Railway

### Configuration:
```javascript
const SIGNALING_SERVER = "wss://your-signaling-server.railway.app";
const COMMHUB_ICE_CONFIG = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
```

---

## 📝 How to Use:

1. Navigate to: **Teachers → Teacher Chat → Group Video**
2. Enter a room name in the input field
3. Click "Join Room" button
4. Allow camera and microphone permissions
5. Start your video conference!

---

## 🛠️ Setup Requirements:

1. **Deploy Signaling Server**: 
   - Visit [Railway](https://railway.com?referralCode=Y-GB9M)
   - Deploy the Socket.IO signaling server
   - Update the `SIGNALING_SERVER` URL in the code

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
- ✅ Teachers
- ✅ Admin (through Teachers module)
- ✅ HOD (through Teachers module)

---

## 📊 Code Structure:

```
index.html
│
├── HTML Structure (Lines ~4253-4353)
│   ├── Tab Navigation
│   ├── CommHub Container
│   ├── Sidebar (Room Join, Participants)
│   ├── Video Grid
│   └── Control Buttons
│
└── JavaScript (Lines ~30180-30646)
    ├── Socket Connection
    ├── Room Management
    ├── WebRTC Peer Connections
    ├── Video/Audio Controls
    └── Chat Functions
```

---

## 💡 Need Help?

If you can't find CommHub Pro:
1. Make sure you're logged in as a Teacher or Admin
2. Navigate to the Teachers section in the sidebar
3. Look for the "Teacher Chat" tab
4. Click on "Group Video (CommHub Pro)" tab

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Powered by**: WebRTC + Socket.IO
