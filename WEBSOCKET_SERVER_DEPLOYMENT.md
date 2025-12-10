# WebSocket Signaling Server - Deployment Guide

## 🔍 Problem Identified

The CommHub Pro video conferencing feature was pointing to a non-existent signaling server at:
```
wss://commhub-signaling-production.up.railway.app
```

**Error**: `Could not resolve host` - This server doesn't exist or was never deployed.

**Impact**: Users cannot use the video conferencing feature and get "Failed to join room: Cannot connect to video server" errors.

---

## ✅ Solution

I've created a complete, production-ready signaling server (`signaling-server.js`) that you can deploy in multiple ways.

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Free & Easy)

Railway offers free hosting with automatic HTTPS and WebSocket support.

#### Steps:

1. **Create Railway Account**
   - Go to https://railway.app/
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository
   - Railway will auto-detect `package.json` and deploy

3. **Get Your Server URL**
   - Railway will provide a URL like: `https://your-project.up.railway.app`
   - Copy this URL

4. **Update index.html**
   - Open `index.html`
   - Find line ~30450: `const SIGNALING_SERVER = "wss://..."`
   - Replace with your Railway URL:
     ```javascript
     const SIGNALING_SERVER = "wss://your-project.up.railway.app";
     ```

5. **Test**
   - Open `index.html` in browser
   - Navigate to Media → CommHub Pro
   - Try to join a room
   - Should connect successfully!

**Cost**: Free tier (500 hours/month, enough for most uses)

---

### Option 2: Heroku (Also Free & Easy)

#### Steps:

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   cd /path/to/School-management-system
   heroku create commhub-signaling
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Add signaling server"
   git push heroku main
   ```

5. **Get URL**
   ```bash
   heroku open
   # Will show: https://commhub-signaling-xxxxx.herokuapp.com
   ```

6. **Update index.html** with the Heroku URL

**Cost**: Free tier (550-1000 dyno hours/month)

---

### Option 3: Local Testing (For Development)

Perfect for testing without deploying to cloud.

#### Steps:

1. **Install Node.js**
   - Download from: https://nodejs.org/ (LTS version)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Install Dependencies**
   ```bash
   cd /path/to/School-management-system
   npm install
   ```

3. **Start Server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   ╔══════════════════════════════════════════════════════╗
   ║   CommHub Pro Signaling Server                       ║
   ╚══════════════════════════════════════════════════════╝
   
   ✅ Server is running on port 3000
   📡 WebSocket endpoint: ws://localhost:3000
   🌐 HTTP endpoint: http://localhost:3000
   ```

4. **Update index.html for local testing**
   - Find line ~30450
   - Change to:
     ```javascript
     const SIGNALING_SERVER = "ws://localhost:3000";
     ```

5. **Open index.html**
   - You can use VS Code's Live Server extension, or
   - Just open `file:///path/to/index.html` in browser
   - Navigate to Media → CommHub Pro
   - Try to join a room

