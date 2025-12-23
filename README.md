# Student Companion - Gen Z Study Buddy 🚀

A futuristic, Gen Z-friendly web app with glassmorphism UI for students. Features mood tracking, AI chatbot, travel planning, internship search, event management, and academic tracking.

## 🎯 Features

- **Authentication**: Firebase email/password auth with sidebar-free login/register pages
- **Mood Companion**: Track mental wellness with questionnaires
- **AI Chatbot**: Intelligent assistant with markdown formatting support, flight search, and YouTube video search capabilities
- **Focus Mode**: Fullscreen distraction-free study mode with timer and lockdown (YouTube + AI Chat only)
- **Money Manager**: Expense tracking, bank statement upload, AI financial insights
- **Stock Market Hub**: Educational content + virtual trading simulator
- **Travel Planner**: Book flights, hotels, and UPI payments
- **Internships**: Browse opportunities on Internshala
- **Events**: Create and manage campus events
- **Academics**: Track marks and assignments
- **Theme Support**: Dynamic light/dark mode with proper contrast ratios (WCAG AA compliant)
- **Responsive UI**: Glassmorphic design with Arc Reactor animations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Glassmorphism)
- **Auth & DB**: Firebase Authentication + Firestore
- **APIs**: YouTube Data API v3, Google Places API, Groq LLM
- **Animations**: Framer Motion
- **Markdown**: React Markdown with GitHub Flavored Markdown
- **Deployment**: Vercel

## 📦 Dependencies

### Core Dependencies
```json
{
  "next": "^14.1.0",
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.4.1",
  "framer-motion": "^12.23.26",
  "lucide-react": "^0.556.0"
}
```

### Firebase & Authentication
```json
{
  "firebase": "^10.7.1",
  "firebase-admin": "^12.1.0"
}
```

### AI & LLM
```json
{
  "ai": "^3.1.0",
  "@ai-sdk/groq": "^0.0.12",
  "react-markdown": "^9.0.1",
  "remark": "^15.0.1",
  "remark-gfm": "^4.0.0"
}
```

### API & Utilities
```json
{
  "next-themes": "^0.2.1",
  "axios": "^1.6.2",
  "pdfjs-dist": "^3.11.174"
}
```

### Development Dependencies
```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "autoprefixer": "^10.4.17",
  "postcss": "^8",
  "eslint": "^8",
  "eslint-config-next": "14.1.0"
}
```

### Install All Dependencies
```bash
npm install
```

This will install all packages specified in `package.json` including the above dependencies.

## 📦 Installation

### 1. Clone and Install Dependencies

```bash
cd D:\student-companion
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Copy your Firebase config

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Configure API Keys

Add to `.env.local`:

```env
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key

# Google Places API
GOOGLE_PLACES_API_KEY=your_places_api_key

# Groq LLM API (for AI chatbot)
GROQ_API_KEY=your_groq_api_key

# Aviation Stack API (for flight data)
AVIATIONSTACK_ACCESS_KEY=your_aviationstack_key

# RapidAPI (for additional API access)
RAPIDAPI_KEY=your_rapidapi_key

