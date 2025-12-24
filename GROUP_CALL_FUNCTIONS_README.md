# Firebase Group Call Functions - Documentation

## Overview
This implementation adds Firebase Firestore-based group call functionality to the School Management System. It uses Firestore for WebRTC signaling, enabling real-time video/audio conferencing between teachers, parents, and students.

## Files Created

### 1. `firebase-config.js`
Standalone Firebase configuration file that exports the Firestore database instance.

**Usage:**
```javascript
import { db } from './firebase-config.js';
```

### 2. `group-call-functions.js`
Standalone module containing all group call functions.

**Functions:**
- `startGroupCall()` - Start a new group call
- `joinCall()` - Join an existing call
- `leaveCall()` - Leave or end a call
- `listenToCallMembers()` - Real-time listener for participants
- `listenToSignals()` - Listen for WebRTC signaling messages
- `sendSignal()` - Send WebRTC signals (offer/answer/ICE)

### 3. `index.html` (Modified)
Added Firebase Group Call Functions script section that:
- Imports all required Firestore functions
- Implements all group call functions inline
- Exports functions to `window` object for global access

## Function Documentation

### startGroupCall()
Starts a new group video or audio call.

**Parameters:**
```javascript
{
  title: string,              // Call title (e.g., "Parent-Teacher Meeting")
  type: 'video' | 'audio',    // Call type
  participantIds: string[],   // Array of user IDs
  hostId: string,             // Host user ID
  hostName: string,           // Host display name
  hostPhoto: string,          // Host photo URL (optional)
  linkedChatId: string        // Related chat ID (optional)
}
```

**Returns:** `Promise<string>` - Call ID

**Example:**
```javascript
const callId = await startGroupCall({
  title: 'Grade 10 Math - Parent Meeting',
  type: 'video',
  participantIds: ['teacher1', 'parent1', 'parent2'],
  hostId: 'teacher1',
  hostName: 'Mr. Smith',
  hostPhoto: 'https://example.com/photo.jpg'
});
```

### joinCall()
Join an existing call.

**Parameters:**
- `callId` (string) - Call ID to join
- `userId` (string) - User ID joining
- `displayName` (string) - User's display name
- `photoURL` (string) - User's photo URL
- `role` (string) - User role (teacher/parent/student)

**Returns:** `Promise<string>` - Call ID

**Example:**
```javascript
await joinCall(
  'call-id-123',
  'parent1',
  'Mrs. Johnson',
  'https://example.com/photo.jpg',
  'parent'
);
```

### leaveCall()
Leave a call or end it if you're the host.

**Parameters:**
- `callId` (string) - Call ID
- `userId` (string) - User ID leaving

**Returns:** `Promise<void>`

**Example:**
```javascript
await leaveCall('call-id-123', 'parent1');
```

### listenToCallMembers()
Listen to real-time updates of call participants.

**Parameters:**
- `callId` (string) - Call ID
- `callback` (function) - Callback function receiving members array

**Returns:** `Unsubscribe function`

**Example:**
```javascript
const unsubscribe = listenToCallMembers('call-id-123', (members) => {
  console.log('Active members:', members);
  // Update UI with member list
});

// Later: unsubscribe();
```

### listenToSignals()
Listen for WebRTC signaling messages.

**Parameters:**
- `callId` (string) - Call ID
- `userId` (string) - Current user ID
- `onSignal` (function) - Callback for new signals

**Returns:** `Unsubscribe function`

**Example:**
```javascript
const unsubscribe = listenToSignals('call-id-123', 'user1', (signal) => {
  if (signal.type === 'offer') {
    // Handle WebRTC offer
  } else if (signal.type === 'answer') {
    // Handle WebRTC answer
  } else if (signal.type === 'ice') {
    // Handle ICE candidate
  }
});
```

### sendSignal()
Send a WebRTC signaling message.

**Parameters:**
- `callId` (string) - Call ID
- `senderId` (string) - Sender user ID
- `recipientId` (string) - Recipient user ID (or 'all')
- `type` (string) - Signal type ('offer'/'answer'/'ice')
- `data` (object) - Signal data

**Returns:** `Promise<void>`

**Example:**
```javascript
await sendSignal(
  'call-id-123',
  'user1',
  'user2',
  'offer',
  { sdp: '...', type: 'offer' }
);
```

## Firestore Data Structure

### Collections

#### `calls` Collection
```javascript
{
  callId: {
    type: 'video' | 'audio',
    status: 'pending' | 'active' | 'ended',
    title: 'Meeting Title',
    hostId: 'user-id',
    linkedChatId: 'chat-id',
    participants: ['user1', 'user2', ...],
    activeParticipants: ['user1', ...],
    createdAt: Timestamp,
    startedAt: Timestamp,
    endedAt: Timestamp
  }
}
```

#### `calls/{callId}/members` Subcollection
```javascript
{
  userId: {
    joinedAt: Timestamp,
    leftAt: Timestamp | null,
    displayName: 'User Name',
    photoURL: 'https://...',
    isMuted: boolean,
    isVideoOn: boolean,
    isHost: boolean,
    role: 'teacher' | 'parent' | 'student'
  }
}
```

#### `calls/{callId}/signals` Subcollection
```javascript
{
  signalId: {
    senderId: 'user-id',
    recipientId: 'user-id' | 'all',
    type: 'offer' | 'answer' | 'ice',
    data: { ... },
    timestamp: Timestamp
  }
}
```

## Usage in index.html

All functions are available globally via the `window` object:

```javascript
// Start a call
const callId = await window.startGroupCall({
  title: 'Test Meeting',
  type: 'video',
  participantIds: ['user1', 'user2'],
  hostId: 'user1',
  hostName: 'Host Name',
  hostPhoto: 'url'
});

// Join the call
await window.joinCall(callId, 'user2', 'User 2', 'photo-url', 'parent');

// Listen to members
const unsubscribe = window.listenToCallMembers(callId, (members) => {
  console.log('Members:', members);
});

// Leave the call
await window.leaveCall(callId, 'user2');
```

## Testing

Open `test-group-call-functions.html` in a browser to test the implementation:

1. Check if functions are loaded
2. Test starting a group call
3. Verify Firebase connection

## Security Notes

⚠️ **Important:** 
- Implement proper Firestore security rules to restrict access
- Validate user permissions before allowing call operations
- Use Firebase Authentication to identify users
- Consider rate limiting to prevent abuse

Example Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /calls/{callId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.participants;
    }
    
    match /calls/{callId}/members/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.uid == userId;
    }
    
    match /calls/{callId}/signals/{signalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## Integration with Existing Features

This implementation integrates with:
- **CommHub Pro** - Existing WebRTC video conferencing
- **Firebase Chat** - Can link calls to chat rooms
- **User Management** - Uses existing user data

## Browser Compatibility

Requires browsers with support for:
- WebRTC (getUserMedia, RTCPeerConnection)
- Firebase SDK v12.6.0+
- ES6 Modules
- Firestore real-time listeners

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Functions not available
- Ensure Firebase SDK is loaded before the group call functions
- Check browser console for import errors
- Verify `window.db` is available

### Firestore permission denied
- Check Firestore security rules
- Ensure user is authenticated
- Verify user ID is in participants array

### WebRTC connection issues
- Check ICE server configuration
- Verify firewall settings
- Ensure HTTPS (WebRTC requires secure context)

## Future Enhancements

- [ ] Add screen sharing support
- [ ] Implement call recording
- [ ] Add call history and analytics
- [ ] Implement call notifications
- [ ] Add bandwidth management
- [ ] Support for call scheduling
- [ ] Add breakout rooms

## License

Part of the School Management System project.
