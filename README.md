# School Management System with CommHub Pro

A comprehensive school management system with integrated video conferencing capabilities.

## 🎥 Video Conferencing (CommHub Pro)

### Current Status: ⚠️ Requires Server Deployment

The video conferencing feature requires a WebSocket signaling server to be deployed.

### Quick Fix

**Problem**: "Cannot connect to video server" error

**Solution**: Deploy the included signaling server (takes 5 minutes)

**Read**: [WEBSOCKET_QUICK_FIX.md](./WEBSOCKET_QUICK_FIX.md) for immediate solution

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- For video conferencing: Node.js 14+ (for server deployment)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd School-management-system
   ```

2. **Open the application**
   - Simply open `index.html` in a web browser
   - OR use a local server:
     ```bash
     # Python
     python -m http.server 8000
     
     # Node.js
     npx serve .
     
     # VS Code - use Live Server extension
     ```

3. **For video conferencing**
   - Deploy the signaling server (see below)
   - Update the server URL in `index.html`

## 📡 Deploying the Video Conferencing Server

### Quick Deploy (Railway - Recommended)

1. Go to [railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Copy your deployment URL
6. Update `index.html` line ~30450 with your URL:
   ```javascript
   const SIGNALING_SERVER = "wss://your-app.up.railway.app";
   ```

**Cost**: FREE (500 hours/month)

### Local Testing

```bash
# Install dependencies
npm install

# Start server
npm start

# Server will run on http://localhost:3000
```

Update `index.html` to use `ws://localhost:3000` for local testing.

### Full Documentation

- [WEBSOCKET_QUICK_FIX.md](./WEBSOCKET_QUICK_FIX.md) - Quick solution to connection errors
- [WEBSOCKET_SERVER_DEPLOYMENT.md](./WEBSOCKET_SERVER_DEPLOYMENT.md) - Complete deployment guide
- [COMMHUB_PRO_TESTING_GUIDE.md](./COMMHUB_PRO_TESTING_GUIDE.md) - Testing instructions
- [COMMHUB_CONNECTION_FIX.md](./COMMHUB_CONNECTION_FIX.md) - Error handling details

## 🧪 Testing Video Conferencing

### Quick Test

1. Open `commhub-test.html` in two browser windows
2. Enter the same room name in both
3. Click "Join Room" in both
4. Allow camera/microphone permissions
5. You should see both video feeds

### What Should Work

- ✅ Video calling between 2+ users
- ✅ Audio communication
- ✅ Text chat
- ✅ Screen sharing
- ✅ Reactions and hand raising
- ✅ Recording (local device only)

## 📦 Project Structure

```
School-management-system/
├── index.html                          # Main application
├── commhub-test.html                   # Video conferencing test page
├── signaling-server.js                 # WebSocket server for video calls
├── package.json                        # Server dependencies
├── Procfile                           # Heroku deployment config
├── README.md                          # This file
├── WEBSOCKET_QUICK_FIX.md            # Quick fix guide
├── WEBSOCKET_SERVER_DEPLOYMENT.md     # Full deployment guide
└── COMMHUB_PRO_TESTING_GUIDE.md      # Testing guide
```

## 🔧 Configuration

### Environment Variables (Server)

Create a `.env` file for local development:

```env
PORT=3000
ALLOWED_ORIGINS=http://localhost:8000,https://yourdomain.com
NODE_ENV=development
```

For production deployment (Railway/Heroku), set these in your platform's dashboard.

### Client Configuration

Edit `index.html` around line 30450:

```javascript
// Change this to your deployed server URL
const SIGNALING_SERVER = "wss://your-app.up.railway.app";
```

## 🐛 Troubleshooting

### "Cannot connect to video server" Error

**Cause**: Signaling server not deployed or wrong URL

**Solution**: 
1. Deploy the server (see [WEBSOCKET_QUICK_FIX.md](./WEBSOCKET_QUICK_FIX.md))
2. Update the `SIGNALING_SERVER` URL in `index.html`
3. Make sure you're using `wss://` for HTTPS deployments

### Camera/Microphone Not Working

**Cause**: Permissions not granted or device in use

**Solution**:
1. Allow camera/microphone permissions in browser
2. Close other apps using the camera
3. Try a different browser
4. Check if HTTPS is enabled (required for WebRTC)

### Poor Video Quality

**Cause**: Slow internet connection

**Solution**:
1. Close bandwidth-heavy applications
2. Use a better network connection
3. Reduce number of participants
4. Browser will auto-adjust quality

### More Help

See [COMMHUB_PRO_TESTING_GUIDE.md](./COMMHUB_PRO_TESTING_GUIDE.md) for comprehensive troubleshooting.

## 🔐 Security

- All video/audio streams are peer-to-peer (not stored on server)
- Signaling server only facilitates connection setup
- Use HTTPS in production (provided free by Railway/Heroku)
- Input validation and sanitization implemented
- Room names are sanitized to prevent injection attacks

## 📊 Features

### School Management
- Student management
- Attendance tracking
- Fee management
- Teacher portal
- Parent communication
- Reports and analytics
- Multiple user roles (Admin, HOD, Teacher, Parent, Student)

### Video Conferencing (CommHub Pro)
- Multi-user video calls
- Real-time text chat
- Screen sharing
- Reactions and hand raising
- Local recording
- Room-based meetings
- Auto-reconnection on network issues
- Responsive UI for mobile devices

## 💡 Development

### Running Locally

```bash
# Start the signaling server
npm start

# In another terminal, start a web server for the frontend
python -m http.server 8000
# OR
npx serve .

# Open http://localhost:8000/index.html
```

### Making Changes

1. Edit `index.html` for frontend changes
2. Edit `signaling-server.js` for server changes
3. Test locally before deploying
4. Deploy server changes to Railway/Heroku

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

### Video Conferencing Issues
- Read [WEBSOCKET_QUICK_FIX.md](./WEBSOCKET_QUICK_FIX.md)
- Check [WEBSOCKET_SERVER_DEPLOYMENT.md](./WEBSOCKET_SERVER_DEPLOYMENT.md)
- Review [COMMHUB_PRO_TESTING_GUIDE.md](./COMMHUB_PRO_TESTING_GUIDE.md)

### General Issues
- Check browser console (F12) for errors
- Try a different browser
- Clear browser cache
- Test on a different device

## 🚀 Deployment

### Frontend (index.html)
- Deploy to GitHub Pages, Netlify, Vercel, or any static hosting
- Make sure to update `SIGNALING_SERVER` URL

### Backend (signaling-server.js)
- **Railway**: Auto-deploy from GitHub (recommended)
- **Heroku**: `git push heroku main`
- **Render**: Connect GitHub repo
- **VPS**: Use PM2 + Nginx

See [WEBSOCKET_SERVER_DEPLOYMENT.md](./WEBSOCKET_SERVER_DEPLOYMENT.md) for detailed instructions.

## ⚡ Quick Links

- [Fix Connection Errors](./WEBSOCKET_QUICK_FIX.md)
- [Deploy Server](./WEBSOCKET_SERVER_DEPLOYMENT.md)
- [Test Video Calls](./COMMHUB_PRO_TESTING_GUIDE.md)
- [Test Page](./commhub-test.html)

## 🎉 Status

- ✅ School management features: **Fully Functional**
- ⚠️ Video conferencing: **Requires Server Deployment** (5 minutes setup)

Follow [WEBSOCKET_QUICK_FIX.md](./WEBSOCKET_QUICK_FIX.md) to get video conferencing working!

---

**Last Updated**: December 10, 2024  
**Version**: 1.0.0
