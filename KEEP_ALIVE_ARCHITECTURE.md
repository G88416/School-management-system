# Keep-Alive System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Page Load Event                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ├── Auto-Initialize CommHub (1s delay)
                          │   └── initCommHubSocket()
                          │       ├── Connect to WSS server
                          │       ├── Setup event handlers
                          │       └── startCommHubKeepAlive()
                          │           ├── Heartbeat Timer (30s)
                          │           └── Health Check Timer (60s)
                          │
                          └── Auto-Initialize Firebase (1s delay)
                              └── initializeFirebase()
                                  ├── Connect to Firebase
                                  ├── Setup listeners
                                  └── startFirebaseKeepAlive()
                                      ├── Heartbeat Timer (45s)
                                      └── Health Check Timer (90s)
```

## CommHub Keep-Alive Flow

```
┌──────────────────┐
│ Page Loads       │
└────────┬─────────┘
         │
         v
┌──────────────────────────┐
│ initCommHubSocket()      │
│ - Connect to server      │
│ - Setup event handlers   │
└────────┬─────────────────┘
         │
         v
┌──────────────────────────────────┐
│ startCommHubKeepAlive()          │
└────────┬─────────────────────────┘
         │
         ├─────────────────────────────┐
         │                             │
         v                             v
┌─────────────────────┐    ┌─────────────────────┐
│ Heartbeat Timer     │    │ Health Check Timer  │
│ Every 30 seconds    │    │ Every 60 seconds    │
└────────┬────────────┘    └────────┬────────────┘
         │                           │
         v                           v
┌─────────────────────┐    ┌─────────────────────┐
│ Send heartbeat msg  │    │ Check connection    │
│ with timestamp      │    │ status              │
└────────┬────────────┘    └────────┬────────────┘
         │                           │
         └───────────┬───────────────┘
                     │
                     v
         ┌──────────────────────┐
         │ Connection OK?       │
         └──────┬───────────────┘
                │
        ┌───────┴────────┐
        │                │
        v                v
    ┌─────┐         ┌──────────────┐
    │ Yes │         │ No - Lost    │
    └─────┘         └──────┬───────┘
        │                   │
        v                   v
    ┌─────────┐      ┌──────────────────┐
    │Continue │      │Attempt Reconnect │
    └─────────┘      └──────────────────┘
```

## Firebase Keep-Alive Flow

```
┌──────────────────┐
│ Page Loads       │
└────────┬─────────┘
         │
         v
┌──────────────────────────┐
│ initializeFirebase()     │
│ - Connect to Firebase    │
│ - Setup listeners        │
└────────┬─────────────────┘
         │
         v
┌──────────────────────────────────┐
│ startFirebaseKeepAlive()         │
└────────┬─────────────────────────┘
         │
         ├─────────────────────────────┐
         │                             │
         v                             v
┌─────────────────────┐    ┌─────────────────────┐
│ Heartbeat Timer     │    │ Health Check Timer  │
│ Every 45 seconds    │    │ Every 90 seconds    │
└────────┬────────────┘    └────────┬────────────┘
         │                           │
         v                           v
┌─────────────────────┐    ┌─────────────────────┐
│ Write to Firebase   │    │ Check .info/        │
│ /heartbeat/session  │    │ connected           │
└────────┬────────────┘    └────────┬────────────┘
         │                           │
         v                           v
┌─────────────────────┐    ┌─────────────────────┐
│ Update timestamp    │    │ Check Firebase      │
│ & status: online    │    │ connection state    │
└─────────────────────┘    └────────┬────────────┘
                                     │
                             ┌───────┴────────┐
                             │                │
                             v                v
                         ┌─────┐       ┌──────────────┐
                         │ OK  │       │ Lost         │
                         └─────┘       └──────┬───────┘
                             │                 │
                             v                 v
                     ┌─────────────┐   ┌──────────────────┐
                     │  Continue   │   │Re-initialize     │
                     │  Monitoring │   │Firebase          │
                     └─────────────┘   └──────────────────┘
```

## Connection Status Monitoring

```
┌────────────────────────────────────────────────────────┐
│                   Connection Status                    │
└────────────────────┬───────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │                       │
         v                       v
┌─────────────────┐     ┌─────────────────┐
│ CommHub Status  │     │ Firebase Status │
└────────┬────────┘     └────────┬────────┘
         │                        │
         v                        v
┌─────────────────┐     ┌─────────────────┐
│ 🟢 Connected    │     │ 🟢 Connected    │
│ 🟡 Reconnecting │     │ 🟡 Reconnecting │
│ 🔴 Failed       │     │ 🔴 Failed       │
└─────────────────┘     └─────────────────┘
         │                        │
         └────────────┬───────────┘
                      │
                      v
         ┌─────────────────────────┐
         │ Update UI Indicators    │
         │ - Visual badges         │
         │ - Console logs          │
         │ - User notifications    │
         └─────────────────────────┘
