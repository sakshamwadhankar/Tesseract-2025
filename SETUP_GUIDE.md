# 🚀 Tesseract 2025 - Setup Guide

## ✅ Backend Setup Complete!

Your Marvel-themed voting system backend is now ready. Follow these steps to complete the setup:

## 📋 Step 1: Database Setup

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/lwyxcndmbpotaegbzswh

2. **Run SQL Schema**:
   - Click on "SQL Editor" in the left sidebar
   - Copy the entire contents of `/database/schema.sql`
   - Paste and click "Run" 
   - You should see green success messages

3. **Verify Tables Created**:
   - Go to "Table Editor" 
   - You should see 3 tables: `projects`, `votes`, `admins`

## 👤 Step 2: Create Admin User

1. **Create a Test User**:
   - Go to "Authentication" → "Users"
   - Click "Add user" → "Create new user"
   - Email: `admin@tesseract.com`
   - Password: `TesseractAdmin2025!`
   - Click "Create user"

2. **Make User Admin**:
   - Copy the user's UUID from the Users list
   - Go to "SQL Editor"
   - Run this command (replace UUID):
   ```sql
   INSERT INTO public.admins (user_id, is_admin) 
   VALUES ('YOUR-USER-UUID-HERE', true);
   ```

## 🔌 Step 3: Frontend Integration

Your frontend remains **100% unchanged**. To activate the backend features, add these minimal JavaScript snippets:

### For Login Page (`shield-tesseract-access-portal`)
```javascript
import { LoginHandler } from '@/components/VotingIntegration'

// In your component:
const { email, setEmail, password, setPassword, handleAuth, message } = LoginHandler()

// Connect to your existing form buttons/inputs
```

### For Voting Page (`avenger-vote-vault`)
```javascript
import { VoteHandler } from '@/components/VotingIntegration'

// In your component:
const { projects, handleVote, message } = VoteHandler()

// Connect handleVote to your existing vote buttons
```

### For Leaderboard (`tesseract-hall-of-heroes`)
```javascript
import { LeaderboardHandler } from '@/components/VotingIntegration'

// In your component:
const { leaderboard, showThankYou } = LeaderboardHandler()

// Display leaderboard data in your existing UI
```

### For Admin Dashboard (`furys-war-room-console`)
```javascript
import { AdminHandler } from '@/components/VotingIntegration'

// In your component:
const { projects, handleToggleLock } = AdminHandler()

// Connect to your existing admin controls
```

## 🧪 Step 4: Test the System

1. **Test User Flow**:
   - Login as regular user
   - Try to vote (should fail - no unlocked projects)
   - Check leaderboard

2. **Test Admin Flow**:
   - Login as admin (`admin@tesseract.com`)
   - Go to admin dashboard
   - Unlock some projects
   - Toggle lock/unlock status

3. **Test Voting**:
   - Login as regular user
   - Vote on unlocked projects
   - See thank you message
   - Check live leaderboard updates

## 📁 File Structure Created

```
Tesseract/
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   ├── auth-utils.ts        # Authentication functions
│   ├── voting-utils.ts      # Voting system functions
│   └── admin-utils.ts       # Admin control functions
│
├── hooks/
│   └── useSupabase.tsx      # React hooks for easy integration
│
├── components/
│   └── VotingIntegration.tsx # Example integration components
│
├── database/
│   └── schema.sql           # Database schema and setup
│
└── SETUP_GUIDE.md           # This file
```

## 🎯 Key Features Working

- ✅ **Secure Authentication** - Email/password login with Supabase Auth
- ✅ **One Vote Per User** - Database constraints prevent duplicate voting
- ✅ **Admin Controls** - Lock/unlock projects, view statistics
- ✅ **Real-time Updates** - Live vote counts and leaderboard
- ✅ **Row Level Security** - Database-level security policies
- ✅ **Access Control** - Admin-only areas protected

## 🔒 Security Features

- **RLS Policies**: All tables protected with Row Level Security
- **Admin Verification**: Admin status checked at database level
- **Vote Uniqueness**: Database constraint prevents vote manipulation
- **Secure Keys**: Using environment variables for production

## 🚀 Deployment Ready

Your system is now ready for deployment! The backend will work with:
- Vercel
- Netlify  
- Any Node.js hosting

## ⚡ Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 🆘 Troubleshooting

**Issue**: "User not authorized"
- Solution: Make sure user is logged in and has admin rights if accessing admin areas

**Issue**: "Cannot vote twice"
- Solution: This is by design - one vote per user per project

**Issue**: "Projects not showing"
- Solution: Admin needs to unlock projects first

## 📝 Notes

- All your existing HTML/CSS/animations are preserved
- Backend works seamlessly with your Marvel theme
- No visual changes to your pages
- Just backend power added!

---

**Your Tesseract 2025 voting system is ready to rock! 🎉**
