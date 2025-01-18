# 📸 Gallery App

A modern mobile gallery application built with React Native and Expo that captures, stores, and organizes photos with location data and timestamps.

## ✨ Features

### Camera Integration
- **Real-time Camera Preview**
  - High-quality photo capture
  - Front/back camera switching

### Photo Management
- **Image Organization**
  - Auto naming for photos
  - Automatic date/time stamping
  - Location tagging
  - Search functionality

### Location Features
- **GPS Integration**
  - Automatic location capture
  - Map view of photo locations
  - Offline location caching

### Gallery Features
- **Image Viewing**
  - Grid and list views
  - Photo details overlay
  - Share functionality

## 🛠️ Technical Stack

### Core Technologies
- **React Native** (0.76.3)
- **Expo** (52.0.11)
- **React** (18.3.1)

### Key Dependencies
- **expo-camera**: Photo capture functionality
- **expo-location**: GPS and location services
- **expo-sqlite**: Local database storage
- **expo-file-system**: File management
- **react-native-maps**: Map integration
- **react-native-image-zoom-viewer**: Image viewing
- **@react-navigation**: App navigation

## 📱 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Physical device with Expo Go app (optional)

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/oscarpoco/gallery.git
   cd gallery
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on Platform**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```


## 📸 Usage

### Taking Photos
1. Open the camera screen
2. Adjust camera settings if needed
3. Tap capture button
4. Automatically Add name and details
5. Save to gallery

### Managing Photos
- View all photos in grid/list view
- Tap photo for full-screen view
- Swipe through photos in viewer
- Access photo details
- Share photos

### Location Features
- View photo locations on map
- Filter photos by location
- See location history
- Export location data

## ⚙️ Configuration

### Required Permissions
```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Gallery App to access your camera."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Gallery App to use your location."
        }
      ]
    ]
  }
}
```

### Database Schema
```sql
CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  uri TEXT,
  latitude REAL,
  longitude REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Privacy & Security

- All photos stored locally on device
- Optional location tracking
- Secure file system storage
- Permission-based access

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific component
npm test ComponentName.test.js
```

## 📱 Platform Support

- iOS 13.0 and higher
- Android API level 21 (Android 5.0) and higher
- Optimized for both phones and tablets

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🐛 Troubleshooting

### Common Issues
- Camera permissions denied
- Location services unavailable
- Storage access issues
- Image loading errors

### Debug Mode
```javascript
// App.js
const DEBUG_MODE = __DEV__;
```

## 📞 Support

- GitHub Issues
- Email support : oscarkylepoco@gmail.com

## 🙏 Acknowledgments

- Expo team
- React Native community
- Contributors and testers
- Open source packages used

---
Made with ❤️ by Oscar Poco
