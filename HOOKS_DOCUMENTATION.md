# LinguaConnect Hooks Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication Hooks](#authentication-hooks)
3. [Data Fetching Hooks](#data-fetching-hooks)
4. [Real-time Hooks](#real-time-hooks)
5. [AI Service Hooks](#ai-service-hooks)
6. [Utility Hooks](#utility-hooks)
7. [Custom Hook Patterns](#custom-hook-patterns)
8. [Error Handling](#error-handling)
9. [Examples](#examples)

## Overview

LinguaConnect uses custom React hooks to encapsulate business logic, API calls, and state management. All hooks follow React's rules of hooks and provide a clean interface for components to interact with the application's functionality.

## Authentication Hooks

### useLogin

A custom hook for handling user authentication and login functionality.

```jsx
import useLogin from '@/hooks/useLogin'

const { login, loading, handleGoogleRedirect } = useLogin()
```

**Returns:**
- `login`: `function(identifier, password, otp?)` - Login function
- `loading`: `boolean` - Loading state
- `handleGoogleRedirect`: `function()` - Google OAuth redirect handler

**Usage:**
```jsx
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

**Features:**
- Supports email or username login
- Automatic JWT token management
- Google OAuth integration
- 2FA support
- Error handling with toast notifications
- Automatic redirect after successful login

### useSignUp

A custom hook for handling user registration.

```jsx
import useSignUp from '@/hooks/useSignUp'

const { signUp, loading } = useSignUp()
```

**Returns:**
- `signUp`: `function(userData)` - Registration function
- `loading`: `boolean` - Loading state

**Usage:**
```jsx
function SignUpForm() {
  const { signUp, loading } = useSignUp()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    await signUp(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  )
}
```

**Features:**
- Form validation
- Password confirmation
- Email verification
- Error handling
- Success notifications

## Data Fetching Hooks

### useGetConversations

A hook for fetching user conversations.

```jsx
import useGetConversations from '@/hooks/useGetConversations'

const { conversations, loading, refetch } = useGetConversations()
```

**Returns:**
- `conversations`: `Array` - List of conversations
- `loading`: `boolean` - Loading state
- `refetch`: `function()` - Function to refetch data

**Usage:**
```jsx
function ConversationList() {
  const { conversations, loading, refetch } = useGetConversations()

  if (loading) return <Spinner />

  return (
    <div>
      {conversations.map(conversation => (
        <ConversationItem 
          key={conversation._id} 
          conversation={conversation} 
        />
      ))}
    </div>
  )
}
```

**Features:**
- Automatic data fetching on mount
- Loading states
- Error handling
- Manual refetch capability

### useGetMessages

A hook for fetching messages in a conversation.

```jsx
import useGetMessages from '@/hooks/useGetMessages'

const { messages, loading, refetch } = useGetMessages(conversationId)
```

**Parameters:**
- `conversationId`: `string` - ID of the conversation

**Returns:**
- `messages`: `Array` - List of messages
- `loading`: `boolean` - Loading state
- `refetch`: `function()` - Function to refetch data

**Usage:**
```jsx
function ChatRoom({ conversationId }) {
  const { messages, loading } = useGetMessages(conversationId)

  if (loading) return <Spinner />

  return (
    <div className="messages">
      {messages.map(message => (
        <MessageItem 
          key={message._id} 
          message={message} 
        />
      ))}
    </div>
  )
}
```

**Features:**
- Pagination support
- Real-time updates integration
- Message ordering
- Loading states

## Real-time Hooks

### useListenMessages

A hook for real-time message listening using Socket.IO.

```jsx
import useListenMessages from '@/hooks/useListenMessages'

const { messages } = useListenMessages(conversationId)
```

**Parameters:**
- `conversationId`: `string` - ID of the conversation

**Returns:**
- `messages`: `Array` - Real-time updated messages

**Usage:**
```jsx
function ChatRoom({ conversationId }) {
  const { messages } = useListenMessages(conversationId)

  return (
    <div className="messages">
      {messages.map(message => (
        <MessageItem 
          key={message._id} 
          message={message} 
        />
      ))}
    </div>
  )
}
```

**Features:**
- Real-time message updates
- Automatic socket connection management
- Message ordering
- Typing indicators

### useListenNotification

A hook for real-time notification listening.

```jsx
import useListenNotification from '@/hooks/useListenNotification'

const { notifications } = useListenNotification()
```

**Returns:**
- `notifications`: `Array` - Real-time updated notifications

**Usage:**
```jsx
function NotificationBell() {
  const { notifications } = useListenNotification()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="notification-bell">
      <Icon name="bell" />
      {unreadCount > 0 && (
        <span className="badge">{unreadCount}</span>
      )}
    </div>
  )
}
```

**Features:**
- Real-time notification updates
- Unread count tracking
- Notification types (like, comment, follow, etc.)
- Automatic socket connection

### useListenAdminNotification

A hook for admin-specific real-time notifications.

```jsx
import useListenAdminNotification from '@/hooks/useListenAdminNotification'

const { adminNotifications } = useListenAdminNotification()
```

**Returns:**
- `adminNotifications`: `Array` - Admin-specific notifications

**Usage:**
```jsx
function AdminDashboard() {
  const { adminNotifications } = useListenAdminNotification()

  return (
    <div>
      <h2>Admin Notifications</h2>
      {adminNotifications.map(notification => (
        <AdminNotificationItem 
          key={notification._id} 
          notification={notification} 
        />
      ))}
    </div>
  )
}
```

**Features:**
- Admin-specific notifications
- Report alerts
- User management notifications
- System alerts

## AI Service Hooks

### useTranslateMessage

A hook for AI-powered message translation.

```jsx
import useTranslateMessage from '@/hooks/useTranslateMessage'

const { translateMessage, loading } = useTranslateMessage()
```

**Returns:**
- `translateMessage`: `function(messageData, targetLanguage)` - Translation function
- `loading`: `boolean` - Loading state

**Usage:**
```jsx
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

**Features:**
- AI-powered translation
- Context-aware translation
- Multiple language support
- Error handling

### useCheckGrammar

A hook for AI-powered grammar checking.

```jsx
import useCheckGrammar from '@/hooks/useCheckGrammar'

const { checkGrammar, loading } = useCheckGrammar()
```

**Returns:**
- `checkGrammar`: `function(text)` - Grammar check function
- `loading`: `boolean` - Loading state

**Usage:**
```jsx
function GrammarChecker() {
  const { checkGrammar, loading } = useCheckGrammar()
  const [text, setText] = useState('')
  const [grammarResult, setGrammarResult] = useState('')

  const handleCheckGrammar = async () => {
    const result = await checkGrammar(text)
    setGrammarResult(result)
  }

  return (
    <div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to check grammar..."
      />
      <Button onClick={handleCheckGrammar} disabled={loading}>
        {loading ? 'Checking...' : 'Check Grammar'}
      </Button>
      {grammarResult && (
        <div className="grammar-result">
          <h3>Grammar Check Result:</h3>
          <p>{grammarResult}</p>
        </div>
      )}
    </div>
  )
}
```

**Features:**
- AI-powered grammar checking
- Detailed feedback
- Error suggestions
- Multiple language support

### useWritingTips

A hook for AI-powered writing tips.

```jsx
import useWritingTips from '@/hooks/useWritingTips'

const { getWritingTips, loading } = useWritingTips()
```

**Returns:**
- `getWritingTips`: `function(messageData)` - Writing tips function
- `loading`: `boolean` - Loading state

**Usage:**
```jsx
function WritingAssistant({ message }) {
  const { getWritingTips, loading } = useWritingTips()
  const [tips, setTips] = useState('')

  const handleGetTips = async () => {
    const result = await getWritingTips(message)
    setTips(result)
  }

  return (
    <div>
      <Button onClick={handleGetTips} disabled={loading}>
        {loading ? 'Getting tips...' : 'Get Writing Tips'}
      </Button>
      {tips && (
        <div className="writing-tips">
          <h3>Writing Tips:</h3>
          <p>{tips}</p>
        </div>
      )}
    </div>
  )
}
```

**Features:**
- AI-powered writing suggestions
- Context-aware tips
- Style improvements
- Grammar suggestions

## Utility Hooks

### useSendMessage

A hook for sending messages in conversations.

```jsx
import useSendMessage from '@/hooks/useSendMessage'

const { sendMessage, loading } = useSendMessage()
```

**Returns:**
- `sendMessage`: `function(conversationId, messageData)` - Send message function
- `loading`: `boolean` - Loading state

**Usage:**
```jsx
function MessageInput({ conversationId }) {
  const { sendMessage, loading } = useSendMessage()
  const [message, setMessage] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    await sendMessage(conversationId, { content: message })
    setMessage('')
  }

  return (
    <form onSubmit={handleSend}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </Button>
    </form>
  )
}
```

**Features:**
- Message sending with validation
- File upload support
- Real-time updates
- Error handling

### use-mobile

A hook for detecting mobile devices.

```jsx
import useMobile from '@/hooks/use-mobile'

const isMobile = useMobile()
```

**Returns:**
- `isMobile`: `boolean` - Whether the device is mobile

**Usage:**
```jsx
function ResponsiveComponent() {
  const isMobile = useMobile()

  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {isMobile ? (
        <MobileNavigation />
      ) : (
        <DesktopNavigation />
      )}
    </div>
  )
}
```

**Features:**
- Responsive design support
- Touch device detection
- Screen size awareness
- Layout adaptation

## Custom Hook Patterns

### Error Handling Pattern

All hooks follow a consistent error handling pattern:

```jsx
const useCustomHook = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeAction = async (...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall(...args)
      return result
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { executeAction, loading, error }
}
```

### Loading State Pattern

Consistent loading state management:

```jsx
const useDataHook = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await apiCall()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
```

### Real-time Pattern

Socket.IO integration pattern:

```jsx
const useRealTimeHook = (eventName, dependencies = []) => {
  const [data, setData] = useState([])
  const { socket } = useSocketContext()

  useEffect(() => {
    if (!socket) return

    const handleEvent = (newData) => {
      setData(prev => [...prev, newData])
    }

    socket.on(eventName, handleEvent)

    return () => {
      socket.off(eventName, handleEvent)
    }
  }, [socket, eventName, ...dependencies])

  return { data }
}
```

## Error Handling

### Toast Notifications

All hooks use toast notifications for user feedback:

```jsx
import { toast } from 'react-toastify'

// Success notification
toast.success('Operation completed successfully')

// Error notification
toast.error('An error occurred')

// Warning notification
toast.warning('Please check your input')

// Info notification
toast.info('New message received')
```

### Error States

Hooks provide error states for components:

```jsx
function MyComponent() {
  const { data, loading, error } = useCustomHook()

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} />

  return <div>{/* Component content */}</div>
}
```

## Examples

### Complete Chat Component

```jsx
import useGetMessages from '@/hooks/useGetMessages'
import useSendMessage from '@/hooks/useSendMessage'
import useListenMessages from '@/hooks/useListenMessages'

function ChatComponent({ conversationId }) {
  const { messages: initialMessages, loading } = useGetMessages(conversationId)
  const { sendMessage, loading: sending } = useSendMessage()
  const { messages: realTimeMessages } = useListenMessages(conversationId)
  const [message, setMessage] = useState('')

  // Combine initial and real-time messages
  const allMessages = useMemo(() => {
    const combined = [...initialMessages, ...realTimeMessages]
    return combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [initialMessages, realTimeMessages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    await sendMessage(conversationId, { content: message })
    setMessage('')
  }

  if (loading) return <Spinner />

  return (
    <div className="chat-container">
      <div className="messages">
        {allMessages.map(msg => (
          <MessageItem key={msg._id} message={msg} />
        ))}
      </div>
      <form onSubmit={handleSend} className="message-input">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <Button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  )
}
```

### AI-Powered Writing Assistant

```jsx
import useCheckGrammar from '@/hooks/useCheckGrammar'
import useWritingTips from '@/hooks/useWritingTips'
import useTranslateMessage from '@/hooks/useTranslateMessage'

function WritingAssistant() {
  const { checkGrammar, loading: grammarLoading } = useCheckGrammar()
  const { getWritingTips, loading: tipsLoading } = useWritingTips()
  const { translateMessage, loading: translateLoading } = useTranslateMessage()
  
  const [text, setText] = useState('')
  const [grammarResult, setGrammarResult] = useState('')
  const [writingTips, setWritingTips] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('es')

  const handleCheckGrammar = async () => {
    const result = await checkGrammar(text)
    setGrammarResult(result)
  }

  const handleGetTips = async () => {
    const tips = await getWritingTips({ content: text })
    setWritingTips(tips)
  }

  const handleTranslate = async () => {
    const translated = await translateMessage({ content: text }, targetLanguage)
    setTranslatedText(translated)
  }

  return (
    <div className="writing-assistant">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        rows={6}
      />
      
      <div className="actions">
        <Button 
          onClick={handleCheckGrammar} 
          disabled={grammarLoading || !text}
        >
          {grammarLoading ? 'Checking...' : 'Check Grammar'}
        </Button>
        
        <Button 
          onClick={handleGetTips} 
          disabled={tipsLoading || !text}
        >
          {tipsLoading ? 'Getting tips...' : 'Get Writing Tips'}
        </Button>
        
        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleTranslate} 
          disabled={translateLoading || !text}
        >
          {translateLoading ? 'Translating...' : 'Translate'}
        </Button>
      </div>

      {grammarResult && (
        <div className="result-section">
          <h3>Grammar Check:</h3>
          <p>{grammarResult}</p>
        </div>
      )}

      {writingTips && (
        <div className="result-section">
          <h3>Writing Tips:</h3>
          <p>{writingTips}</p>
        </div>
      )}

      {translatedText && (
        <div className="result-section">
          <h3>Translation:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  )
}
```

This documentation provides comprehensive information about all custom hooks in the LinguaConnect platform. Each hook is designed to be reusable, maintainable, and follows React best practices. For implementation details and specific use cases, refer to the source code or contact the development team.