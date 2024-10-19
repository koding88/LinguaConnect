# Database Design
#  

Posts[icon: book, color: blue]{
  id string (pk)
  content string
  images [array]
  likes [array of User IDs]
  comments [array of Comment IDs]
  user User ID (ref)
  status string (enum: public, hidden)
  group Group ID (ref, default: null)
  createdAt: date
}

Users [icon: user, color: green] {
  id string (pk)
  full_name string
  username string (unique)
  avatarUrl string 
  email string (unique)
  password string
  role string (enum: user, admin)
  gender boolean
  birthday date
  location string
  followers [array of User IDs]
  following [array of User IDs]
  status string (enum: block, unblock)
  isVerify boolean (default: false)
  isEnable2FA boolean (default: false)
  saved_posts [array of Post IDs]
}

Comments[icon: comment, color: orange]{
  id string (pk)
  content string
  likes [array of User IDs]
  user User ID (ref)
  post Post ID (ref)
  postOwner User ID (ref)
  createdAt date 
}

Group[icon: users, color: red]{
  id string (pk)
  name string (unique)
  description string
  owner User ID (ref)
  avatarUrl string 
  members [array of User IDs]
  maxMembers number (default: 100)
  posts [array of Post IDs]
  status string (enum: active, blocked)
  createdAt date
}

Topic[icon: topic, color: yellow]{
  id string (pk)
  name string (unique)
  description string
  createdAt date
}

Notifications[icon: bell, color: black]{
  id string (pk)
  user User ID (ref)
  recipients [array of User IDs]
  url string
  text string
  content string
  image string
  isRead boolean
}

Messages [icon: messenger, color: purple]{
  id string (pk)
  conversation Conversation ID (ref)
  sender User ID (ref)
  recipient User ID (ref)
  text string
  media [array of URLs]
  call object
}

Conversations [icon: phone-call, color: blue]{
  id string (pk)
  conversation Conversation ID (ref)
  sender User ID (ref)
  recipient User ID (ref)
  text string
  media [array of URLs]
  call object
}

// Relationship

// Users
// Users.followers <> Users.id
// Users.following <> Users.id
Users.saved_posts <> Posts.id

// Posts
Posts.user > Users.id
Posts.comments <> Comments.id
Posts.likes <> Users.id
Posts.group > Group.id

// Comments
Comments.user > Users.id
Comments.post > Posts.id
Comments.postOwner > Users.id
Comments.likes > Users.id

// Groups
Group.owner > Users.id
Group.members <> Users.id
Group.posts <> Posts.id

// Notifications
Notifications.user > Users.id
Notifications.recipients <> Users.id

// Messages
Messages.conversation > Conversations.id
Messages.sender > Users.id
Messages.recipient > Users.id

// Conversations
Conversations.recipiens <> Users.id