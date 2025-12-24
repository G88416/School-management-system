# Firebase Chat Quick Reference

## Quick Start

All chat functions are globally available after loading `index.html`:

```javascript
// Access directly from window object
window.createOrGetPrivateChat()
window.createGroupChat()
window.getUserChats()
window.db // Firestore database instance
```

## Function Signatures

### createOrGetPrivateChat
```javascript
async function createOrGetPrivateChat(
  userId1: string,
  userId2: string,
  userData1?: { role?: string },
  userData2?: { role?: string }
): Promise<{ chatId: string, alreadyExisted: boolean }>
```

**Example:**
```javascript
const { chatId, alreadyExisted } = await createOrGetPrivateChat(
  'teacher_123', 
  'parent_456',
  { role: 'teacher' },
  { role: 'parent' }
);
```

### createGroupChat
```javascript
async function createGroupChat({
  groupName: string,
  participantIds: string[],
  creatorId: string,
  creatorRole: string,
  extraData?: {
    photoURL?: string,
    isAnnouncement?: boolean
  }
}): Promise<string>
```

**Example:**
```javascript
const chatId = await createGroupChat({
  groupName: 'Grade 10 Math - Parents',
  participantIds: ['teacher_123', 'parent_456'],
  creatorId: 'teacher_123',
  creatorRole: 'teacher'
});
```

### getUserChats
```javascript
async function getUserChats(
  currentUserId: string
): Promise<Array<{
  chatId: string,
  type: 'private' | 'group',
  name: string,
  participants: string[],
  lastMessage: object,
  lastMessageTime: Date,
  unreadCounts: object
}>>
```

**Example:**
```javascript
const chats = await getUserChats('teacher_123');
chats.forEach(chat => {
  console.log(`${chat.name || 'Private'}: ${chat.lastMessage.text}`);
});
```

## Common Use Cases

### 1. Teacher Starts Chat with Parent
```javascript
async function teacherContactsParent(teacherId, parentId) {
  const { chatId } = await createOrGetPrivateChat(
    teacherId,
    parentId,
    { role: 'teacher' },
    { role: 'parent' }
  );
  // Navigate to chat screen with chatId
  window.location.href = `/chat/${chatId}`;
}
```

### 2. Create Class Group
```javascript
async function createClassGroup(className, teacherId, parentIds) {
  const chatId = await createGroupChat({
    groupName: `${className} - Parents Group`,
    participantIds: [teacherId, ...parentIds],
    creatorId: teacherId,
    creatorRole: 'teacher',
    extraData: { isAnnouncement: false }
  });
  return chatId;
}
```

### 3. Load Chat List
```javascript
async function loadChatList(userId) {
  const chats = await getUserChats(userId);
  
  // Sort and display
  const sorted = chats
    .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
    .map(chat => ({
      id: chat.chatId,
      name: chat.name || getOtherUserName(chat, userId),
      preview: chat.lastMessage.text,
      unread: chat.unreadCounts[userId],
      time: formatTime(chat.lastMessageTime)
    }));
    
  return sorted;
}
```

## Error Handling

Always wrap in try-catch:

```javascript
try {
  const result = await createOrGetPrivateChat(user1, user2);
  // Success
} catch (error) {
  console.error('Chat error:', error);
  alert('Failed to create chat. Please try again.');
}
```

## Testing

Open `firebase-chat-test.html` in browser and use the test buttons.

## Database Structure

```
Firestore
└── chats
    └── {chatId}
        ├── type: 'private' | 'group'
        ├── participants: [userId1, userId2, ...]
        ├── participantRoles: { userId: role }
        ├── lastMessage: { text, senderId, timestamp }
        └── unreadCounts: { userId: count }
```

## Security Rules Required

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read: if request.auth.uid in resource.data.participants;
      allow write: if request.auth.uid in request.resource.data.participants;
    }
  }
}
```

## Tips

1. **Private Chat IDs are sorted** - `user1_user2` equals `user2_user1`
2. **Group Chats use auto-IDs** - Don't rely on specific format
3. **Check `alreadyExisted`** - Avoid duplicate chat notifications
4. **Sort chats by `lastMessageTime`** - Most recent first
5. **Use `unreadCounts`** - Show unread message badges

## Next Steps

- Implement message sending/receiving
- Add real-time listeners
- Implement typing indicators
- Add file/image sharing

## Support

See full documentation in `FIREBASE_CHAT_USAGE.md`
