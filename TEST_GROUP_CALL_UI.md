# Group Call UI Feature - Test Plan

## Overview
This document outlines how to test the newly implemented group call button and incoming call modal features.

## Features Implemented

### 1. Start Group Call Button
- **Location:** Teacher Chat screen (Teachers > Teacher Chat > Message Students tab)
- **Visibility:** Only visible to Teachers, Admins, and HODs
- **Functionality:** Initiates a group call using Firebase group call functions

### 2. Incoming Call Modal
- **Trigger:** Automatically shows when a new call is created where current user is in participants list
- **Features:**
  - Shows caller name
  - Shows call title
  - Accept/Decline buttons
  - Backdrop blur effect
  - Sound notification
- **Compatibility:** Works with both Firebase group calls and CommHub Pro calls

### 3. Firebase Call Listener
- **Real-time monitoring:** Listens to Firebase 'calls' collection for new pending calls
- **Filtering:** Only shows calls where current user is a participant
- **Smart notifications:** Doesn't show notification if current user is the host

## Testing Instructions

### Prerequisites
1. Open `index.html` in a web browser
2. Have Firebase authentication configured
3. Have at least two user accounts (one teacher/admin, one other user)

### Test Case 1: Button Visibility by Role

**Steps:**
1. Log in as a Teacher or Admin
2. Navigate to "Teachers" section
3. Click on "Teacher Chat" tab
4. Look at the chat header (right side)

**Expected Result:**
- ✓ "Start Group Call" button should be visible next to the chat header
- ✓ Button has green success styling
- ✓ Button shows video icon and text "Start Group Call"

**Steps:**
5. Log out
6. Log in as a Student or Parent
7. Navigate to the same location

**Expected Result:**
- ✓ "Start Group Call" button should NOT be visible

### Test Case 2: Initiating a Group Call

**Steps:**
1. Log in as a Teacher
2. Navigate to Teacher Chat
3. Click "Start Group Call" button
4. Enter a title when prompted (e.g., "Math Class Meeting")

**Expected Result:**
- ✓ Call is created in Firebase 'calls' collection
- ✓ Success notification appears
- ✓ Console logs show "Group call created: [callId]"
- ✓ Call status is 'pending'

### Test Case 3: Receiving Incoming Call Notification

**Prerequisites:**
- Have two browsers/tabs open with different users logged in
- User A: Teacher
- User B: Another teacher or student (must be in participants list)

**Steps:**
1. In Browser A (Teacher): Click "Start Group Call"
2. Add User B to participants (in a real implementation)
3. In Browser B: Observe the screen

**Expected Result:**
- ✓ Incoming call modal appears automatically in Browser B
- ✓ Modal shows correct caller name
- ✓ Modal shows correct call title
- ✓ Backdrop blur effect is visible
- ✓ Notification sound plays (if not blocked by browser)
- ✓ Toast notification appears at top-right

### Test Case 4: Accepting a Call

**Steps:**
1. When incoming call modal appears
2. Click "Accept" button

**Expected Result:**
- ✓ Modal closes
- ✓ User joins the call (Firebase updateDoc called)
- ✓ Success notification: "Joined group call successfully"
- ✓ User is added to activeParticipants array in Firebase
- ✓ Navigation to media section (optional feature)

### Test Case 5: Declining a Call

**Steps:**
1. When incoming call modal appears
2. Click "Decline" button

**Expected Result:**
- ✓ Modal closes
- ✓ Info notification: "Call declined"
- ✓ No changes to Firebase call document

### Test Case 6: Auto-initialization on Login

**Steps:**
1. Log in as any user
2. Open browser console
3. Look for initialization messages

**Expected Result:**
- ✓ Console shows: "✅ Firebase Group Call Functions loaded successfully!"
- ✓ Console shows: "✅ Group Call UI Integration loaded successfully!"
- ✓ Console shows: "✅ Call listener initialized for user: [username]"
- ✓ No errors in console

### Test Case 7: Role-Based Button Update

**Steps:**
1. Log in as a Teacher
2. Verify button is visible
3. Change user role in memory (developer tools): `currentUser.role = 'Student'`
4. Call `updateGroupCallButtonVisibility()`

**Expected Result:**
- ✓ Button becomes hidden

### Test Case 8: Multiple Calls

**Steps:**
1. Create a call from User A to User B
2. Before accepting/declining, create another call from User C to User B
3. Observe behavior in User B's browser

**Expected Result:**
- ✓ Second call modal replaces first call modal
- ✓ Only the most recent call data is shown
- ✓ No errors in console

### Test Case 9: CommHub Pro Backward Compatibility

