# Firebase Chat Support - Usage Guide

## Overview

Firebase Firestore chat support has been added to `index.html` to enable real-time messaging between users (Teacher ↔ Parent, group chats, etc.).

## Features

1. **Private Chats**: Create 1:1 conversations between two users (e.g., Teacher and Parent)
2. **Group Chats**: Create group conversations with multiple participants (e.g., class groups)
3. **Chat List**: Retrieve all chats for a specific user

## Implementation Details

### Firebase SDK Version
- Firebase v12.6.0 (Modular SDK)
- Using Firestore for real-time chat data storage

### Database Structure

#### Chats Collection (`chats`)

**Private Chat Document:**
```javascript
{
  type: 'private',
  name: '', // empty for private chats
  participants: ['userId1', 'userId2'], // sorted array
  participantRoles: {
    userId1: 'teacher',
    userId2: 'parent'
  },
  createdAt: Timestamp,
  createdBy: 'userId1',
  lastMessage: {
    text: '',
    senderId: '',
    timestamp: null
  },
  unreadCounts: {
    userId1: 0,
    userId2: 0
  }
}
```

**Group Chat Document:**
```javascript
{
  type: 'group',
  name: 'Grade 10 Math - Parents Group',
  participants: ['userId1', 'userId2', 'userId3'],
  participantRoles: {
    userId1: 'teacher',
    userId2: 'member',
    userId3: 'member'
  },
  createdAt: Timestamp,
  createdBy: 'userId1',
  lastMessage: {
    text: 'Group created',
    senderId: 'userId1',
    timestamp: Timestamp
  },
  unreadCounts: {
    userId1: 0,
    userId2: 0,
    userId3: 0
  },
  photoURL: '', // optional
  isAnnouncement: false // for broadcast-style groups
}
```

## Functions

### 1. createOrGetPrivateChat

Creates a new private chat or returns existing one between two users.

**Usage:**
```javascript
// Example: Teacher initiating chat with a parent
const result = await createOrGetPrivateChat(
  'teacher_123',      // User ID 1 (current user)
  'parent_456',       // User ID 2 (other user)
  { role: 'teacher' }, // User 1 data
  { role: 'parent' }   // User 2 data
);

console.log(result);
// Output: { chatId: 'parent_456_teacher_123', alreadyExisted: false }
```

**Parameters:**
- `userId1` (string): First user ID
- `userId2` (string): Second user ID
- `userData1` (object): Optional user data for first user (e.g., `{ role: 'teacher' }`)
- `userData2` (object): Optional user data for second user (e.g., `{ role: 'parent' }`)

**Returns:**
- `chatId` (string): The chat document ID
- `alreadyExisted` (boolean): Whether the chat already existed

**Notes:**
- IDs are automatically sorted to prevent duplicate chats (A-B and B-A become the same chat)
- Chat ID format: `userId1_userId2` (sorted)

### 2. createGroupChat

Creates a new group chat with multiple participants.

**Usage:**
```javascript
// Example: Teacher creating a class parent group
const chatId = await createGroupChat({
  groupName: 'Grade 10 Math - Parents Group',
  participantIds: ['teacher_123', 'parent_456', 'parent_789'],
  creatorId: 'teacher_123',
  creatorRole: 'teacher',
  extraData: {
    photoURL: 'https://example.com/group-photo.jpg',
    isAnnouncement: false
  }
});

console.log('Group chat created:', chatId);
```

**Parameters:**
- `groupName` (string): Name of the group
- `participantIds` (array): Array of user IDs to include
- `creatorId` (string): User ID of the creator
- `creatorRole` (string): Role of the creator (e.g., 'teacher', 'admin')
- `extraData` (object): Optional additional data
  - `photoURL` (string): Group photo URL
  - `isAnnouncement` (boolean): Whether it's an announcement-only group

**Returns:**
- `chatId` (string): The auto-generated chat document ID

### 3. getUserChats

