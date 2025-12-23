# Financial Features Documentation

## Overview
The Student Companion app now includes comprehensive financial management and educational features designed specifically for students. All features comply with RBI, NPCI, and SEBI regulations.

## 🚨 Legal Compliance Notice
- **NO direct UPI/banking API access** - All transaction data is manually entered or user-uploaded
- **Educational content only** - Not personalized financial advice
- **SEBI compliant** - Investment content is educational, includes proper disclaimers
- **Privacy focused** - All data is user-scoped and secure

## Features

### 1. Money Manager 💰
**Path:** `/money`

#### Expense Tracking
- Manual expense entry with categories: food, travel, snacks, subscription, hostel, misc
- Payment method tracking: UPI, cash, card
- Date-based organization
- Notes for additional context

#### Bank Statement Upload
- PDF upload to Firebase Storage
- Server-side PDF parsing (simulated for demo)
- Auto-import transactions from statements
- Secure file handling with user-scoped access

#### Analytics Dashboard
- Monthly spending summaries
- Category-wise breakdown with visual progress bars
- Highest spending category identification
- Total expense tracking

#### AI-Powered Financial Insights
- Spending pattern analysis
- Personalized budgeting suggestions
- Unusual spending detection
- Student-focused saving tips
- Rule-based + AI-generated recommendations

**Firestore Collections:**
```
expenses/
  - uid, amount, category, paymentMethod, date, notes, createdAt, source

bankStatements/
  - uid, fileName, uploadDate, downloadURL, processed

parsedTransactions/
  - uid, date, description, amount, type, category, source
```

### 2. Stock Market Learning Hub 📈
**Path:** `/stocks`

#### Educational Content
- **Beginner Level:**
  - What is the Stock Market?
  - How Shares Work
  
- **Intermediate Level:**
  - Long-term vs Short-term Investing
  - Mutual Funds Explained
  - Understanding ETFs
  
- **Advanced Level:**
  - Risk Management
  - Portfolio Diversification

#### Virtual Trading Simulator
- **Paper Trading:** ₹10,00,000 virtual money
- **Real-time Prices:** Simulated market data API
- **Portfolio Management:** Track holdings and performance
- **Trade History:** Complete transaction log
- **P&L Tracking:** Virtual profit/loss calculation

#### Market Data API
- Mock stock prices for popular Indian stocks
- Real-time price simulation with variations
- Educational disclaimer on all data

**Firestore Collections:**
```
virtualPortfolios/
  - uid, cash, holdings: { symbol: { quantity, avgPrice } }

virtualTrades/
  - uid, symbol, type, quantity, price, timestamp

stockLessons/
  - title, content, level, order
```

### 3. Financial Insights AI Component
**Component:** `FinancialInsights.tsx`

#### Features
- Spending habit analysis
- Category-wise recommendations
- Budget optimization suggestions
- Student-specific financial tips
- AI + rule-based insights combination

#### Sample Insights
- "Food spending is 35% of total - consider meal planning"
- "Review subscriptions - cancel unused services"
- "Set weekly budget limits for better tracking"
- "Enable UPI notifications for spending awareness"

## API Endpoints

### `/api/pdf-extract`
- **Method:** POST
- **Purpose:** Process uploaded bank statements
- **Input:** `{ fileUrl, uid }`
- **Output:** Parsed transactions
- **Security:** User-scoped access only

### `/api/market-data`
- **Method:** GET
- **Purpose:** Provide simulated stock market data
- **Params:** `?symbol=RELIANCE` (optional)
- **Output:** Stock prices with variations
- **Disclaimer:** Educational simulation only

## Security & Privacy

### Data Protection
- All financial data is user-scoped by UID
- No external API calls to banking services
- Secure file upload to Firebase Storage
- Client-side data validation

### Compliance Features
- Legal disclaimers on all financial pages
- Educational purpose statements
- No personalized investment advice
- SEBI compliance notices

### Firebase Security Rules
```javascript
// Expenses collection
match /expenses/{document} {
  allow read, write: if request.auth != null && 
    request.auth.uid == resource.data.uid;
}

// Virtual portfolios
match /virtualPortfolios/{userId} {
  allow read, write: if request.auth != null && 
    request.auth.uid == userId;
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install pdf-parse
```

### 2. Environment Variables
No additional API keys required - all features use Firebase and internal APIs.

### 3. Firebase Collections
The app will automatically create required collections on first use.

### 4. Deploy to Vercel
All features are Vercel-compatible with serverless functions.

## Usage Guidelines

### For Students
1. **Expense Tracking:** Manually enter daily expenses or upload bank statements
2. **Learning:** Start with beginner stock market lessons
3. **Practice Trading:** Use virtual money to learn without risk
4. **Financial Planning:** Review AI insights for budgeting tips

### For Developers
1. **Extend Categories:** Add new expense categories in the constants
2. **Add Lessons:** Create new educational content in the lessons array
3. **Enhance AI:** Improve the financial insights algorithm
4. **Real Data:** Replace mock APIs with real market data (with proper licensing)

## Future Enhancements

### Planned Features
- [ ] Real market data integration (with proper API licensing)
- [ ] Advanced portfolio analytics
- [ ] Expense prediction using ML
- [ ] Social trading features (educational)
- [ ] Financial goal setting and tracking
- [ ] Integration with popular Indian fintech apps (read-only)

### Technical Improvements
- [ ] Real PDF parsing with OCR
- [ ] Advanced chart visualizations
- [ ] Mobile app version
- [ ] Offline expense tracking
- [ ] Export financial reports

## Disclaimer
This application is designed for educational purposes only. It does not provide personalized financial advice. Users should consult qualified financial advisors for investment decisions. All market data is simulated for learning purposes.

## Support
For technical issues or feature requests, please refer to the main README.md or contact the development team.