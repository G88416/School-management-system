// Firebase Group Call Functions
// WebRTC signaling via Firestore for group video/audio calls

import { db } from './firebase-config.js';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  getDoc,
  arrayUnion,
  arrayRemove,
  addDoc
} from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';

/**
 * Start a new group call (e.g., teacher starts parent meeting)
 */
export async function startGroupCall({
  title,
  type = 'video', // "video" | "audio"
  participantIds, // array of UIDs (e.g., all parents in class group)
  hostId,
  hostName,
  hostPhoto,
  linkedChatId = null
}) {
  const callRef = doc(collection(db, 'calls'));
  const callId = callRef.id;

  await setDoc(callRef, {
    type,
    status: 'pending',
    title,
    hostId,
    linkedChatId,
    participants: participantIds,
    activeParticipants: [hostId],
    createdAt: serverTimestamp(),
    startedAt: null,
    endedAt: null
  });

  // Add host as first member
  await setDoc(doc(callRef, 'members', hostId), {
    joinedAt: serverTimestamp(),
    leftAt: null,
    displayName: hostName,
    photoURL: hostPhoto || '',
    isMuted: false,
    isVideoOn: type === 'video',
    isHost: true,
    role: 'teacher' // or fetch from users collection
  });

  console.log('Group call started:', callId);
  return callId;
}

/**
 * Join an ongoing or pending call
 */
export async function joinCall(callId, userId, displayName, photoURL, role) {
  const callRef = doc(db, 'calls', callId);
  const memberRef = doc(callRef, 'members', userId);

  const callSnap = await getDoc(callRef);
  if (!callSnap.exists() || !callSnap.data().participants.includes(userId)) {
    throw new Error('Not authorized to join this call');
  }

  // Update active participants
  await updateDoc(callRef, {
    activeParticipants: arrayUnion(userId),
    status: 'active',
    startedAt: serverTimestamp()
  });

  // Add member state
  await setDoc(memberRef, {
    joinedAt: serverTimestamp(),
    leftAt: null,
    displayName,
    photoURL: photoURL || '',
    isMuted: true,
    isVideoOn: false,
    isHost: userId === callSnap.data().hostId,
    role
  });

  return callId;
}

/**
 * Leave or end call
 */
export async function leaveCall(callId, userId) {
  const callRef = doc(db, 'calls', callId);
  const memberRef = doc(callRef, 'members', userId);

  await updateDoc(callRef, {
    activeParticipants: arrayRemove(userId)
  });

  await updateDoc(memberRef, { leftAt: serverTimestamp() });

  // If host leaves, end call for all
  const callSnap = await getDoc(callRef);
  if (callSnap.data().hostId === userId) {
    await updateDoc(callRef, {
      status: 'ended',
      endedAt: serverTimestamp()
    });
  }
}

/**
 * Listen to call participants in real-time (for UI)
 */
export function listenToCallMembers(callId, callback) {
  const membersCol = collection(db, 'calls', callId, 'members');
  return onSnapshot(membersCol, (snapshot) => {
    const members = [];
    snapshot.forEach(doc => {
      members.push({ userId: doc.id, ...doc.data() });
    });
    callback(members);
  });
}

/**
 * Listen to new signaling messages (WebRTC)
 */
export function listenToSignals(callId, userId, onSignal) {
  const signalsCol = collection(db, 'calls', callId, 'signals');
  const q = query(signalsCol, where('timestamp', '>', new Date()));

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        if (data.recipientId === userId || data.recipientId === 'all') {
          onSignal(data);
        }
      }
    });
  });
}

/**
 * Send WebRTC signal (offer/answer/ice)
 */
export async function sendSignal(callId, senderId, recipientId, type, data) {
  const signalsCol = collection(db, 'calls', callId, 'signals');
  await addDoc(signalsCol, {
    senderId,
    recipientId: recipientId || 'all',
    type,
    data,
    timestamp: serverTimestamp()
  });
}
