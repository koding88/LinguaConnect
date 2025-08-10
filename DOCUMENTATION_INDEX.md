# LinguaConnect Documentation Index

## Overview

Welcome to the comprehensive documentation for LinguaConnect, a premier social networking platform designed for language learners. This documentation provides detailed information about all public APIs, functions, components, and usage patterns.

## Documentation Structure

### 📚 Main Documentation Files

1. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
2. **[COMPONENT_DOCUMENTATION.md](./COMPONENT_DOCUMENTATION.md)** - UI components guide
3. **[HOOKS_DOCUMENTATION.md](./HOOKS_DOCUMENTATION.md)** - Custom hooks reference
4. **[README.md](./README.md)** - Project overview and setup

### 🏗️ Architecture Overview

LinguaConnect is built with a modern, scalable architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Service    │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│   (Flask)       │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Express.js    │    │ • Flask         │
│ • Vite          │    │ • MongoDB       │    │ • LangChain     │
│ • Zustand       │    │ • Socket.IO     │    │ • Together AI   │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Python 3.11   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start Guide

### 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/koding88/LinguaConnect
   cd LinguaConnect
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   # Configure .env file
   npm run prod
   ```

3. **Set up the AI service**
   ```bash
   cd flask_app
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   # Configure .env file
   python run.py
   ```

4. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   # Configure .env file
   npm run build
   serve -s dist -l 5173
   ```

### 🔧 Environment Configuration

#### Backend (.env)
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# ... see README.md for complete list
```

#### AI Service (.env)
```env
FLASK_APP=app
MONGO_URI=your_mongodb_uri
TOGETHER_API_KEY=your_together_ai_key
```

#### Frontend (.env)
```env
VITE_API_BACKEND_URL=http://localhost:3000
VITE_AI_URL=http://localhost:5555
```

## API Reference Quick Guide

### 🔐 Authentication

```javascript
// Login
POST /api/v1/auth/login
{
  "identifier": "email@example.com",
  "password": "password123"
}

// Register
POST /api/v1/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

### 👤 User Management

```javascript
// Get current user
GET /api/v1/user
Authorization: Bearer <token>

// Update profile
POST /api/v1/user
{
  "full_name": "John Doe",
  "bio": "Language learner",
  "languages": ["English", "Spanish"]
}
```

### 📝 Posts

```javascript
// Create post
POST /api/v1/post
Content-Type: multipart/form-data
{
  "content": "Hello world!",
  "images": [File1, File2]
}

// Get posts
GET /api/v1/post
GET /api/v1/post/following
GET /api/v1/post/likes
```

### 💬 Messaging

```javascript
// Send message
POST /api/v1/message/:conversationId
{
  "content": "Hello!",
  "type": "text"
}

// Get messages
GET /api/v1/message/:conversationId
```

### 🤖 AI Services

```javascript
// Translate message
POST http://localhost:5555/translate
{
  "sender_id": "user_id",
  "recipient_id": "recipient_id",
  "content": "Hello",
  "language": "es"
}

// Check grammar
POST http://localhost:5555/check_grammar
{
  "user_id": "user_id",
  "text": "I am learning english"
}
```

## Component Usage Quick Guide

### 🎨 UI Components

```jsx
// Button with variants
<Button variant="default" size="lg">
  Click me
</Button>

// Form inputs
<Input type="email" placeholder="Enter email" />
<Textarea placeholder="Enter message" />

// Cards
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### 🧩 Custom Components

```jsx
// Post component
<Post post={postData} />

// Avatar with user data
<AvatarCustom user={userData} />

// Reaction component
<Reaction 
  post={postData}
  isLiked={true}
  handleLike={handleLike}
/>
```

## Hooks Usage Quick Guide

### 🔐 Authentication Hooks

```jsx
// Login hook
const { login, loading } = useLogin()
await login(email, password)

// Sign up hook
const { signUp, loading } = useSignUp()
await signUp(userData)
```

### 📡 Data Fetching Hooks

```jsx
// Get conversations
const { conversations, loading } = useGetConversations()

// Get messages
const { messages, loading } = useGetMessages(conversationId)

// Send message
const { sendMessage, loading } = useSendMessage()
await sendMessage(conversationId, messageData)
```

### 🔄 Real-time Hooks

```jsx
// Real-time messages
const { messages } = useListenMessages(conversationId)

// Real-time notifications
const { notifications } = useListenNotification()
```

### 🤖 AI Service Hooks

```jsx
// Translation
const { translateMessage, loading } = useTranslateMessage()
const translated = await translateMessage(message, 'es')

// Grammar check
const { checkGrammar, loading } = useCheckGrammar()
const result = await checkGrammar(text)

// Writing tips
const { getWritingTips, loading } = useWritingTips()
const tips = await getWritingTips(message)
```

## Development Guidelines

### 📝 Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: ESLint configuration
- **Python**: PEP 8 style guide

### 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# AI service tests
cd flask_app
python -m pytest
```

### 🚀 Deployment

#### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

#### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy with environment variables
```

#### AI Service (Railway/Heroku)
```bash
cd flask_app
# Deploy with requirements.txt and environment variables
```

## Common Patterns

### 🔄 State Management

```jsx
// Zustand store usage
import usePostZ from '@/zustand/usePostZ'

const { posts, createPost, likePost } = usePostZ()
```

### 🌐 API Calls

```jsx
// Using axiosClient
import axiosClient from '@/api/axiosClient'

const response = await axiosClient.get('/user')
const response = await axiosClient.post('/post', formData)
```

### 🔐 Authentication Flow

```jsx
// Automatic token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.data.message === "Access token has expired") {
      // Automatic token refresh and retry
    }
  }
)
```

### 📱 Responsive Design

```jsx
// Mobile detection
import useMobile from '@/hooks/use-mobile'

const isMobile = useMobile()
return isMobile ? <MobileLayout /> : <DesktopLayout />
```

## Troubleshooting

### 🔧 Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration includes frontend URL
   - Check environment variables

2. **Socket.IO Connection Issues**
   - Verify Socket.IO server is running
   - Check client configuration

3. **AI Service Errors**
   - Verify Together AI API key
   - Check MongoDB connection

4. **Authentication Issues**
   - Clear localStorage tokens
   - Check JWT secret configuration

### 📞 Support

For additional support:
- Check the [README.md](./README.md) for setup instructions
- Review the detailed API documentation in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Examine component examples in [COMPONENT_DOCUMENTATION.md](./COMPONENT_DOCUMENTATION.md)
- Reference hook patterns in [HOOKS_DOCUMENTATION.md](./HOOKS_DOCUMENTATION.md)

## Demo Accounts

Use these pre-configured accounts for testing:

| Email                      | Username   | Password   | Role  |
|----------------------------|------------|------------|-------|
| 24283032@hulas.co          | admin      | 1234567aB  | Admin |
| swalker@yahoo.com          | linda26    | 1234567aB  | User  |
| john63@hotmail.com         | david55    | 1234567aB  | User  |
| williamspamela@gmail.com   | crystal13  | 1234567aB  | User  |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

**LinguaConnect** - Connecting language learners across the globe with AI-powered assistance.

For more information, visit the [main repository](https://github.com/koding88/LinguaConnect).