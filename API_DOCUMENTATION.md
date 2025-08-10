# LinguaConnect API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Backend APIs](#backend-apis)
4. [AI/ML Service APIs](#aiml-service-apis)
5. [Frontend Components](#frontend-components)
6. [Frontend Hooks](#frontend-hooks)
7. [Frontend Utilities](#frontend-utilities)
8. [Error Handling](#error-handling)
9. [Examples](#examples)

## Overview

LinguaConnect is a social networking platform for language learners with the following architecture:

- **Frontend**: React.js with Vite, Zustand for state management
- **Backend**: Node.js with Express.js and MongoDB
- **AI Service**: Flask with LangChain for AI-powered features
- **Real-time**: Socket.IO for live messaging and notifications

## Authentication

### JWT Token Management

The application uses JWT tokens for authentication with automatic refresh:

```javascript
// Token storage
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);

// Automatic token refresh via axios interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.data.message === "Access token has expired") {
            // Automatically refresh token and retry request
        }
    }
);
```

## Backend APIs

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication APIs

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "full_name": "string"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "user": {
            "_id": "string",
            "username": "string",
            "email": "string",
            "full_name": "string"
        }
    }
}
```

#### POST /auth/login
Authenticate user and receive access tokens.

**Request Body:**
```json
{
    "identifier": "string", // email or username
    "password": "string",
    "otp": "string" // optional for 2FA
}
```

**Response:**
```json
{
    "status": "success",
    "message": "User logged in successfully",
    "data": {
        "user": {
            "_id": "string",
            "username": "string",
            "email": "string"
        },
        "accessToken": "string",
        "refreshToken": "string"
    }
}
```

#### POST /auth/refresh-token
Refresh expired access token.

**Request Body:**
```json
{
    "refreshToken": "string"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Access token refreshed successfully",
    "data": {
        "accessToken": "string"
    }
}
```

#### GET /auth/confirm
Confirm email address with token.

**Query Parameters:**
- `token`: Email confirmation token

#### POST /auth/change-password
Change user password (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "currentPassword": "string",
    "newPassword": "string"
}
```

#### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
    "email": "string"
}
```

#### POST /auth/reset-password
Reset password with reset token.

**Request Body:**
```json
{
    "token": "string",
    "newPassword": "string"
}
```

#### GET /auth/enable-2fa
Enable two-factor authentication (requires authentication).

#### GET /auth/disable-2fa
Disable two-factor authentication (requires authentication).

#### GET /auth/google
Initiate Google OAuth login.

#### GET /auth/google/redirect
Google OAuth callback handler.

### User APIs

#### GET /user
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "user": {
            "_id": "string",
            "username": "string",
            "email": "string",
            "full_name": "string",
            "avatar": "string",
            "bio": "string",
            "languages": ["string"],
            "followers": ["string"],
            "following": ["string"]
        }
    }
}
```

#### POST /user
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "full_name": "string",
    "bio": "string",
    "languages": ["string"]
}
```

#### GET /user/profile/:id
Get user profile by ID (requires authentication).

**Parameters:**
- `id`: User ID

#### PATCH /user/follow/:id
Follow/unfollow a user (requires authentication).

**Parameters:**
- `id`: User ID to follow/unfollow

#### PATCH /user/profile/avatar
Update user avatar (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with image file
```

#### GET /user/topics
Get available language learning topics.

### Post APIs

#### GET /post
Get all posts (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`: Page number (optional)
- `limit`: Posts per page (optional)

#### POST /post
Create a new post (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with:
- content: string
- images: File[] (optional)
```

#### GET /post/:id
Get post by ID (requires authentication).

**Parameters:**
- `id`: Post ID

#### PATCH /post/:id
Update post (requires authentication).

**Parameters:**
- `id`: Post ID

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### DELETE /post/:id
Delete post (requires authentication).

**Parameters:**
- `id`: Post ID

#### PATCH /post/:id/like
Like/unlike a post (requires authentication).

**Parameters:**
- `id`: Post ID

#### PATCH /post/:id/report
Report a post (requires authentication).

**Parameters:**
- `id`: Post ID

#### GET /post/user/:userId
Get posts by user ID (requires authentication).

**Parameters:**
- `userId`: User ID

#### GET /post/following
Get posts from followed users (requires authentication).

#### GET /post/likes
Get posts sorted by likes (requires authentication).

#### GET /post/comments
Get posts sorted by comments (requires authentication).

### Comment APIs

#### GET /comment/:postId
Get comments for a post (requires authentication).

**Parameters:**
- `postId`: Post ID

#### POST /comment/:postId
Add comment to a post (requires authentication).

**Parameters:**
- `postId`: Post ID

**Request Body:**
```json
{
    "content": "string"
}
```

#### PATCH /comment/:id
Update comment (requires authentication).

**Parameters:**
- `id`: Comment ID

#### DELETE /comment/:id
Delete comment (requires authentication).

**Parameters:**
- `id`: Comment ID

### Message APIs

#### GET /message/:conversationId
Get messages for a conversation (requires authentication).

**Parameters:**
- `conversationId`: Conversation ID

#### POST /message/:conversationId
Send a message (requires authentication).

**Parameters:**
- `conversationId`: Conversation ID

**Request Body:**
```json
{
    "content": "string",
    "type": "text" // text, image, file
}
```

### Group APIs

#### GET /group
Get all groups (requires authentication).

#### POST /group
Create a new group (requires authentication).

**Request Body:**
```json
{
    "name": "string",
    "description": "string",
    "language": "string",
    "isPrivate": boolean
}
```

#### GET /group/:id
Get group by ID (requires authentication).

#### PATCH /group/:id
Update group (requires authentication).

#### DELETE /group/:id
Delete group (requires authentication).

#### POST /group/:id/join
Join a group (requires authentication).

#### POST /group/:id/leave
Leave a group (requires authentication).

### Notification APIs

#### GET /notification
Get user notifications (requires authentication).

#### PATCH /notification/:id/read
Mark notification as read (requires authentication).

### Admin APIs

#### GET /admin/users
Get all users (admin only).

#### PATCH /admin/users/:id/ban
Ban/unban user (admin only).

#### GET /admin/posts
Get all posts (admin only).

#### DELETE /admin/posts/:id
Delete post (admin only).

#### GET /admin/reports
Get reported content (admin only).

## AI/ML Service APIs

### Base URL
```
http://localhost:5555
```

### POST /translate
Translate message content using AI.

**Request Body:**
```json
{
    "sender_id": "string",
    "recipient_id": "string",
    "content": "string",
    "language": "string"
}
```

**Response:**
```json
{
    "message": "translated_content"
}
```

### POST /check_grammar
Check grammar of text content.

**Request Body:**
```json
{
    "user_id": "string",
    "text": "string"
}
```

**Response:**
```json
{
    "message": "grammar_check_result"
}
```

### POST /writing_tips
Get AI-powered writing tips.

**Request Body:**
```json
{
    "sender_id": "string",
    "recipient_id": "string",
    "content": "string"
}
```

**Response:**
```json
{
    "message": "writing_tips"
}
```

### POST /check_content
Check content safety and appropriateness.

**Request Body:**
```json
{
    "content": "string"
}
```

**Response:**
```json
{
    "status": "success",
    "result": {
        "is_safe": boolean,
        "confidence": number,
        "flagged_content": ["string"]
    }
}
```

## Frontend Components

### UI Components (Shadcn/UI)

#### Button
```jsx
import { Button } from "@/components/ui/button"

// Usage
<Button variant="default" size="default">
  Click me
</Button>

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
```

#### Input
```jsx
import { Input } from "@/components/ui/input"

// Usage
<Input type="text" placeholder="Enter text" />
```

#### Avatar
```jsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Usage
<Avatar>
  <AvatarImage src="/path/to/image.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### Dialog
```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Usage
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    Content here
  </DialogContent>
</Dialog>
```

#### Card
```jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content
  </CardContent>
</Card>
```

### Custom Components

#### Post Component
```jsx
import Post from '@/components/posts/Post'

// Usage
<Post post={postData} />

// Props:
// - post: Object containing post data
//   - _id: string
//   - content: string
//   - images: string[]
//   - user: Object
//   - likes: string[]
//   - createdAt: Date
```

#### AvatarCustom Component
```jsx
import AvatarCustom from '@/components/avatar/AvatarCustom'

// Usage
<AvatarCustom user={userData} className="custom-class" />

// Props:
// - user: Object containing user data
// - className: string (optional)
```

#### Reaction Component
```jsx
import Reaction from '@/components/reaction/Reaction'

// Usage
<Reaction 
  post={postData}
  isLiked={boolean}
  handleLike={function}
  className="custom-class"
/>

// Props:
// - post: Object containing post data
// - isLiked: boolean
// - handleLike: function
// - className: string (optional)
```

## Frontend Hooks

### useLogin
Custom hook for user authentication.

```jsx
import useLogin from '@/hooks/useLogin'

const { login, loading, handleGoogleRedirect } = useLogin()

// Usage
const handleLogin = async () => {
  await login(email, password)
}

// Returns:
// - login: function(identifier, password, otp)
// - loading: boolean
// - handleGoogleRedirect: function
```

### useSignUp
Custom hook for user registration.

```jsx
import useSignUp from '@/hooks/useSignUp'

const { signUp, loading } = useSignUp()

// Usage
const handleSignUp = async () => {
  await signUp(userData)
}

// Returns:
// - signUp: function(userData)
// - loading: boolean
```

### useSendMessage
Custom hook for sending messages.

```jsx
import useSendMessage from '@/hooks/useSendMessage'

const { sendMessage, loading } = useSendMessage()

// Usage
const handleSendMessage = async () => {
  await sendMessage(conversationId, messageData)
}

// Returns:
// - sendMessage: function(conversationId, messageData)
// - loading: boolean
```

### useTranslateMessage
Custom hook for translating messages.

```jsx
import useTranslateMessage from '@/hooks/useTranslateMessage'

const { translateMessage, loading } = useTranslateMessage()

// Usage
const handleTranslate = async () => {
  const translated = await translateMessage(messageData, targetLanguage)
}

// Returns:
// - translateMessage: function(messageData, targetLanguage)
// - loading: boolean
```

### useCheckGrammar
Custom hook for grammar checking.

```jsx
import useCheckGrammar from '@/hooks/useCheckGrammar'

const { checkGrammar, loading } = useCheckGrammar()

// Usage
const handleCheckGrammar = async () => {
  const result = await checkGrammar(text)
}

// Returns:
// - checkGrammar: function(text)
// - loading: boolean
```

### useWritingTips
Custom hook for getting writing tips.

```jsx
import useWritingTips from '@/hooks/useWritingTips'

const { getWritingTips, loading } = useWritingTips()

// Usage
const handleGetTips = async () => {
  const tips = await getWritingTips(messageData)
}

// Returns:
// - getWritingTips: function(messageData)
// - loading: boolean
```

### useGetConversations
Custom hook for fetching conversations.

```jsx
import useGetConversations from '@/hooks/useGetConversations'

const { conversations, loading, refetch } = useGetConversations()

// Returns:
// - conversations: Array
// - loading: boolean
// - refetch: function
```

### useGetMessages
Custom hook for fetching messages.

```jsx
import useGetMessages from '@/hooks/useGetMessages'

const { messages, loading, refetch } = useGetMessages(conversationId)

// Returns:
// - messages: Array
// - loading: boolean
// - refetch: function
```

### useListenMessages
Custom hook for real-time message listening.

```jsx
import useListenMessages from '@/hooks/useListenMessages'

const { messages } = useListenMessages(conversationId)

// Returns:
// - messages: Array (real-time updates)
```

### useListenNotification
Custom hook for real-time notifications.

```jsx
import useListenNotification from '@/hooks/useListenNotification'

const { notifications } = useListenNotification()

// Returns:
// - notifications: Array (real-time updates)
```

### useListenAdminNotification
Custom hook for admin real-time notifications.

```jsx
import useListenAdminNotification from '@/hooks/useListenAdminNotification'

const { adminNotifications } = useListenAdminNotification()

// Returns:
// - adminNotifications: Array (real-time updates)
```

### use-mobile
Custom hook for mobile device detection.

```jsx
import useMobile from '@/hooks/use-mobile'

const isMobile = useMobile()

// Returns:
// - isMobile: boolean
```

## Frontend Utilities

### axiosClient
Configured axios instance with automatic token management.

```jsx
import axiosClient from '@/api/axiosClient'

// Features:
// - Automatic JWT token inclusion
// - Automatic token refresh
// - Error handling
// - Base URL configuration

// Usage
const response = await axiosClient.get('/user')
const response = await axiosClient.post('/post', data)
```

### Zustand Stores

#### usePostZ
Post management store.

```jsx
import usePostZ from '@/zustand/usePostZ'

const { 
  posts, 
  likePost, 
  createPost, 
  editPost, 
  deletePost, 
  reportPost 
} = usePostZ()

// Actions:
// - likePost: function(postId, userId)
// - createPost: function(postData)
// - editPost: function(postId, postData)
// - deletePost: function(postId)
// - reportPost: function(postId)
```

## Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

### Error Response Format

```json
{
    "status": "error",
    "message": "Error description",
    "error": "Detailed error information"
}
```

### Frontend Error Handling

```jsx
// Using toast notifications
import { toast } from 'react-toastify'

try {
  const response = await apiCall()
  toast.success('Success message')
} catch (error) {
  toast.error(error.response?.data?.message || 'An error occurred')
}
```

## Examples

### Complete Login Flow

```jsx
import useLogin from '@/hooks/useLogin'

function LoginForm() {
  const { login, loading } = useLogin()
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(formData.identifier, formData.password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Email or Username"
        value={formData.identifier}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          identifier: e.target.value
        }))}
      />
      <Input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          password: e.target.value
        }))}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