**Note**: For local testing to work properly, you need to serve `index.html` over HTTP (not file://). Use a local web server like:
- VS Code Live Server extension
- Python: `python -m http.server 8000`
- Node: `npx serve .`

---

### Option 4: Render (Free Alternative)

#### Steps:

1. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +"  → "Web Service"
   - Connect your GitHub repository
   - Choose this repo

3. **Configure**
   - Name: `commhub-signaling`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Click "Create Web Service"

4. **Get URL**
   - Render provides: `https://commhub-signaling.onrender.com`
   - Copy this URL

5. **Update index.html** with Render URL

**Cost**: Free tier (with limitations after 90 days)

---

### Option 5: Your Own VPS (Advanced)

If you have a VPS (DigitalOcean, Linode, AWS EC2, etc.):

```bash
# SSH into your server
ssh user@your-server.com

# Clone or upload the files
git clone <your-repo-url>
cd School-management-system

# Install dependencies
npm install

# Install PM2 for process management
npm install -g pm2

# Start server with PM2
pm2 start signaling-server.js --name commhub

# Make it restart on reboot
pm2 startup
pm2 save

# Configure nginx reverse proxy (optional but recommended)
# /etc/nginx/sites-available/commhub
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/commhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🧪 Testing Your Deployment

### 1. Check Server Health

Visit your server URL in a browser:
```
https://your-server-url.com/
```

You should see:
```json
{
  "status": "ok",
  "name": "CommHub Pro Signaling Server",
  "version": "1.0.0",
  "uptime": 123.45,
  "activeRooms": 0,
  "activeUsers": 0,
  "timestamp": "2024-12-10T08:45:00.000Z"
}
```

### 2. Test WebSocket Connection

Use the test page (`commhub-test.html`):

1. Open `commhub-test.html` in a browser
2. Update the SIGNALING_SERVER constant (line ~322) to your server URL
3. Enter your name and a room name
4. Click "Join Room"
5. Check the event log for "Connected to signaling server"

### 3. Test Two-User Connection

1. Open `commhub-test.html` on two different devices/browsers
2. Both enter the SAME room name (e.g., "test-room")
3. Both click "Join Room"
4. Both should see each other's video feeds

If you see both videos, **everything is working!** ✅

---

## 🔧 Troubleshooting

### Server Not Starting

**Issue**: `npm start` fails

**Solutions**:
1. Check Node.js version: `node --version` (need v14+)
2. Install dependencies: `npm install`
3. Check port availability: `lsof -i :3000` (kill process if needed)
4. Check logs: `npm start` will show errors

### Cannot Connect from Browser

**Issue**: "Unable to connect to video server"

**Solutions**:

1. **Check URL**
   - Make sure you updated `SIGNALING_SERVER` in index.html
   - Use `wss://` for HTTPS sites, `ws://` for HTTP/local
   - No trailing slash in URL

2. **Check CORS**
   - Server allows all origins by default
   - For production, set `ALLOWED_ORIGINS` environment variable:
     ```bash
     export ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
     ```

3. **Check Firewall**
   - Make sure port 3000 is open (or whatever port you're using)
   - Check if hosting provider blocks WebSocket connections

4. **Check HTTPS**
   - Modern browsers require HTTPS for WebRTC
   - Railway/Heroku/Render provide HTTPS automatically
   - For local testing, use `localhost` (HTTPS not required)

### Video Not Showing

**Issue**: Connected but no video

**Solutions**:
1. Grant camera/microphone permissions in browser
2. Check if another app is using the camera
3. Check browser console for errors (F12)
4. Try a different browser
5. Make sure you're on HTTPS (except localhost)

### Connection Drops Frequently

**Issue**: Connection keeps disconnecting

**Solutions**:
1. Check internet connection stability
2. Increase `pingTimeout` in `signaling-server.js`:
   ```javascript
   const io = socketIO(server, {
       pingTimeout: 120000,  // 2 minutes instead of 1
       pingInterval: 25000
   });
   ```
3. Check hosting provider for connection limits
4. Monitor server logs for errors

---

## 📊 Monitoring Your Server

### View Active Connections

Visit: `https://your-server-url.com/`

Shows:
- Number of active rooms
- Number of active users
- Server uptime

### View Server Logs

**Railway**: Click on your deployment → "Logs" tab

**Heroku**: `heroku logs --tail --app your-app-name`

**Local**: Check terminal where you ran `npm start`

**PM2 (VPS)**: `pm2 logs commhub`

### Common Log Messages

- `✅ Client connected: xxx` - User connected
- `👤 User joining room: xxx` - User joining
- `📞 Call request from xxx to yyy` - Call initiated
- `⚠️ Client disconnected: xxx` - User disconnected

---

## 💰 Costs & Scaling

### Free Tier Limits

| Platform | Hours/Month | Concurrent | Notes |
|----------|-------------|------------|-------|
| Railway  | 500 hours   | Unlimited  | Best for most users |
| Heroku   | 550 hours   | Unlimited  | Sleeps after 30min idle |
| Render   | 750 hours   | 90 days    | Then paid |
| Replit   | Unlimited   | Limited    | Good for testing |

### Scaling Considerations

**Small (1-10 concurrent users)**: Free tier is perfect

**Medium (10-50 users)**: 
- Consider paid Railway plan ($5/month)
- Or use Heroku hobby dyno ($7/month)

**Large (50+ users)**:
- Use dedicated VPS (DigitalOcean $6/month)
- Implement load balancing
- Consider TURN servers for better connectivity

### Bandwidth Usage

Each video stream uses ~1-2 Mbps. The signaling server uses minimal bandwidth (only for WebRTC negotiation), as video/audio goes peer-to-peer.

---

## 🔐 Security Best Practices

### 1. Environment Variables

Never commit sensitive data. Use environment variables:

```javascript
// In signaling-server.js
const SECRET_KEY = process.env.SECRET_KEY || 'default-dev-key';
```

Set in Railway/Heroku dashboard or `.env` file locally.

### 2. Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### 3. Input Validation

The server already validates and sanitizes inputs:
- Room IDs limited to 50 characters, alphanumeric only
- Usernames limited to 50 characters
- All user input is sanitized

### 4. HTTPS Only

For production, enforce HTTPS:

```javascript
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}
```

---

## 📝 Updating index.html

After deploying, update your client to use the new server:

### Find and Replace

1. Open `index.html`
2. Search for (around line 30450):
   ```javascript
   const SIGNALING_SERVER = "wss://commhub-signaling-production.up.railway.app";
   ```

3. Replace with your server URL:
   ```javascript
   const SIGNALING_SERVER = "wss://your-actual-server.com";
   ```

4. Also update `commhub-test.html` (line ~322):
   ```javascript
   const SIGNALING_SERVER = "wss://your-actual-server.com";
   ```

5. Save and test!

---

## ✅ Quick Start (Fastest Method)

**Fastest way to get working video conferencing in under 5 minutes:**

1. **Create Railway account**: https://railway.app/ (GitHub login)

2. **Deploy**:
   - New Project → Deploy from GitHub
   - Select your repo
   - Wait 2 minutes for deployment

3. **Get URL**:
   - Railway gives you a URL automatically
   - Copy it (something like `https://your-app.up.railway.app`)

4. **Update code**:
   - Open `index.html`
   - Find line ~30450
   - Change `SIGNALING_SERVER` to your Railway URL
   - Use `wss://` not `ws://`

5. **Test**:
   - Open `index.html`
   - Go to Media → CommHub Pro
   - Join a room
   - Should work!

**That's it!** Video conferencing should now be fully functional.

---

## 🆘 Getting Help

If deployment fails:

1. **Check the logs** - Most platforms show deployment logs
2. **Check package.json** - Make sure it's committed to git
3. **Check signaling-server.js** - Make sure it's executable
4. **Check Node version** - Needs Node 14+
5. **Ask for help** with specific error messages

---

## 📦 What's Included

Files created/modified:
- ✅ `signaling-server.js` - Complete WebSocket server
- ✅ `package.json` - Dependencies and scripts
- ✅ `WEBSOCKET_SERVER_DEPLOYMENT.md` - This guide
- ⚠️ `index.html` - Needs URL update after deployment
- ⚠️ `commhub-test.html` - Needs URL update after deployment

---

## 🎉 Success Criteria

You'll know it's working when:
- ✅ Server health check shows "status": "ok"
- ✅ index.html connects without errors
- ✅ Two users can see each other's video
- ✅ Chat messages are delivered
- ✅ No "websocket error" messages

---

## 📞 Next Steps

After successful deployment:

1. ✅ Test with real users
2. ✅ Monitor server performance
3. ✅ Set up monitoring/alerts
4. ✅ Consider paid plan if usage grows
5. ✅ Add authentication if needed
6. ✅ Implement recording if desired

---

**Last Updated**: December 10, 2024  
**Version**: 1.0.0  
**Status**: Ready for Deployment ✅