**Steps:**
1. Navigate to Media > CommHub Pro tab
2. Join a CommHub Pro room
3. Have another user send an incoming call via CommHub Pro

**Expected Result:**
- ✓ Incoming call modal appears correctly
- ✓ Modal shows "CommHub Pro Call" as title
- ✓ Accept button joins the CommHub Pro room
- ✓ Decline button closes modal
- ✓ No conflicts between Firebase and CommHub Pro calls

### Test Case 10: Error Handling

**Steps:**
1. Click "Start Group Call" without being logged in
2. Try to accept a call when Firebase is offline
3. Try to join a call with invalid data

**Expected Result:**
- ✓ Appropriate error messages displayed
- ✓ No console errors or crashes
- ✓ User is informed of the issue

## Firebase Data Structure Verification

### Calls Collection Document
```javascript
{
  type: 'video',
  status: 'pending', // or 'active', 'ended'
  title: 'Group Meeting',
  hostId: 'teacher1',
  linkedChatId: null,
  participants: ['teacher1', 'student1', 'student2'],
  activeParticipants: ['teacher1'],
  createdAt: Timestamp,
  startedAt: null,
  endedAt: null
}
```

### Call Members Subcollection
```javascript
{
  joinedAt: Timestamp,
  leftAt: null,
  displayName: 'John Doe',
  photoURL: 'https://...',
  isMuted: false,
  isVideoOn: true,
  isHost: true,
  role: 'teacher'
}
```

## Browser Console Commands for Testing

```javascript
// Check if functions are available
console.log('startGroupCall:', typeof window.startGroupCall);
console.log('joinCall:', typeof window.joinCall);
console.log('leaveCall:', typeof window.leaveCall);
console.log('updateGroupCallButtonVisibility:', typeof window.updateGroupCallButtonVisibility);
console.log('initializeCallListener:', typeof window.initializeCallListener);

// Manually trigger button visibility update
window.updateGroupCallButtonVisibility();

// Manually show incoming call modal (for testing)
window.acceptIncomingGroupCall();
window.declineIncomingGroupCall();

// Check current user
console.log('Current User:', window.currentUser);

// Check Firebase connection
console.log('Firebase DB:', window.db);
```

## Known Limitations

1. **Participant Selection:** Current implementation uses a simple approach for participant selection. In production, you'd want to:
   - Get actual chat participants from the current conversation
   - Add a UI to select specific participants
   - Integrate with contact lists

2. **Call UI Integration:** The accept button navigates to CommHub Pro, but a dedicated Firebase-based video chat UI would provide better integration.

3. **Notification Permissions:** Browser notification API is not yet integrated. System notifications would enhance the user experience.

4. **Call History:** No persistent call history or call logs yet implemented.

5. **Group Management:** No ability to add/remove participants during an ongoing call.

## Success Criteria

✓ Start Group Call button is visible only to teachers/admins
✓ Incoming call modal appears when a new call is created
✓ Modal shows correct caller information
✓ Accept button joins the call via Firebase
✓ Decline button dismisses the modal
✓ Real-time listener works correctly
✓ No console errors during normal operation
✓ Backward compatibility with CommHub Pro maintained

## Troubleshooting

### Button Not Visible
- Check user role: `console.log(currentUser.role)`
- Verify user is logged in: `console.log(currentUser)`
- Call manually: `window.updateGroupCallButtonVisibility()`

### Modal Not Appearing
- Check console for errors
- Verify Firebase listener is initialized: Check for "Call listener initialized" message
- Check Firebase connection: `console.log(window.db)`
- Verify call document exists in Firebase with current user in participants

### Firebase Errors
- Check Firebase configuration in firebase-config.js
- Verify Firestore rules allow read/write to 'calls' collection
- Check network tab for failed requests

## Next Steps for Enhancement

1. **Add Participant Selection UI**
   - Multi-select dropdown for choosing participants
   - Integration with chat group members
   - Search functionality

2. **Enhance Video Chat Integration**
   - Dedicated Firebase-based video chat UI
   - Better integration between call creation and video interface
   - Screen sharing support

3. **Add Call History**
   - Log all calls in Firebase
   - Display call history in UI
   - Allow users to rejoin recent calls

4. **Improve Notifications**
   - Browser push notifications
   - Sound customization
   - Call rejection reasons

5. **Add Call Management**
   - Ability to invite more participants during call
   - Remove participants (admin only)
   - Transfer host role

## Conclusion

The implementation successfully adds a "Start Group Call" button visible to teachers/admins and an incoming call modal that listens for new calls in Firebase. The feature integrates seamlessly with existing Firebase group call functions and maintains backward compatibility with CommHub Pro.