```

### Creating a Post

```jsx
import usePostZ from '@/zustand/usePostZ'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function CreatePost() {
  const { createPost } = usePostZ()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('content', content)
    images.forEach(image => {
      formData.append('images', image)
    })
    
    await createPost(formData)
    setContent('')
    setImages([])
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files))}
      />
      <Button type="submit">Post</Button>
    </form>
  )
}
```

### Real-time Messaging

```jsx
import useSendMessage from '@/hooks/useSendMessage'
import useGetMessages from '@/hooks/useGetMessages'
import useListenMessages from '@/hooks/useListenMessages'

function ChatRoom({ conversationId }) {
  const { messages } = useGetMessages(conversationId)
  const { sendMessage, loading } = useSendMessage()
  const realTimeMessages = useListenMessages(conversationId)
  const [message, setMessage] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    await sendMessage(conversationId, { content: message })
    setMessage('')
  }

  return (
    <div>
      <div className="messages">
        {realTimeMessages.map(msg => (
          <div key={msg._id}>{msg.content}</div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </div>
  )
}
```

### AI Translation

```jsx
import useTranslateMessage from '@/hooks/useTranslateMessage'

function TranslationComponent({ message, targetLanguage }) {
  const { translateMessage, loading } = useTranslateMessage()
  const [translatedText, setTranslatedText] = useState('')

  const handleTranslate = async () => {
    const result = await translateMessage(message, targetLanguage)
    setTranslatedText(result)
  }

  return (
    <div>
      <p>Original: {message}</p>
      <Button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </Button>
      {translatedText && <p>Translated: {translatedText}</p>}
    </div>
  )
}
```

This documentation provides a comprehensive overview of all public APIs, functions, and components in the LinguaConnect platform. For more detailed implementation examples or specific use cases, refer to the source code or contact the development team.