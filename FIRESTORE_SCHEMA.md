# Firestore Database Schema

## Collections

### 1. users
- **uid**: string (document ID)
- **name**: string
- **email**: string
- **hostel**: string (optional)
- **createdAt**: timestamp

### 2. moodEntries
- **uid**: string
- **timestamp**: timestamp
- **answers**: array
- **moodScore**: number
- **moodLabel**: string

### 3. marks
- **uid**: string
- **subjectName**: string
- **internalMarks**: number
- **externalMarks**: number
- **total**: number
- **semester**: string

### 4. assignments
- **uid**: string
- **subject**: string
- **title**: string
- **dueDate**: timestamp
- **status**: string
- **notes**: string

### 5. events
- **title**: string
- **description**: string
- **location**: string
- **dateTime**: timestamp
- **createdBy**: string
- **isCollegeEvent**: boolean

### 6. games (NEW)
- **title**: string
- **gameUrl**: string
- **thumbnail**: string
- **isActive**: boolean

### 7. messages (NEW - Community Chat)
- **text**: string
- **userId**: string
- **userName**: string
- **userHostel**: string
- **timestamp**: timestamp
- **channel**: string ('general', 'doubts', 'projects', 'buysell')

### 8. documents (NEW - PDF Documents)
- **uid**: string
- **fileName**: string
- **fileUrl**: string
- **extractedText**: string
- **uploadedAt**: timestamp

### 9. focusMode (NEW - Focus Sessions)
- **uid**: string (document ID)
- **isActive**: boolean
- **timerDuration**: number (minutes)
- **startedAt**: timestamp
- **endTime**: number (milliseconds)

### 10. transactions (NEW - P2P Payments)
- **fromUid**: string
- **toUid**: string
- **amount**: number
- **note**: string
- **timestamp**: timestamp
- **status**: string

### 11. todos (NEW - Task Management)
- **uid**: string
- **title**: string
- **description**: string
- **dueDate**: string
- **priority**: string ('low', 'medium', 'high')
- **completed**: boolean

### 12. attendance (NEW - Class Attendance)
- **uid**: string
- **subjectName**: string
- **totalClasses**: number
- **attendedClasses**: number

### 13. trackers (NEW - Habit/Goal Tracking)
- **uid**: string
- **name**: string
- **type**: string ('study', 'habit', 'goal')
- **target**: number
- **progress**: number
- **date**: string

### 14. streams (NEW - Course Recommendations)
- **streamName**: string
- **description**: string
- **isActive**: boolean

### 15. courses (NEW - Course Details)
- **streamId**: string
- **courseName**: string
- **platform**: string
- **courseUrl**: string
- **description**: string
- **isActive**: boolean

### 16. learningSessions (NEW - Learning Tracking)
- **userId**: string
- **platform**: string
- **topic**: string
- **url**: string
- **openedAt**: timestamp
- **duration**: number (optional)

### 17. learningNotes (NEW - Study Notes)
- **userId**: string
- **topic**: string
- **content**: string
- **updatedAt**: timestamp

### 18. codingProblems (NEW - Internal Coding Problems)
- **title**: string
- **description**: string
- **difficulty**: string ('Easy', 'Medium', 'Hard')
- **language**: string
- **starterCode**: string
- **testCases**: array

### 19. designProjects (NEW - Design Project Management)
- **userId**: string
- **name**: string
- **description**: string
- **platform**: string
- **projectUrl**: string (optional)
- **status**: string ('Not Started', 'In Progress', 'Completed')
- **createdAt**: timestamp
- **updatedAt**: timestamp

### 20. calls (NEW - Video Call Tracking)
- **userId**: string
- **startedAt**: timestamp
- **type**: string
- **notes**: string

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Mood entries - user specific
    match /moodEntries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Marks - user specific
    match /marks/{markId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Assignments - user specific
    match /assignments/{assignmentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Events - read all, write authenticated
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Games - read all active games
    match /games/{gameId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admin only in production
    }
    
    // Messages - read/write for authenticated users in same hostel
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Documents - user specific
    match /documents/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Focus mode - user specific
    match /focusMode/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - users involved can read
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.fromUid || request.auth.uid == resource.data.toUid);
      allow write: if request.auth != null;
    }
    
    // Todos - user specific
    match /todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Attendance - user specific
    match /attendance/{attendanceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Trackers - user specific
    match /trackers/{trackerId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Streams - read all
    match /streams/{streamId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admin only in production
    }
    
    // Courses - read all
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admin only in production
    }
    
    // Learning Sessions - user specific
    match /learningSessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Learning Notes - user specific
    match /learningNotes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Coding Problems - read all, admin write
    match /codingProblems/{problemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admin only in production
    }
    
    // Design Projects - user specific
    match /designProjects/{projectId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Calls - user specific
    match /calls/{callId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Environment Variables Required

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Keys
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_PLACES_API_KEY=your_places_api_key
LLM_API_KEY=your_llm_api_key
```

## Admin Data Entry

To add games, use Firebase Console or create admin functions:

```javascript
// Example game entry
{
  title: "Snake Game",
  gameUrl: "https://example.com/snake-game",
  thumbnail: "https://example.com/snake-thumbnail.jpg",
  isActive: true
}
```