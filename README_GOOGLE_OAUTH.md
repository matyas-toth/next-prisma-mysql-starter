# Google OAuth Implementation

## 🚀 Complete Google OAuth Integration

This implementation provides seamless Google authentication with automatic user creation and account linking.

## ✨ Features

- **🔐 Seamless Authentication**: Users can sign in with Google on both login and register pages
- **👤 Auto User Creation**: New Google users are automatically created in the database
- **🔗 Account Linking**: Existing users can link their Google accounts
- **📧 Email Verification**: Google accounts are automatically email verified
- **🛡️ Secure Token Verification**: Server-side validation of Google ID tokens
- **🎨 Beautiful UI**: Integrated with shadcn/ui components
- **📱 Responsive Design**: Works on all devices

## 🏗️ Architecture

### Frontend Components
- `GoogleAuthButton.tsx` - Reusable Google OAuth button component
- `AuthForm.tsx` - Updated to include Google authentication
- Google Identity Services integration

### Backend API
- `POST /api/auth/google` - Handles Google OAuth verification and user creation
- Server-side token validation using Google Auth Library
- Automatic user creation and account linking

### Database Integration
- Users can have both password and Google authentication
- Google profile data is synced (name, avatar, email)
- Username generation for Google users

## 🔧 Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
```

### 2. Google Cloud Console

1. **Create OAuth 2.0 Credentials**
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Set application type to "Web application"

2. **Configure Authorized Redirect URIs**
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. **Configure Authorized JavaScript Origins**
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

4. **OAuth Consent Screen**
   - Add required scopes: `email`, `profile`, `openid`
   - Configure app information and privacy policy

### 3. Install Dependencies

```bash
npm install google-auth-library
```

## 🎯 How It Works

### User Flow
1. User clicks "Continue with Google" button
2. Google OAuth popup appears
3. User selects Google account and grants permissions
4. Google returns ID token with user information
5. Backend verifies token and extracts user data
6. User is created/updated in database if needed
7. JWT token is generated and user is logged in
8. User is redirected to dashboard

### Technical Flow
1. **Frontend**: Loads Google Identity Services
2. **Frontend**: Initializes Google OAuth with client ID
3. **Frontend**: Prompts user for account selection
4. **Frontend**: Sends ID token to backend
5. **Backend**: Verifies token with Google
6. **Backend**: Extracts user information from token
7. **Backend**: Creates or updates user in database
8. **Backend**: Generates JWT token
9. **Frontend**: Stores token and updates user context
10. **Frontend**: Redirects to dashboard

## 🧪 Testing

### Test Page
Visit `/test-google` to test the Google OAuth integration in isolation.

### Manual Testing
1. Start development server: `npm run dev`
2. Go to `/login` or `/register`
3. Click "Continue with Google"
4. Select a Google account
5. Verify you're logged in and redirected to dashboard

## 🔒 Security Features

- **Token Verification**: Server-side validation of Google ID tokens
- **HTTPS Required**: Production requires HTTPS for OAuth
- **Scope Validation**: Only requests necessary user information
- **Error Handling**: Proper error messages and fallbacks
- **Account Linking**: Secure linking of Google accounts to existing users

## 🚀 Production Deployment

### Environment Setup
1. Set production environment variables
2. Update Google Cloud Console with production URLs
3. Configure OAuth consent screen for production
4. Test OAuth flow in production environment

### Security Checklist
- [ ] HTTPS enabled
- [ ] Production redirect URIs configured
- [ ] OAuth consent screen approved
- [ ] Environment variables secured
- [ ] Error handling tested

## 📝 API Reference

### POST /api/auth/google

**Request Body:**
```json
{
  "idToken": "google-id-token"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "fullName": "Full Name",
    "role": "USER",
    "is2faEnabled": false
  },
  "token": "jwt-token"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Google authentication is not available"**
   - Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
   - Verify Google Identity Services script is loaded

2. **"Invalid Google token"**
   - Check if `GOOGLE_CLIENT_ID` matches the token audience
   - Verify token hasn't expired

3. **Redirect URI mismatch**
   - Ensure redirect URIs in Google Cloud Console match your domain
   - Check for trailing slashes and protocol (http vs https)

4. **OAuth consent screen issues**
   - Verify app is configured in OAuth consent screen
   - Check if user is added to test users (for development)

### Debug Mode
Enable debug logging by adding to your environment:
```env
DEBUG=google-oauth
```

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor OAuth consent screen status
- Update redirect URIs when changing domains
- Review and rotate client secrets periodically
- Monitor for Google API changes

### Version Updates
- Keep `google-auth-library` updated
- Monitor Google Identity Services changes
- Test OAuth flow after updates

## 📚 Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Auth Library for Node.js](https://github.com/googleapis/google-auth-library-nodejs)