Retrieves all chats for a specific user.

**Usage:**
```javascript
// Example: Get all chats for a teacher
const chats = await getUserChats('teacher_123');

console.log('User chats:', chats);
// Returns array of chat objects sorted by last message time
```

**Parameters:**
- `currentUserId` (string): The user ID to get chats for

**Returns:**
- Array of chat objects, each containing:
  - `chatId`: Chat document ID
  - `type`: 'private' or 'group'
  - `name`: Group name (empty for private chats)
  - `participants`: Array of user IDs
  - `participantRoles`: Object mapping user IDs to roles
  - `lastMessage`: Object with last message details
  - `lastMessageTime`: Date object of last message
  - Other chat metadata

## Usage Examples

### Example 1: Teacher Starting Chat with Parent

```javascript
// Get current user info
const currentUser = { id: 'teacher_123', role: 'teacher' };
const parentId = 'parent_456';

// Create or get existing chat
const { chatId, alreadyExisted } = await createOrGetPrivateChat(
  currentUser.id,
  parentId,
  { role: currentUser.role },
  { role: 'parent' }
);

if (alreadyExisted) {
  console.log('Chat already exists, opening:', chatId);
} else {
  console.log('New chat created:', chatId);
}

// Navigate to chat screen with chatId...
```

### Example 2: Creating a Class Group

```javascript
// Teacher creates a group for Grade 10 Math parents
const teacherId = 'teacher_123';
const parentIds = ['parent_456', 'parent_789', 'parent_012'];

const chatId = await createGroupChat({
  groupName: 'Grade 10 Math - Parents Group',
  participantIds: [teacherId, ...parentIds],
  creatorId: teacherId,
  creatorRole: 'teacher',
  extraData: {
    photoURL: '',
    isAnnouncement: false
  }
});

console.log('Class group created:', chatId);
```

### Example 3: Loading User's Chat List

```javascript
// Load all chats for the current user
const currentUserId = 'teacher_123';
const chats = await getUserChats(currentUserId);

// Display chats in UI
chats.forEach(chat => {
  console.log(`Chat: ${chat.name || 'Private Chat'}`);
  console.log(`Last message: ${chat.lastMessage.text}`);
  console.log(`Unread: ${chat.unreadCounts[currentUserId]}`);
});
```

## Testing

A test page has been provided at `firebase-chat-test.html` to verify the implementation.

### Running Tests:

1. Open `firebase-chat-test.html` in your browser
2. Open the browser console (F12) to see detailed logs
3. Click each test button:
   - "Create Private Chat" - Tests creating a 1:1 chat
   - "Create Group Chat" - Tests creating a group chat
   - "Get User Chats" - Tests retrieving user's chats

## Integration Notes

### Global Access

All functions are exported to the `window` object, making them accessible from any script:

```javascript
window.createOrGetPrivateChat
window.createGroupChat
window.getUserChats
window.db // Firestore database instance
```

### Error Handling

All functions throw errors that should be caught:

```javascript
try {
  const result = await createOrGetPrivateChat(userId1, userId2);
  // Handle success
} catch (error) {
  console.error('Chat creation failed:', error);
  // Show error to user
}
```

## Firestore Security Rules

**Important:** Configure Firestore security rules to protect chat data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      // Only participants can read the chat
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.participants;
      
      // Only participants can create/update the chat
      allow create, update: if request.auth != null && 
                              request.auth.uid in request.resource.data.participants;
      
      // Prevent deletion for now
      allow delete: if false;
    }
  }
}
```

## Next Steps

1. Implement message sending/receiving functions
2. Add real-time listeners for chat updates
3. Implement file/image sharing in chats
4. Add typing indicators
5. Implement push notifications for new messages
6. Add chat search functionality

## Support

For issues or questions:
- Check the browser console for error messages
- Verify Firebase configuration is correct
- Ensure Firestore is enabled in Firebase Console
- Check Firestore security rules allow read/write access
