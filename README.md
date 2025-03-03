# Chat Application

A modern chat interface built with React and FastAPI that seamlessly integrates with the Ollama API to provide dynamic, AI-driven conversations.

## Features

- Modern, responsive chat interface
- Multiple Ollama model support
- Real-time chat functionality
- Save, manage, import & export conversations
- Clean and intuitive UI

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173

## Development

### Frontend Development
- The frontend is built with React and Vite
- Uses styled-components for styling
- Communicates with the backend via REST API
- Features a modern, responsive UI

### Backend Development
- Built with FastAPI
- RESTful API endpoints
- In-memory chat storage (can be extended to use a database)
- CORS enabled for frontend communication

## API Endpoints

- `GET /api/models` - Get available models
- `GET /api/chats` - Get all chats
- `POST /api/chats` - Create a new chat
- `POST /api/chats/{chat_id}/messages` - Send a message in a chat
- `PUT /api/chats/{chat_id}` - Update a chat
- `DELETE /api/chats/{chat_id}` - Delete a chat

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