# LLM API (Optional - Gemini)
LLM_API_KEY=your_gemini_api_key
LLM_API_URL=https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage
```

**Get API Keys:**
- **YouTube**: [Google Cloud Console](https://console.cloud.google.com/) → Enable YouTube Data API v3
- **Places**: Same console → Enable Places API
- **Groq LLM**: [Groq Console](https://console.groq.com/) → Create API key (free tier available, 30 requests/minute)
- **Aviation Stack**: [Aviationstack.com](https://aviationstack.com/) → Free tier for flight data
- **RapidAPI**: [RapidAPI.com](https://rapidapi.com/) → Access multiple APIs
- **Gemini**: [Google AI Studio](https://aistudio.google.com/) → Get API key (optional)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables in Vercel:
   - Add all variables from `.env.local`
   - Go to Settings → Environment Variables
6. Deploy!

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts and add environment variables when asked.

## 📁 Project Structure

```
student-companion/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home/redirect
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Register page
│   ├── dashboard/page.tsx      # Dashboard
│   ├── companion/page.tsx      # Mood + Chatbot
│   ├── money/page.tsx          # Money Manager
│   ├── stocks/page.tsx         # Stock Market Hub
│   ├── travel/page.tsx         # Travel planner
│   ├── internships/page.tsx    # Internships
│   ├── events/page.tsx         # Events
│   ├── academics/page.tsx      # Marks + Assignments
│   └── api/
│       ├── llm/route.ts        # LLM API endpoint
│       ├── pdf-extract/route.ts # PDF parsing for bank statements
│       ├── market-data/route.ts # Mock stock market data
│       ├── youtube/route.ts    # YouTube proxy
│       └── places/route.ts     # Places proxy
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   ├── MoodQuestionnaire.tsx   # Mood tracking
│   ├── Chatbot.tsx             # AI chatbot
│   ├── FinancialInsights.tsx   # AI financial analysis
│   └── ui/
│       ├── GlassCard.tsx       # Glassmorphism card
│       └── PrimaryButton.tsx   # Styled button
├── context/
│   └── AuthContext.tsx         # Firebase auth context
├── lib/
│   ├── firebase.ts             # Firebase config
│   ├── llm.ts                  # LLM helper
│   ├── youtube.ts              # YouTube helper
│   └── places.ts               # Places helper
├── styles/
│   └── globals.css             # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vercel.json
```

## 🎨 Design System

### Glassmorphism Theme
- **Background**: Dark gradient (navy → purple)
- **Cards**: Semi-transparent with backdrop blur
- **Colors**: Neon purple, cyan, pink accents
- **Typography**: Inter font family
- **Borders**: Rounded (20-30px) with subtle glow

### Components
- `GlassCard`: Reusable glass panel
- `PrimaryButton`: Gradient button with hover effects
- `Navbar`: Glassmorphic navigation bar

## 🔧 Configuration

### Firestore Collections

```
users/
  - uid, name, email, createdAt

moodEntries/
  - uid, timestamp, answers, moodScore, moodLabel

expenses/
  - uid, amount, category, paymentMethod, date, notes, createdAt, source

bankStatements/
  - uid, fileName, uploadDate, downloadURL, processed

virtualPortfolios/
  - uid, cash, holdings: { symbol: { quantity, avgPrice } }

virtualTrades/
  - uid, symbol, type, quantity, price, timestamp

marks/
  - uid, subjectName, internalMarks, externalMarks, total, semester

assignments/
  - uid, subject, title, dueDate, status, notes

events/
  - title, description, location, dateTime, createdBy, isCollegeEvent
```

### Environment Variables

All environment variables should be set in:
- Local: `.env.local`
- Vercel: Dashboard → Settings → Environment Variables

## 📝 TODO / Future Enhancements

### Completed ✅
- [x] Dynamic light/dark mode with proper contrast
- [x] Markdown rendering in chatbot (bold, italic, lists, code, tables)
- [x] Focus Mode with fullscreen lockdown
- [x] AI chatbot with flight & YouTube search capabilities
- [x] Groq LLM integration with streaming responses
- [x] Theme switching with CSS variables
- [x] Accessibility improvements (WCAG AA)

### In Progress 🔄
- [ ] Advanced financial analytics and charts
- [ ] Real PDF parsing with OCR capabilities
- [ ] Mobile app optimization

### Future Enhancements 📋
- [ ] Real geolocation for Places API
- [ ] User role management for admin features
- [ ] Assignment file uploads
- [ ] Calendar view for events
- [ ] Push notifications
- [ ] Social sharing features
- [ ] Community forum
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

### Firebase Errors
- Ensure all Firebase config variables are set
- Check Firebase console for enabled services
- Verify Firestore security rules

### API Errors
- Verify API keys are correct
- Check API quotas in Google Cloud Console
- Ensure APIs are enabled

### Build Errors
- Run `npm install` to ensure all dependencies
- Clear `.next` folder: `rm -rf .next`
- Check TypeScript errors: `npm run lint`

## 📄 License

MIT License - Free to use and modify

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📧 Support

For issues or questions, open a GitHub issue or contact the maintainer.

---

Built with ❤️ for students by students
