# ChatAI

A desktop chat application built with React, Python FastAPI, and Electron, designed to interact with Ollama's local AI models.

## Features

- Modern chat interface
- Local AI model integration via Ollama
- Cross-platform desktop application
- Real-time chat responses
- Code syntax highlighting
- Markdown support

## Prerequisites

- Node.js 18+ and npm
- Python 3.7+
- Ollama installed and running locally

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nikolliervin/chatai.git
cd chatai
```

2. Install backend dependencies:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Development

1. Start Ollama on your machine

2. Start the backend server:
```bash
cd backend
# Activate virtual environment if not already activated
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Start the frontend development server:
```bash
cd frontend
npm run electron:dev
```

## Building the Desktop App

To create a standalone desktop application:

1. After checking out feature/electron-app, make sure you're in the frontend directory:
```bash
cd frontend
```

2. Build the application:
```bash
npm run electron:build
```

3. Find the installer in:
- Windows: `frontend/dist-electron/ChatAI-Setup-1.0.0.exe`
- macOS: `frontend/dist-electron/ChatAI-1.0.0.dmg`
- Linux: `frontend/dist-electron/ChatAI-1.0.0.AppImage`

## Usage

1. Launch the application
2. Select your preferred AI model from the dropdown
3. Start chatting!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Preview


![chatai 2](https://github.com/user-attachments/assets/3e1349ed-7212-4709-a5ae-4fcf8aaf34bc)

![chati 3](https://github.com/user-attachments/assets/03731937-c7aa-4c67-9c81-f9a63edb8deb)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
