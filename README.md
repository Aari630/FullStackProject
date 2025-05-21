# LectureQuiz - Video to MCQ Generator

A full-stack application that transcribes lecture videos and automatically generates multiple-choice questions for each 5-minute segment.

## Features

- Upload MP4 lecture videos
- Automatic transcription using local AI models
- Segmentation of transcripts into 5-minute chunks
- Generation of multiple-choice questions for each segment
- Real-time progress tracking during processing
- Export questions in JSON format

## Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **AI Components**: Local AI models (Whisper for transcription, LLM for question generation)

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (local installation or connection string)
- Python 3.8+ (for AI services)

### Setup

1. Clone the repository:
```
git clone <repository-url>
cd lecture-video-processor
```

2. Install dependencies:
```
npm install
```

3. Set up the Python AI service:
```
cd server/python_service
pip install -r requirements.txt
python app.py
```

4. Start MongoDB (if using local installation):
```
mongod --dbpath=./data
```

5. Create uploads directory (if it doesn't exist):
```
mkdir uploads
```

6. Start the application:
```
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Click on "Upload Video" to upload a lecture video
3. Wait for the transcription and question generation process to complete
4. View the transcript segments and generated questions
5. Export questions as needed

## Project Structure

```
/
├── src/                 # Frontend code
│   ├── components/      # React components
│   ├── lib/             # Utility functions and API client
│   ├── pages/           # Page components
│   └── types/           # TypeScript type definitions
├── server/              # Backend code
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── python_service/  # Python AI service
└── uploads/             # Uploaded videos (created at runtime)
```

## License

MIT