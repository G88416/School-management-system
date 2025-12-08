# School Management System - BIS (Bophelong Independent School)

A comprehensive, modern school management system with real-time Firebase integration for seamless collaboration across devices.

## 🌟 Key Features

### Real-Time Collaboration
- **Automatic Firebase Connection**: When accessed from g19systems.com, the app automatically connects to Firebase Cloud
- **Live Messaging**: Send and receive messages instantly across all connected devices
- **Real-Time Updates**: Student records, attendance, fees, and all data sync automatically
- **Voice & Video Calls**: Make voice and video calls directly within the app
- **Instant Notifications**: Get notified immediately when data changes

### Core Modules
1. **Student Management**: Add, edit, and track student information
2. **Attendance Tracking**: Mark attendance with real-time synchronization
3. **Fee Management**: Track fee payments and generate receipts
4. **Staff Management**: Manage teachers and staff records
5. **Academic Management**: Handle grades, timetables, and lesson plans
6. **Communication**: Live chat, announcements, and parent-teacher messaging
7. **Reporting**: Generate comprehensive reports and analytics
8. **HR Management**: Payroll, leave requests, and performance reviews

### Progressive Web App (PWA)
- **Offline Support**: Works without internet connection
- **Installable**: Can be installed on any device like a native app
- **Background Sync**: Automatically syncs data when connection is restored
- **Push Notifications**: Receive notifications even when app is closed

## 🚀 Quick Start

### For Users on g19systems.com

1. **Access the Application**
   - Navigate to the app on g19systems.com
   - Firebase will automatically connect (no configuration needed!)

2. **Login**
   - Use your provided credentials
   - Default admin: `admin` / `admin123`
   - Upon login, you'll see "G19 Systems Cloud connected" notification

3. **Start Using**
   - All your actions will sync automatically across devices
   - Open the app on multiple devices to see real-time sync in action

### For Local/Custom Deployment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/G88416/School-management-system.git
   cd School-management-system
   ```

2. **Deploy to Web Server**
   - Upload all files to your web hosting
   - Or use a local server:
     ```bash
     # Python
     python -m http.server 8000
     
     # Node.js
     npx http-server
     ```

3. **Configure Firebase (Optional)**
   - If not using g19systems.com, you'll need your own Firebase project
   - Go to Settings → Integration in the app
   - Enter your Firebase credentials
   - Click Save and refresh

## 📱 Installation as PWA

### On Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Or click the menu → Install BIS Management
3. App will open in its own window

### On Mobile
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap Share → Add to Home Screen
3. App icon will appear on your home screen

## 🔥 Firebase Real-Time Features

### Automatic Domain Detection
```javascript
// The app automatically detects g19systems.com
if (hostname === 'g19systems.com') {
  // Auto-enable Firebase Cloud
  connectToG19Cloud();
}
```

### Real-Time Data Sync
All of these sync automatically:
- ✅ Messages and chat conversations
- ✅ Student records (add/edit/delete)
- ✅ Attendance marking
- ✅ Fee payments
- ✅ Staff updates
- ✅ Grade entries
- ✅ Announcements
- ✅ File uploads
- ✅ Call signaling

### How to Test Real-Time Sync

1. **Open Two Browsers/Devices**
   - Browser 1: Login as admin
   - Browser 2: Login as teacher or different user

2. **Test Live Chat**
   - Go to Media → Live Chat on both
   - Send message from one browser
   - See it appear instantly on the other!

3. **Test Data Updates**
   - Add a student on Browser 1
   - Check Students section on Browser 2
   - Refresh section to see new student

## 🎨 User Interface

### Modern Design
- **Glassmorphism**: Beautiful glass-effect cards and panels
- **Gradient Themes**: Customizable color schemes
- **Dark Mode**: Eye-friendly dark interface
- **Responsive**: Works on phones, tablets, and desktops
- **Animations**: Smooth transitions and micro-interactions

### Mobile-First
- **Bottom Navigation**: Easy thumb access on mobile
- **Touch-Friendly**: Large buttons and swipe gestures
- **Adaptive Layout**: Automatically adjusts to screen size

## 👥 User Roles

### Admin
- Full access to all modules
- User management
- System configuration
- Analytics and reports

### HOD (Head of Department)
- Monitor teacher activities
- View lesson plans and grades
- Generate department reports
- Communicate with teachers

### Teacher
- Mark attendance
- Enter grades
- Create lesson plans
- Upload resources
- Chat with students/parents

### Parent
- View child's attendance
- Check grades and reports
- Communicate with teachers
- View announcements
- Make fee payments

### Student
- View attendance
- Check grades
- Access learning materials
- View timetable
- Communicate with teachers

## 🔧 Technical Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: Vanilla JS (no frameworks needed)
- **Bootstrap 5**: Responsive grid and components

### Backend/Database
- **Firebase Realtime Database**: NoSQL cloud database
- **Firebase Storage**: File storage for uploads
- **Firebase Cloud Messaging**: Push notifications
- **LocalStorage**: Client-side persistence

### APIs & Libraries
- **Chart.js**: Data visualization
- **jsPDF**: PDF generation
- **XLSX**: Excel export/import
- **PeerJS**: WebRTC for video/audio calls
- **Stripe**: Payment processing

## 📊 Architecture

```
┌─────────────────┐
│   User Device   │
│   (Browser)     │
└────────┬────────┘
         │
         ├─ LocalStorage (Offline Data)
         ├─ Service Worker (PWA/Cache)
         └─ Firebase SDK
               │
               ▼
