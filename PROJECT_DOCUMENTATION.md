# AI-Based Automatic Question Generator
## Complete Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Key Features](#key-features)
6. [How It Works](#how-it-works)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Component Descriptions](#component-descriptions)
10. [Setup & Installation](#setup--installation)
11. [Configuration](#configuration)

---

## Project Overview

**AI-Based Automatic Question Generator** is a full-stack web application that automatically generates educational questions from any topic. Users can:

- Enter any topic (e.g., "Machine Learning", "World War II", "Photosynthesis")
- Choose between **AI-powered** generation (using Groq API) or **basic template-based** generation
- Select question types: **MCQ (Multiple Choice)** or **Open-Ended**
- Set difficulty levels: **Easy**, **Medium**, or **Hard**
- Specify the number of questions (1-50)
- View question history and past sessions
- Export or save generated questions

**Target Users:** Teachers, students, content creators, educators, trainers

---

## Architecture & Design

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ User Interface (Responsive Web App)                         │ │
│  │ - Navbar (Navigation & Settings)                           │ │
│  │ - QuestionForm (Configuration Panel)                       │ │
│  │ - ResultsPanel (Display Generated Questions)               │ │
│  │ - HistoryPage (View Past Sessions)                         │ │
│  │ - SettingsModal (API Key Management)                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST API
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Routes                                                      │ │
│  │ - POST /api/generate    → Generate questions               │ │
│  │ - GET /api/history      → Fetch past sessions              │ │
│  │ - GET /api/history/:id  → Fetch specific session           │ │
│  │ - DELETE /api/history/:id → Delete session                │ │
│  │ - GET /api/health       → Health check                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Services                                                    │ │
│  │ - aiGenerator.js        → AI-powered generation (Groq)     │ │
│  │ - basicGenerator.js     → Template-based generation        │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Models                                                      │ │
│  │ - QuestionSet.js        → MongoDB schema                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────────┘
                       │ MongoDB Connection
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                           │
│  - Collections: QuestionSet                                     │
│  - Stores: Topic, Questions, Mode, Difficulty, Timestamps      │
└─────────────────────────────────────────────────────────────────┘

External Integration:
  Frontend ──→ Groq API (LLaMA AI) ──→ Generate smart questions
```

---

## Technology Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** CSS (custom, responsive design)
- **State Management:** React Hooks (useState, useEffect)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Database:** MongoDB with Mongoose ODM
- **API Integration:** Groq API (`llama-3.1-8b-instant` by default)
- **Environment:** dotenv for configuration
- **Utilities:** UUID for unique IDs, CORS for cross-origin requests

### External Services
- **Groq API:** AI-powered question generation using Groq's `llama-3.1-8b-instant` model by default
- **MongoDB Atlas:** Cloud database (optional, app works without it)

### Development Tools
- **Linting:** ESLint
- **Testing:** Built-in test framework

---

## Project Structure

```
AI-Based Automatic Question Generator/
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── main.jsx                # Entry point
│   │   ├── App.css                 # Global styles
│   │   ├── index.css               # Base styles
│   │   ├── api/
│   │   │   └── questions.js        # API client for backend communication
│   │   ├── assets/                 # Images, logos, etc.
│   │   └── components/
│   │       ├── Navbar.jsx          # Header with navigation
│   │       ├── QuestionForm.jsx    # Form for configuration
│   │       ├── ResultsPanel.jsx    # Display generated questions
│   │       ├── HistoryPage.jsx     # View past sessions
│   │       └── SettingsModal.jsx   # API key management
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite build configuration
│   ├── eslint.config.js            # Linting rules
│   ├── index.html                  # HTML entry point
│   └── public/                     # Static assets
│
└── server/                          # Backend (Express.js)
    ├── server.js                   # Main entry point
    ├── package.json                # Backend dependencies
    ├── .env                        # Environment variables
    ├── models/
    │   └── QuestionSet.js          # MongoDB schema
    ├── routes/
    │   ├── generate.js             # Question generation route
    │   └── history.js              # History management route
    └── services/
        ├── aiGenerator.js          # AI-powered generation service
        └── basicGenerator.js       # Template-based generation service
```

---

## Key Features

### 1. **Dual Generation Modes**
   - **⚡ Basic Mode:** Fast, offline, template-based question generation
   - **🤖 AI Mode:** Intelligent question generation using Groq API (requires API key)

### 2. **Flexible Question Types**
   - **MCQ (Multiple Choice):** 4 options with correct answer marked
   - **Open-Ended:** Questions with hint/model answers

### 3. **Difficulty Levels**
   - **🟢 Easy:** Basic recall questions
   - **🟡 Medium:** Application and analysis questions
   - **🔴 Hard:** Evaluation and synthesis questions

### 4. **Question History**
   - Automatic saving of generated question sets (when MongoDB connected)
   - View past sessions with full question details
   - Delete old sessions to manage storage

### 5. **Responsive UI**
   - Works on desktop, tablet, and mobile devices
   - Modern, clean interface with smooth animations
   - Real-time loading indicators

### 6. **API Key Management**
   - Secure local storage of Groq API key
   - Settings modal for key configuration
   - Support for both environment variable and user-provided keys

---

## How It Works

### User Flow Diagram

```
User Opens App
    ↓
Enter Topic & Configure Settings
    ├─→ Topic (required)
    ├─→ Mode: Basic or AI
    ├─→ Question Type: MCQ or Open-Ended
    ├─→ Difficulty: Easy/Medium/Hard
    └─→ Count: 1-50 questions
    ↓
Click "Generate Questions"
    ↓
    ├─ If Mode = "BASIC"
    │  ├→ Template-based generator runs locally
    │  ├→ Replaces {topic} placeholders in templates
    │  ├→ Generates options for MCQs
    │  └→ Returns questions instantly (no API calls)
    │
    └─ If Mode = "AI"
       ├→ Validates API key
       ├→ Builds detailed prompt with constraints
       ├→ Sends to Groq API (LLaMA 3.3 70B)
       ├→ Parses JSON response
       └→ Returns AI-generated questions
    ↓
Display Results
    ├→ Show generated questions
    ├→ Display options (for MCQ)
    ├→ Show correct answers & explanations
    └→ Allow download/copy
    ↓
Save to History (if MongoDB connected)
    ├→ Store question set with metadata
    ├→ Add timestamp
    └→ Enable retrieval later
    ↓
View History
    ├→ Browse past sessions
    ├→ Click to view full questions
    └→ Delete old sessions
```

### Generation Process Details

#### **BASIC Mode (Template-Based)**

1. **Input Validation:**
   - Checks topic is provided
   - Validates count (1-50)
   - Validates difficulty (easy/medium/hard)
   - Validates question type (mcq/open-ended)

2. **Template Selection:**
   - Selects appropriate template array based on difficulty and type
   - Random selection from templates prevents duplicates

3. **Template Processing:**
   - Replaces `{topic}` placeholder with user's topic
   - For MCQ: generates 4 options using domain-specific generators
   - For Open-Ended: generates hint based on difficulty

4. **Output Format:**
   ```json
   {
     "questions": [
       {
         "id": 1,
         "question": "What is Machine Learning?",
         "type": "mcq",
         "difficulty": "easy",
         "options": ["Option A", "Option B", "Option C", "Option D"],
         "answer": "Option A",
         "explanation": "Explanation text"
       }
     ]
   }
   ```

#### **AI Mode (Groq API)**

1. **API Key Validation:**
   - Checks if API key exists
   - Validates it's not default placeholder
   - Uses user-provided key or environment variable

2. **Prompt Engineering:**
   - Creates detailed system prompt
   - Specifies exact JSON format expected
   - Sets difficulty and type constraints
   - Defines rules for question quality

3. **API Call:**
    - Sends request to `https://api.groq.com/openai/v1/chat/completions` using `GROQ_MODEL` or `llama-3.1-8b-instant`
    - Model: `llama-3.1-8b-instant` by default
   - Temperature: 0.7 (balanced creativity and consistency)

4. **Response Parsing:**
   - Extracts content from Groq response
   - Removes markdown code fences
   - Parses JSON response
   - Validates structure

5. **Error Handling:**
   - Catches API errors
   - Returns meaningful error messages
   - Falls back gracefully if API fails

---

## API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### **1. Generate Questions**
```
POST /api/generate
```

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "mode": "ai",
  "count": 5,
  "difficulty": "medium",
  "questionType": "mcq",
  "apiKey": "your_groq_api_key"  // Optional if in .env
}
```

**Response (Success):**
```json
{
  "success": true,
  "topic": "Machine Learning",
  "mode": "ai",
  "difficulty": "medium",
  "questionType": "mcq",
  "count": 5,
  "questions": [
    {
      "id": 1,
      "question": "What is supervised learning?",
      "type": "mcq",
      "difficulty": "medium",
      "options": [
        "Learning with labeled data",
        "Learning without labels",
        "Learning from mistakes",
        "Random learning"
      ],
      "answer": "Learning with labeled data",
      "explanation": "Supervised learning uses labeled training data..."
    }
  ]
}
```

**Response (Error):**
```json
{
  "error": "Error message describing what went wrong"
}
```

**Validation Rules:**
- `topic`: Required, non-empty string
- `count`: Required, integer between 1-50
- `difficulty`: Required, must be "easy", "medium", or "hard"
- `questionType`: Required, must be "mcq" or "open-ended"
- `mode`: Required, must be "basic" or "ai"
- `apiKey`: Optional, required for AI mode if not in .env

---

#### **2. Get History**
```
GET /api/history
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "_id": "ObjectId",
      "topic": "Machine Learning",
      "mode": "ai",
      "difficulty": "medium",
      "questionType": "mcq",
      "count": 5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Query Parameters:**
- Limit: 50 most recent sessions

---

#### **3. Get Specific Session**
```
GET /api/history/:id
```

**Response:**
```json
{
  "success": true,
  "questionSet": {
    "_id": "ObjectId",
    "topic": "Machine Learning",
    "mode": "ai",
    "difficulty": "medium",
    "questionType": "mcq",
    "count": 5,
    "questions": [
      {
        "question": "What is supervised learning?",
        "type": "mcq",
        "difficulty": "medium",
        "options": ["..."],
        "answer": "...",
        "explanation": "..."
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### **4. Delete Session**
```
DELETE /api/history/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Session deleted."
}
```

---

#### **5. Health Check**
```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "time": "2024-01-15T10:30:00Z"
}
```

---

## Database Schema

### MongoDB Collections

#### **QuestionSet Collection**

```javascript
{
  _id: ObjectId,
  topic: String,           // Topic name
  mode: String,            // "basic" or "ai"
  difficulty: String,      // "easy", "medium", "hard"
  questionType: String,    // "mcq" or "open-ended"
  count: Number,           // Number of questions
  questions: [
    {
      question: String,
      type: String,        // "mcq" or "open-ended"
      difficulty: String,
      options: [String],   // For MCQ only
      answer: String,      // Correct answer
      explanation: String, // Why it's correct
      hint: String        // For open-ended only
    }
  ],
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

**Indexes:**
- `_id`: Primary key
- `createdAt`: For sorting history (latest first)

---

## Component Descriptions

### Frontend Components

#### **Navbar.jsx**
- **Purpose:** Navigation header
- **Features:**
  - Logo/branding
  - Navigation links (Home, History)
  - Settings button
  - Settings modal toggle

#### **QuestionForm.jsx**
- **Purpose:** Main form for question generation
- **Features:**
  - Topic input field
  - Mode toggle (Basic/AI)
  - Question type toggle (MCQ/Open-Ended)
  - Difficulty level buttons
  - Question count slider (1-50)
  - Generate button with loading state
  - Form validation

#### **ResultsPanel.jsx**
- **Purpose:** Display generated questions
- **Features:**
  - Question cards display
  - Show options for MCQ
  - Show answers and explanations
  - Display difficulty badges
  - Copy/download functionality
  - Reset button to generate new questions

#### **HistoryPage.jsx**
- **Purpose:** Browse and manage past sessions
- **Features:**
  - List of past question sets
  - Click to view full questions
  - Delete session functionality
  - Session metadata display
  - Filter/sort options

#### **SettingsModal.jsx**
- **Purpose:** API key management
- **Features:**
  - Input field for Groq API key
  - Save key to localStorage
  - Display current status
  - Help text for obtaining API key
  - Secure storage (localStorage)

#### **QuestionCard.jsx**
- **Purpose:** Display individual question
- **Features:**
  - Question text
  - Question type badge
  - Difficulty indicator
  - MCQ options display
  - Answer reveal toggle
  - Explanation display

---

### Backend Services

#### **aiGenerator.js**
- **Purpose:** AI-powered question generation via Groq API
- **Functions:**
  - `buildPrompt()`: Constructs detailed prompt for LLaMA
  - `generateAIQuestions()`: Calls Groq API and parses response
- **Error Handling:**
  - API key validation
  - JSON parsing validation
  - Fallback JSON extraction from response

#### **basicGenerator.js**
- **Purpose:** Template-based question generation (offline)
- **Structure:**
  - Question templates for 3 difficulty levels × 2 types (6 templates)
  - MCQ option generators for 12 question types
  - Template selection and replacement logic
- **Advantages:**
  - No API calls needed
  - Instant results
  - Works offline

#### **generate.js** (Route)
- **Purpose:** Handles question generation API endpoint
- **Validations:**
  - Topic required and non-empty
  - Count between 1-50
  - Valid difficulty level
  - Valid question type
- **Process:**
  - Route request to appropriate generator (Basic or AI)
  - Attempt to save to database (best effort)
  - Return formatted response
- **Error Handling:**
  - Input validation with specific error messages
  - Try-catch for API/DB errors
  - Graceful DB failure handling

#### **history.js** (Route)
- **Purpose:** Handles history management API endpoints
- **Endpoints:**
  - GET /api/history - Fetch all sessions (latest 50)
  - GET /api/history/:id - Fetch specific session
  - DELETE /api/history/:id - Delete session
- **Error Handling:**
  - Check session existence before deletion
  - Handle DB connection failures gracefully

---

## Setup & Installation

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB (optional, but recommended for history feature)
- Groq API key (for AI mode)

### Step 1: Clone/Extract Project
```bash
cd "c:\Users\Hemant M B\OneDrive\Desktop\fsd assignment byd"
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 4: Setup Environment Variables

Create `.env` file in `server/` directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/question-generator
GROK_API_KEY=your_groq_api_key_here
```

Obtain Groq API key from: https://console.groq.com

### Step 5: Start Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Step 6: Start Frontend (New Terminal)
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 7: Access Application
Open browser and navigate to: `http://localhost:5173`

---

## Configuration

### Environment Variables

**server/.env**
```
# Server Configuration
PORT=5000                    # Server port (default: 5000)

# Database Configuration
MONGODB_URI=mongodb+srv://...  # MongoDB connection string
                             # Leave empty to disable database features

# API Keys
GROK_API_KEY=your_key       # Groq API key for AI mode
                             # Get from https://console.groq.com
GROQ_MODEL=llama-3.1-8b-instant # Optional model override
```

### Frontend Configuration

**localStorage Keys:**
- `groq_api_key`: Stores user's Groq API key locally

### Browser Compatibility
- Chrome/Edge: Latest versions
- Firefox: Latest version
- Safari: Latest version
- Mobile browsers: Full support

---

## Troubleshooting

### Common Issues

**1. Server won't start - Port already in use**
```bash
# Change PORT in .env file to different port (e.g., 5001)
PORT=5001
```

**2. MongoDB connection fails**
- This is non-critical - app works without MongoDB
- History feature just won't persist
- Check MongoDB URI in .env file

**3. AI mode throws error - Invalid API key**
- Verify Groq API key is correct
- Check key format (should start with 'grok-')
- Ensure key isn't expired or revoked

**4. Questions take too long to generate (AI mode)**
- Normal - first request can take 3-5 seconds
- Groq API response time varies
- Check internet connection

**5. CORS errors**
- Ensure backend is running on http://localhost:5000
- Check frontend is calling correct API URL
- Backend has CORS enabled for all origins

---

## Performance Considerations

### Basic Mode
- **Speed:** Instant (<100ms)
- **Resource:** CPU minimal
- **API calls:** 0
- **Scalability:** Unlimited

### AI Mode
- **Speed:** 3-10 seconds (depends on API)
- **Resource:** Network bandwidth
- **API calls:** 1 per request
- **Scalability:** Limited by Groq API rate limits

### Database
- **Query Performance:** Indexed by createdAt
- **Storage:** ~1KB per question set
- **Optimization:** Limit history retrieval to 50 most recent

---

## Future Enhancements

1. **User Authentication:** Login/signup for personalized history
2. **Question Export:** PDF/DOCX export functionality
3. **Advanced Filtering:** Filter history by topic, mode, date range
4. **Batch Generation:** Generate questions for multiple topics at once
5. **Custom Templates:** Allow users to create custom question templates
6. **Image Support:** Generate questions with images/diagrams
7. **Multi-language:** Support for different languages
8. **Analytics:** Track usage statistics and popular topics

---

## API Rate Limits

### Groq API (Free Tier)
- **Requests/minute:** ~30
- **Tokens/minute:** ~1000

Ensure your application respects these limits.

---

## Security Considerations

1. **API Keys:** Store securely in localStorage (client-side)
2. **Environment Variables:** Never commit .env file to git
3. **Input Validation:** All inputs validated on backend
4. **CORS:** Restrict to trusted origins in production
5. **HTTPS:** Use HTTPS in production environment

---

## Support & Resources

- **Groq API Docs:** https://console.groq.com/docs
- **Express.js Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **MongoDB Docs:** https://docs.mongodb.com
- **Vite Docs:** https://vitejs.dev

---

## License & Credits

**Created for:** Full Stack Development Assignment

**Project Type:** Educational Question Generator

**Version:** 1.0.0

---

## Document Version
- **Last Updated:** January 2025
- **Version:** 1.0
- **Document Status:** Complete

---

**End of Documentation**
