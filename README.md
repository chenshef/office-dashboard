# Office Dashboard

Secure office dashboard with Google OAuth authentication and MFA.

## Features

- 🔐 Google OAuth authentication
- 📱 MFA support via Google Authenticator
- 📧 Gmail integration (dual accounts)
- 📅 Google Calendar integration
- ✅ Google Tasks integration
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- Google OAuth credentials
- Vercel account

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```
NEXTAUTH_URL=https://office.chensheffer.com
NEXTAUTH_SECRET=your-secret-key

GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Deploy to Vercel:

```bash
vercel
```

## Authentication Flow

1. User visits office.chensheffer.com
2. Redirected to login page
3. Sign in with Google (chen@chensheffer.com)
4. MFA verification via Google Authenticator
5. Access dashboard with all integrations
