# Smart Bracelet Fan Engagement App

A React-based test environment app for smart bracelet fan engagement at sports venues. Features both Fan View and Admin View in a beautiful mobile phone mockup design.

## 🎯 Project Structure

```
bracelet-app/
├── src/
│   ├── context/
│   │   └── AppContext.jsx      # Centralized state management
│   ├── components/
│   │   ├── FanView.jsx          # Fan experience UI
│   │   └── AdminView.jsx        # Admin dashboard UI
│   └── App.jsx                  # Main app with phone frame
```

## 🚀 Features

### Fan View
- **Home**: Connection flow, game card carousel, energy tracking
- **Stats**: Energy score, tokens, badges, past performances
- **Rewards**: Token balance, rewards catalog (food, merch, experiences)
- **Settings**: Bracelet controls, notifications, privacy settings

### Admin View
- **Analytics**: Live metrics, data cards, search & filtering
- **Controls**: Theme customization, challenge management, rewards catalog
- **Settings**: Account, venue info, system configuration

### Shared Features
- Beautiful phone mockup frame
- Seamless navigation between views
- "SIMULATOR MODE" button (placeholder for Phase 3)
- "How It Works" explainer page
- React Context for state management

## 📦 Installation

1. **Create a new React app** (or use existing):
```bash
npx create-react-app fan-engagement-app
cd fan-engagement-app
```

2. **Install dependencies**:
```bash
npm install lucide-react
```

3. **Copy the files**:
- Copy `src/context/AppContext.jsx` to your project
- Copy `src/components/FanView.jsx` to your project
- Copy `src/components/AdminView.jsx` to your project
- Replace `src/App.jsx` with the provided App.jsx

4. **Start the development server**:
```bash
npm start
```

## 🎨 Design Features

- **Mobile-First Design**: Phone mockup frame (844px height)
- **Team Colors**: Commanders burgundy (#773141) and gold (#FFB612)
- **Smooth Animations**: Connection flow, carousel, transitions
- **Bottom Navigation**: Icon-based navigation for both views
- **Responsive**: Adapts to different screen sizes while maintaining phone frame

## 🔄 Navigation Flow

```
Header (Always Visible)
  ├── Logo
  ├── SIMULATOR MODE button (when connected)
  └── Menu (☰)
      ├── Fan View
      ├── Admin View
      └── How It Works

Fan View → Bottom Nav: Home | Stats | Rewards | Settings
Admin View → Bottom Nav: Analytics | Controls | Settings
```

## 🎯 Next Steps (Phase 2 & 3)

### Phase 2: Data Connections
- Connect Admin controls to Fan view
- Real-time theme updates
- Challenge push functionality
- Reward management integration

### Phase 3: Simulator Mode
- 3-minute full game simulation
- Pre-game → Q1-Q4 → Halftime → Post-game
- Live data updates
- Random notifications
- Realistic fan behavior patterns

## 📝 Key Components Explained

### AppContext.jsx
Centralized state management using React Context API:
- `themeData`: Colors, team info, game details
- `isConnected`: Bracelet connection state
- `currentMainView`: Current view (fan/admin/howItWorks)

### FanView.jsx
Fan experience component:
- Connection flow with multiple states
- Bottom navigation with 4 tabs
- All fan-facing functionality
- Uses `themeData` from context

### AdminView.jsx
Admin dashboard component:
- Analytics with metrics cards
- Fan controls (theme, challenges, rewards)
- Settings and configuration
- Bottom navigation with 3 tabs
- Mobile-optimized for phone frame

### App.jsx
Main container component:
- Phone mockup frame
- Header with logo and menu
- View routing
- Menu dropdown
- How It Works page

## 🎨 Customization

### Change Team Colors
Edit `AppContext.jsx`:
```javascript
primaryColor: "#773141",    // Your primary color
secondaryColor: "#FFB612",  // Your secondary color
teamName: "Your Team",
opponent: "Opponent Team",
```

### Modify Phone Frame Size
Edit `App.jsx`:
```javascript
style={{ height: '844px' }}  // Change to your preferred height
```

## 🌐 Deployment

### GitHub + Netlify
1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. Connect to Netlify:
- Go to [netlify.com](https://netlify.com)
- Click "Add new site" → "Import an existing project"
- Select your GitHub repo
- Build command: `npm run build`
- Publish directory: `build`
- Deploy!

## 🔧 Troubleshooting

**Icons not showing?**
- Make sure `lucide-react` is installed: `npm install lucide-react`

**Context errors?**
- Ensure AppProvider wraps your app in App.jsx

**Styling issues?**
- Check that Tailwind CSS is properly configured if you're using it
- The app uses inline styles for dynamic theming

## 📄 License

This is a test environment application for demonstration purposes.

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding proper error handling
- Implementing real backend connections
- Adding authentication
- Optimizing performance
- Adding comprehensive testing

---

**Built with React + Lucide Icons**
**Ready for GitHub + Netlify deployment** 🚀
