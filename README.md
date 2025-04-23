# Notesy Backend API

Voice-controlled notes application backend built with Node.js and Express.

## 🛠 Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express
-   **Database**: MongoDB (Mongoose ODM)
-   **Authentication**: JWT
-   **Voice Processing**: Google Cloud Speech-to-Text
-   **Real-time**: Socket.IO
-   **Scheduling**: node-cron

## 🚀 Quick Start

### Prerequisites

-   Node.js v16+
-   MongoDB Atlas URI
-   Google Cloud credentials

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/notesy-backend.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/notesy
JWT_SECRET=your_jwt_secret_here
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📂 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── models/        # Database models
├── routes/        # Express routers
├── services/      # Business logic
├── utils/         # Helpers & utilities
├── middleware/    # Auth & other middleware
├── sockets/       # Socket.IO setup
└── app.js         # Express application
```

## 🔧 Key Features

### 1. Voice Note Processing

```javascript
// Example voice processing route
app.post(
    '/api/voice/process',
    authMiddleware,
    voiceController.processRecording
);
```

### 2. Real-time Updates

```javascript
// Socket.IO event example
io.on('connection', (socket) => {
    socket.on('note-update', (updatedNote) => {
        broadcastToRoom(updatedNote);
    });
});
```

### 3. Scheduled Reminders

```javascript
// Cron job example
cron.schedule('0 9 * * *', () => {
    reminderService.sendDailyReminders();
});
```

## 🛡️ Authentication

```bash
# Sample protected request
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3000/api/notes
```