```

## Data Flow

### CommHub Heartbeat
```
Browser                 WebSocket Server
  │                           │
  ├──── heartbeat ───────────>│
  │     {                     │
  │       timestamp,          │
  │       username            │
  │     }                     │
  │                           │
  │<──── pong ────────────────┤ (optional)
  │                           │
```

### Firebase Heartbeat
```
Browser                 Firebase Database
  │                           │
  ├──── set() ───────────────>│
  │     /schools/xxx/         │
  │      heartbeat/session    │
  │     {                     │
  │       user,               │
  │       timestamp,          │
  │       status: "online"    │
  │     }                     │
  │                           │
  │<──── success ─────────────┤
  │                           │
```

## Presence Tracking (Firebase)

```
┌────────────────────────────────────────────────────────┐
│                    User Connects                       │
└────────────────────┬───────────────────────────────────┘
                     │
                     v
         ┌────────────────────────┐
         │ Listen to .info/       │
         │ connected              │
         └────────┬───────────────┘
                  │
          ┌───────┴────────┐
          │                │
          v                v
     ┌────────┐      ┌─────────┐
     │Online  │      │ Offline │
     └────┬───┘      └────┬────┘
          │               │
          v               v
┌──────────────────┐  ┌──────────────────┐
│ Set presence:    │  │ Auto-trigger on  │
│ status: "online" │  │ disconnect:      │
│                  │  │ status: "offline"│
└──────────────────┘  └──────────────────┘
          │               │
          └───────┬───────┘
                  │
                  v
      ┌────────────────────────┐
      │ Update Firebase:       │
      │ /presence/sessionId    │
      └────────────────────────┘
```

## Error Handling & Recovery

```
┌────────────────────────────────────────────────────────┐
│                   Connection Lost                      │
└────────────────────┬───────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │                       │
         v                       v
┌─────────────────┐     ┌─────────────────┐
│ CommHub Lost    │     │ Firebase Lost   │
└────────┬────────┘     └────────┬────────┘
         │                        │
         v                        v
┌─────────────────┐     ┌─────────────────┐
│ Update Status:  │     │ Update Status:  │
│ 🟡 Reconnecting │     │ 🟡 Reconnecting │
└────────┬────────┘     └────────┬────────┘
         │                        │
         v                        v
┌─────────────────┐     ┌─────────────────┐
│ Attempt         │     │ Attempt         │
│ Reconnection    │     │ Re-initialize   │
└────────┬────────┘     └────────┬────────┘
         │                        │
     ┌───┴────┐              ┌───┴────┐
     │        │              │        │
     v        v              v        v
┌─────┐  ┌────────┐    ┌─────┐  ┌────────┐
│ OK  │  │ Failed │    │ OK  │  │ Failed │
└──┬──┘  └───┬────┘    └──┬──┘  └───┬────┘
   │         │             │         │
   v         v             v         v
┌──────┐ ┌───────┐    ┌──────┐ ┌───────┐
│🟢    │ │🔴     │    │🟢    │ │🔴     │
│Back  │ │Show   │    │Back  │ │Show   │
│Online│ │Error  │    │Online│ │Error  │
└──────┘ └───────┘    └──────┘ └───────┘
```

## Timing Diagram

```
Time    CommHub                 Firebase
(sec)   Heartbeat  Health      Heartbeat  Health
────────────────────────────────────────────────
  0     [Init]     [Init]      [Init]     [Init]
 30     ●                                          
 45                             ●
 60                ✓                               
 90     ●                                  ✓
120     ●                       ●
150                             
180     ●          ✓            ●          ✓
210                             
240     ●                       ●
270                ✓            ●
300     ●                                  ✓

Legend:
● = Heartbeat sent
✓ = Health check performed
```

## System Integration

```
┌────────────────────────────────────────────────────────┐
│              School Management System                  │
└────────────────────┬───────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         v                       v
┌─────────────────┐     ┌─────────────────┐
│ CommHub Pro     │     │ Firebase RTDB   │
│ Video Server    │     │ Real-time Sync  │
└────────┬────────┘     └────────┬────────┘
         │                        │
         │  Keep-Alive ──────┐   │  Keep-Alive
         │  Heartbeat (30s)  │   │  Heartbeat (45s)
         │  Health (60s)     │   │  Health (90s)
         │                   │   │
         v                   v   v
┌─────────────────────────────────────────┐
│         Always Active & Live            │
│  - Persistent connections               │
│  - Auto-recovery                        │
│  - Real-time monitoring                 │
│  - Status indicators                    │
└─────────────────────────────────────────┘
```

## Summary

Both Firebase and CommHub Pro are now configured to:
1. ✅ Maintain persistent connections
2. ✅ Send periodic heartbeats
3. ✅ Monitor connection health
4. ✅ Auto-reconnect on failures
5. ✅ Track online presence
6. ✅ Update status indicators
7. ✅ Log activity for debugging

This ensures they are **always active and live** as requested.
