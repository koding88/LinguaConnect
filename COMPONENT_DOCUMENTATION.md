# LinguaConnect Component Documentation

## Table of Contents
1. [Overview](#overview)
2. [UI Components (Shadcn/UI)](#ui-components-shadcnui)
3. [Custom Components](#custom-components)
4. [Layout Components](#layout-components)
5. [Form Components](#form-components)
6. [Navigation Components](#navigation-components)
7. [Data Display Components](#data-display-components)
8. [Feedback Components](#feedback-components)
9. [Utility Components](#utility-components)

## Overview

LinguaConnect uses a combination of Shadcn/UI components and custom components built specifically for the platform. All components are built with React and styled using Tailwind CSS.

## UI Components (Shadcn/UI)

### Button Component

A versatile button component with multiple variants and sizes.

```jsx
import { Button } from "@/components/ui/button"

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// With loading state
<Button disabled={loading}>
  {loading ? "Loading..." : "Submit"}
</Button>
```

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `asChild`: boolean - Render as child component
- `disabled`: boolean
- `className`: string

### Input Component

A styled input component for form inputs.

```jsx
import { Input } from "@/components/ui/input"

// Basic usage
<Input type="text" placeholder="Enter text" />

// With different types
<Input type="email" placeholder="Enter email" />
<Input type="password" placeholder="Enter password" />
<Input type="number" placeholder="Enter number" />

// With validation states
<Input 
  type="text" 
  className={error ? "border-red-500" : ""}
  placeholder="Enter text" 
/>
```

**Props:**
- `type`: string - HTML input type
- `placeholder`: string
- `value`: string
- `onChange`: function
- `disabled`: boolean
- `className`: string

### Textarea Component

A styled textarea component for multi-line text input.

```jsx
import { Textarea } from "@/components/ui/textarea"

// Basic usage
<Textarea placeholder="Enter your message" />

// With rows
<Textarea 
  placeholder="Enter your message" 
  rows={4}
/>
```

**Props:**
- `placeholder`: string
- `value`: string
- `onChange`: function
- `rows`: number
- `disabled`: boolean
- `className`: string

### Avatar Component

A component for displaying user avatars with fallback.

```jsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Basic usage
<Avatar>
  <AvatarImage src="/path/to/image.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// With custom fallback
<Avatar>
  <AvatarImage src="/path/to/image.jpg" alt="User" />
  <AvatarFallback>John Doe</AvatarFallback>
</Avatar>
```

**Props:**
- `className`: string

### Card Components

A set of components for creating card layouts.

```jsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>

// Simple card
<Card>
  <CardContent className="p-6">
    <p>Simple card content</p>
  </CardContent>
</Card>
```

**Props:**
- `className`: string

### Dialog Component

A modal dialog component for overlays and popups.

```jsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"

// Basic dialog
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>

// Controlled dialog
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Controlled Dialog</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

**Props:**
- `open`: boolean
- `onOpenChange`: function
- `className`: string

### Select Component

A styled select dropdown component.

```jsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// Basic select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>

// Controlled select
const [value, setValue] = useState("")

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Props:**
- `value`: string
- `onValueChange`: function
- `disabled`: boolean

### Checkbox Component

A styled checkbox component.

```jsx
import { Checkbox } from "@/components/ui/checkbox"

// Basic checkbox
<Checkbox />

// Controlled checkbox
const [checked, setChecked] = useState(false)

<Checkbox 
  checked={checked} 
  onCheckedChange={setChecked}
/>

// With label
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">Accept terms and conditions</label>
</div>
```

**Props:**
- `checked`: boolean
- `onCheckedChange`: function
- `disabled`: boolean

### Switch Component

A toggle switch component.

```jsx
import { Switch } from "@/components/ui/switch"

// Basic switch
<Switch />

// Controlled switch
const [enabled, setEnabled] = useState(false)

<Switch 
  checked={enabled} 
  onCheckedChange={setEnabled}
/>

// With label
<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <label htmlFor="airplane-mode">Airplane Mode</label>
</div>
```

**Props:**
- `checked`: boolean
- `onCheckedChange`: function
- `disabled`: boolean

### Tabs Component

A tabbed interface component.

```jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Basic tabs
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings content
  </TabsContent>
  <TabsContent value="password">
    Password settings content
  </TabsContent>
</Tabs>
```

**Props:**
- `defaultValue`: string
- `value`: string
- `onValueChange`: function
- `className`: string

### Table Component

A styled table component.

```jsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

// Basic table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>User</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Props:**
- `className`: string

### Form Components

A set of components for building forms with validation.

```jsx
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"

// Form with validation
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    username: "",
    email: "",
  },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="Enter username" {...field} />
          </FormControl>
          <FormDescription>
            This is your public display name.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Custom Components

### Post Component

A component for displaying individual posts with interactions.

```jsx
import Post from '@/components/posts/Post'

// Usage
<Post post={postData} />

// Props:
// - post: Object containing:
//   - _id: string
//   - content: string
//   - images: string[]
//   - user: Object
//     - _id: string
//     - username: string
//     - avatar: string
//   - likes: string[]
//   - comments: Array
//   - createdAt: Date
```

**Features:**
- User avatar and name display
- Post content and images
- Like/unlike functionality
- Comment system
- Edit/delete options for post owner
- Report functionality
- Responsive design

### AvatarCustom Component

A custom avatar component with user data integration.

```jsx
import AvatarCustom from '@/components/avatar/AvatarCustom'

// Usage
<AvatarCustom user={userData} className="custom-class" />

// Props:
// - user: Object containing user data
//   - _id: string
//   - username: string
//   - avatar: string
//   - full_name: string
// - className: string (optional)
```

**Features:**
- Automatic fallback to user initials
- Image loading with error handling
- Responsive sizing
- Custom styling support

### Reaction Component

A component for post reactions (likes, comments, shares).

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
// - isLiked: boolean - Current like state
// - handleLike: function - Like/unlike handler
// - className: string (optional)
```

**Features:**
- Like/unlike functionality
- Like count display
- Comment count display
- Share functionality
- Animated interactions

### DropdownCustom Component

A custom dropdown menu for post actions.

```jsx
import DropdownCustom from '@/components/dropdown/DropdownCustom'

// Usage
<DropdownCustom
  owner={postOwnerId}
  post={postData}
  canEdit={true}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onReport={handleReport}
/>

// Props:
// - owner: string - Post owner ID
// - post: Object - Post data
// - canEdit: boolean - Whether current user can edit
// - onEdit: function - Edit handler
// - onDelete: function - Delete handler
// - onReport: function - Report handler
```

**Features:**
- Context-aware menu items
- Edit/delete options for post owner
- Report option for non-owners
- Confirmation dialogs
- Responsive design

### ListImage Component

A component for displaying multiple images in a grid layout.

```jsx
import ListImage from '@/components/posts/ListImage'

// Usage
<ListImage {...postData} />

// Props:
// - images: string[] - Array of image URLs
```

**Features:**
- Responsive grid layout
- Image optimization
- Lazy loading
- Click to expand
- Multiple image count display

### Name Component

A component for displaying user names with links.

```jsx
import Name from '@/components/avatar/Name'

// Usage
<Name {...userData} className="custom-class" />

// Props:
// - user: Object containing user data
//   - _id: string
//   - username: string
//   - full_name: string
// - className: string (optional)
```

**Features:**
- Clickable user profile links
- Username and full name display
- Custom styling support
- Responsive design

## Layout Components

### Header Component

The main navigation header component.

```jsx
import Header from '@/components/header/Header'

// Usage
<Header />

// Features:
// - Logo and branding
// - Navigation menu
// - User profile dropdown
// - Search functionality
// - Mobile responsive menu
```

### Sidebar Component

A sidebar navigation component.

```jsx
import Sidebar from '@/components/layout/Sidebar'

// Usage
<Sidebar />

// Features:
// - Navigation links
// - User profile section
// - Collapsible design
// - Mobile responsive
```

## Form Components

### LoginForm Component

A complete login form component.

```jsx
import LoginForm from '@/components/auth/LoginForm'

// Usage
<LoginForm />

// Features:
// - Email/username input
// - Password input
// - Remember me checkbox
// - Forgot password link
// - Google OAuth integration
// - Form validation
// - Loading states
```

### SignUpForm Component

A complete registration form component.

```jsx
import SignUpForm from '@/components/auth/SignUpForm'

// Usage
<SignUpForm />

// Features:
// - Username input
// - Email input
// - Password input
// - Confirm password
// - Terms acceptance
// - Form validation
// - Loading states
```

## Navigation Components

### NavigationMenu Component

A navigation menu component.

```jsx
import NavigationMenu from '@/components/navigation/NavigationMenu'

// Usage
<NavigationMenu />

// Features:
// - Responsive design
// - Dropdown menus
// - Active state highlighting
// - Mobile hamburger menu
```

## Data Display Components

### UserList Component

A component for displaying lists of users.

```jsx
import UserList from '@/components/user/UserList'

// Usage
<UserList users={usersArray} />

// Props:
// - users: Array of user objects
// - onUserClick: function (optional)
// - showFollowButton: boolean (optional)
```

### PostList Component

A component for displaying lists of posts.

```jsx
import PostList from '@/components/posts/PostList'

// Usage
<PostList posts={postsArray} />

// Props:
// - posts: Array of post objects
// - loading: boolean (optional)
// - onLoadMore: function (optional)
```

## Feedback Components

### Spinner Component

A loading spinner component.

```jsx
import Spinner from '@/components/Spinner'

// Usage
<Spinner />

// Props:
// - size: "sm" | "md" | "lg" (optional)
// - className: string (optional)
```

### SpinnerTop Component

A top-loading spinner for page loads.

```jsx
import SpinnerTop from '@/components/SpinnerTop'

// Usage
<SpinnerTop />

// Features:
// - Top of page loading indicator
// - Progress bar
// - Auto-hide on completion
```

### Error Component

An error display component.

```jsx
import Error from '@/components/Error'

// Usage
<Error message="Something went wrong" />

// Props:
// - message: string
// - onRetry: function (optional)
// - className: string (optional)
```

## Utility Components

### WhatNew Component

A component for displaying "What's New" content.

```jsx
import WhatNew from '@/components/WhatNew'

// Usage
<WhatNew />

// Features:
// - Feature announcements
// - Update notifications
// - Dismissible design
```

### Alert Components

Various alert components for different message types.

```jsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Success alert
<Alert>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your action was completed successfully.
  </AlertDescription>
</Alert>

// Error alert
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Something went wrong. Please try again.
  </AlertDescription>
</Alert>
```

### Tooltip Component

A tooltip component for additional information.

```jsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Usage
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Additional information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Component Guidelines

### Styling
- All components use Tailwind CSS for styling
- Custom components follow the design system
- Responsive design is implemented for all components
- Dark mode support is available for applicable components

### Accessibility
- All components include proper ARIA labels
- Keyboard navigation is supported
- Screen reader compatibility is maintained
- Focus management is implemented

### Performance
- Components are optimized for rendering performance
- Lazy loading is implemented where appropriate
- Image optimization is used for media content
- Memoization is applied to prevent unnecessary re-renders

### State Management
- Local state is managed with React hooks
- Global state uses Zustand stores
- Form state is managed with React Hook Form
- Real-time updates use Socket.IO

This documentation provides comprehensive information about all components in the LinguaConnect platform. For implementation details and specific use cases, refer to the source code or contact the development team.