# 🚀 MimicMind - AI Persona Chat

A React-based chat application that uses OpenAI's LLM to mimic the communication styles of **Hitesh Choudhary** and **Piyush Garg** from YouTube/Twitter.

## ✨ Features

- **🤖 AI-Powered Responses**: Real-time chat with OpenAI GPT-3.5-turbo
- **👥 Dual Personas**: Switch between Hitesh & Piyush's unique communication styles
- **😀 Emoji Support**: Rich emoji picker with 40+ emojis
- **🎞️ GIF Integration**: Send and receive GIFs with AI responses
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🔒 Secure API**: Backend handles API keys securely

## 🎭 Persona Styles

### Hitesh Choudhary
- **Tone**: Energetic mentor, friendly, practical
- **Style**: Hindi slang, emojis, actionable advice
- **Phrases**: "Bro", "Bhai", "Let's go", "Now ship it!"
- **Emojis**: 🔥🚀✨💡

### Piyush Garg
- **Tone**: Direct, witty, no-nonsense
- **Style**: Performance-focused, real-world advice
- **Phrases**: "Stop overengineering", "Just execute", "Measure results"
- **Emojis**: ⚡🎯💻

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd mimicmind
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your OpenAI API key
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=5000
```

### 3. Start Development
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run server    # Backend on port 5000
npm start         # Frontend on port 3000
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 🔧 API Endpoints

### POST `/api/chat`
Send a message to get AI response in specified persona style.

**Request:**
```json
{
  "message": "How do I learn React?",
  "persona": "hitesh"
}
```

**Response:**
```json
{
  "response": "🔥 Bro, React learning — 3 steps: 1) Start with basics, 2) Build small projects, 3) Practice daily. Consistency > perfection! 🚀",
  "persona": "hitesh",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🏗️ Project Structure

```
mimicmind/
├── src/                    # React frontend
│   ├── App.js             # Main chat component
│   └── assets/            # Images and logos
├── server.js              # Express backend
├── package.json           # Dependencies
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔒 Security Features

- **Environment Variables**: API keys stored in `.env` (never committed)
- **CORS Protection**: Backend configured for secure cross-origin requests
- **Error Handling**: Graceful fallbacks if API calls fail
- **Input Validation**: Backend validates all incoming requests

## 🚀 Deployment

### Frontend (React)
```bash
npm run build
# Deploy build/ folder to your hosting service
```

### Backend (Express)
```bash
# Set production environment variables
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_production_key

# Start server
npm run server
```

## 🧪 Testing

Test the API endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Chat test
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","persona":"hitesh"}'
```

## 🔧 Troubleshooting

### Common Issues

1. **"Failed to get response"**
   - Check if backend is running on port 5000
   - Verify OpenAI API key in `.env`
   - Check OpenAI API quota/limits

2. **CORS errors**
   - Ensure backend is running
   - Check if frontend is on correct port

3. **Emojis showing as ?**
   - Clear browser cache
   - Check if using supported browser

### Debug Mode
```bash
# Backend with detailed logging
DEBUG=* npm run server
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Hitesh Choudhary** - For the energetic mentor persona
- **Piyush Garg** - For the direct, performance-focused style
- **OpenAI** - For the powerful LLM capabilities

---

**Happy Chatting! 🚀✨**