┌─────────────────────────────┐
│   Firebase Cloud (G19)      │
│                             │
│  ├─ Realtime Database       │
│  ├─ Cloud Storage           │
│  ├─ Cloud Messaging         │
│  └─ Authentication          │
└─────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Other Devices  │
│  (Real-time)    │
└─────────────────┘
```

## 🔒 Security

- **HTTPS Only**: All data transmitted securely
- **Firebase Rules**: Server-side security rules
- **User Authentication**: Role-based access control
- **Data Validation**: Client and server-side validation
- **XSS Protection**: Input sanitization

## 📖 Documentation

- [Firebase Integration Guide](FIREBASE_INTEGRATION.md) - Detailed Firebase documentation
- [User Manual](https://g19systems.com/docs) - Complete user guide
- [API Reference](https://g19systems.com/api) - For developers

## 🐛 Troubleshooting

### Firebase Not Connecting
1. Check console for errors (F12)
2. Verify you're on g19systems.com or have configured Firebase
3. Clear cache and reload
4. Check internet connection

### Real-Time Sync Not Working
1. Ensure both devices are logged in
2. Check Firebase status badge (should be green)
3. Verify data is being saved (check localStorage)
4. Review console logs for errors

### App Not Installing (PWA)
1. Ensure accessing via HTTPS
2. Check manifest.json is loading
3. Verify service worker is registered
4. Try different browser

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@g19systems.com
- **Documentation**: [FIREBASE_INTEGRATION.md](FIREBASE_INTEGRATION.md)
- **Issues**: [GitHub Issues](https://github.com/G88416/School-management-system/issues)

## 🎯 Roadmap

### Current Features ✅
- Real-time Firebase sync
- PWA with offline support
- Multi-role user system
- Complete school management

### Coming Soon 🚀
- Mobile apps (iOS/Android)
- Advanced analytics dashboard
- AI-powered insights
- Biometric attendance
- SMS/Email notifications
- Integration with payment gateways
- Parent portal mobile app

## 🙏 Acknowledgments

- Firebase for real-time database
- Bootstrap for UI components
- Font Awesome for icons
- Chart.js for visualizations
- All contributors and users

## 📈 Stats

- **Lines of Code**: 27,000+
- **Features**: 50+
- **Supported Roles**: 5
- **Real-time Updates**: Yes ✅
- **Offline Support**: Yes ✅
- **Mobile Responsive**: Yes ✅

---

**Made with ❤️ by G19 Systems**

**Version**: 1.0  
**Last Updated**: December 2024

For the latest updates and documentation, visit [g19systems.com](https://g19systems.com)
