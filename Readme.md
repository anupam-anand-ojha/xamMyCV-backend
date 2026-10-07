# XamMyCV — Backend (Server)

AI-powered backend that parses resumes, generates personalized skill-assessment tests using Google Gemini, evaluates answers, and produces an authenticity score for each candidate.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Auth**: JWT + bcryptjs
- **File Upload**: Multer
- **Resume Parsing**: `pdf-parse`, `mammoth`
- **Validation**: express-validator

---

## 📁 Folder Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── gemini.js          # Gemini API client config
├── controllers/
│   ├── authController.js       # Register / Login logic
│   ├── resumeController.js     # Upload + parse resume
│   └── testController.js       # Generate, fetch, submit tests
├── middleware/
│   ├── authMiddleware.js       # JWT route protection
│   ├── uploadMiddleware.js     # Multer file upload config
│   ├── errorMiddleware.js      # Centralized error handling
│   └── validateMiddleware.js   # express-validator error formatter
├── models/
│   ├── User.js
│   ├── Resume.js
│   └── Test.js
├── routes/
│   ├── authRoutes.js
│   ├── resumeRoutes.js
│   └── testRoutes.js
├── services/
│   ├── resumeParser.js         # Extracts raw text from PDF/DOCX
│   ├── aiService.js            # AI resume → structured JSON parsing
│   ├── questionGenerator.js    # AI test question generation
│   └── answerEvaluator.js      # AI answer evaluation + scoring
├── utils/
│   ├── generateToken.js        # JWT token creation
│   └── asyncHandler.js         # Wraps async routes for error handling
├── uploads/                    # Uploaded resumes (gitignored)
├── server.js                   # App entry point
├── .env                        # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### Setup
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

Run the dev server:
```bash
npm run dev
```

Server runs at `http://localhost:5000`.

---

## 📦 Dependencies

```bash
npm i express mongoose dotenv cors bcryptjs jsonwebtoken multer pdf-parse mammoth @google/generative-ai express-validator
npm i -D nodemon
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Protected | Description          |
|--------|------------------------|-----------|------------------------|
| POST   | `/api/auth/register`   | No        | Register a new user   |
| POST   | `/api/auth/login`      | No        | Login and get JWT token |

### Resume
| Method | Endpoint                   | Protected | Description                          |
|--------|------------------------------|-----------|----------------------------------------|
| POST   | `/api/resume/upload`         | Yes       | Upload PDF/DOCX resume, extract raw text |
| POST   | `/api/resume/:id/parse`      | Yes       | AI-parse raw text into structured JSON |

### Test
| Method | Endpoint                         | Protected | Description                              |
|--------|-------------------------------------|-----------|---------------------------------------------|
| POST   | `/api/test/generate/:resumeId`      | Yes       | Generate personalized test from parsed resume |
| GET    | `/api/test/:id`                     | Yes       | Fetch test questions (answers hidden)      |
| POST   | `/api/test/:id/submit`              | Yes       | Submit answers, get AI evaluation + scores |

All protected routes require:
```
Authorization: Bearer <token>
```

---

## 🧪 Example Flow (Postman/Thunder Client)

1. **Register**
   ```
   POST /api/auth/register
   { "name": "Test User", "email": "test@example.com", "password": "123456" }
   ```

2. **Upload Resume**
   ```
   POST /api/resume/upload
   form-data → key: resume (File) → select .pdf/.docx
   ```

3. **Parse Resume**
   ```
   POST /api/resume/<resumeId>/parse
   ```

4. **Generate Test**
   ```
   POST /api/test/generate/<resumeId>
   ```

5. **Get Test Questions**
   ```
   GET /api/test/<testId>
   ```

6. **Submit Answers**
   ```
   POST /api/test/<testId>/submit
   {
     "answers": [
       { "questionId": "...", "userAnswer": "React" }
     ]
   }
   ```
   Returns `overallScore`, `authenticityScore`, and per-question feedback.

---

## 🧠 How Scoring Works

- **MCQ questions**: direct match check against `correctAnswer`
- **Scenario / Project Deep-Dive questions**: evaluated by Gemini on a 0–10 scale based on how well the answer demonstrates genuine understanding
- **Overall Score**: weighted average across all questions
- **Authenticity Score**: derived mainly from project deep-dive questions, since these are hardest to fake without real experience

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt before storing
- JWT tokens expire in 7 days
- File uploads are restricted to `.pdf` / `.docx`, max 5MB
- `uploads/` and `.env` are gitignored — never commit real resumes or secrets


---
