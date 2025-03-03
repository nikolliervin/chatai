from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
import requests

app = FastAPI()

# Ollama API configuration
OLLAMA_API_URL = "http://localhost:11434"

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Disable credentials requirement
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Data models
class Message(BaseModel):
    role: str
    content: str

class Chat(BaseModel):
    id: str
    title: str
    messages: List[Message]
    model: str
    created_at: str

class CreateChatRequest(BaseModel):
    model: str

# In-memory storage (replace with database in production)
chats = {}

@app.get("/api/models")
async def get_models():
    try:
        response = requests.get(f"{OLLAMA_API_URL}/api/tags")
        if response.status_code == 200:
            models_data = response.json()
            return {
                "models": [
                    {"id": model["name"], "name": model["name"]}
                    for model in models_data["models"]
                ]
            }
        else:
            # Fallback to default models if Ollama is not available
            return {
                "models": [
                    {"id": "mistral", "name": "Mistral"},
                    {"id": "llama2", "name": "Llama 2"},
                    {"id": "codellama", "name": "Code Llama"}
                ]
            }
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Ollama: {e}")
        # Return default models if Ollama is not available
        return {
            "models": [
                {"id": "mistral", "name": "Mistral"},
                {"id": "llama2", "name": "Llama 2"},
                {"id": "codellama", "name": "Code Llama"}
            ]
        }

@app.get("/api/chats")
async def get_chats():
    return {"chats": list(chats.values())}

@app.post("/api/chats")
async def create_chat(request: CreateChatRequest):
    chat_id = str(datetime.now().timestamp())
    print(f"Creating new chat with ID: {chat_id} and model: {request.model}")
    new_chat = Chat(
        id=chat_id,
        title="New Chat",
        messages=[],
        model=request.model,
        created_at=datetime.now().isoformat()
    )
    chats[chat_id] = new_chat
    print(f"Current chats in storage: {list(chats.keys())}")
    return new_chat

@app.post("/api/chats/{chat_id}/messages")
async def send_message(chat_id: str, message: Message):
    print(f"Attempting to send message to chat {chat_id}")
    print(f"Available chat IDs: {list(chats.keys())}")
    
    if chat_id not in chats:
        print(f"Chat {chat_id} not found in storage")
        raise HTTPException(status_code=404, detail=f"Chat {chat_id} not found. Available chats: {list(chats.keys())}")
    
    chat = chats[chat_id]
    print(f"Found chat with model: {chat.model}")
    chat.messages.append(message)
    
    try:
        # Prepare conversation context
        messages = [{"role": msg.role, "content": msg.content} for msg in chat.messages]
        
        # Send request to Ollama
        print(f"Sending request to Ollama with model: {chat.model}")
        response = requests.post(
            f"{OLLAMA_API_URL}/api/chat",
            json={
                "model": chat.model,
                "messages": messages,
                "stream": False
            }
        )
        
        print(f"Ollama response status: {response.status_code}")
        print(f"Ollama response: {response.text}")
        
        if response.status_code == 200:
            response_data = response.json()
            ai_response = Message(
                role="assistant",
                content=response_data["message"]["content"]
            )
        else:
            # Fallback response if Ollama request fails
            error_msg = f"Ollama API error: {response.status_code} - {response.text}"
            print(error_msg)
            ai_response = Message(
                role="assistant",
                content=f"I apologize, but I'm having trouble generating a response right now. Error: {error_msg}"
            )
    
    except requests.exceptions.RequestException as e:
        error_msg = f"Error connecting to Ollama: {str(e)}"
        print(error_msg)
        ai_response = Message(
            role="assistant",
            content=f"I apologize, but I'm having trouble connecting to Ollama. Please check if Ollama is running at {OLLAMA_API_URL}. Error: {str(e)}"
        )
    
    chat.messages.append(ai_response)
    return {"message": "Message sent successfully", "response": ai_response}

@app.put("/api/chats/{chat_id}")
async def update_chat(chat_id: str, chat: Chat):
    if chat_id not in chats:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chats[chat_id] = chat
    return chat

@app.delete("/api/chats/{chat_id}")
async def delete_chat(chat_id: str):
    if chat_id not in chats:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    del chats[chat_id]
    return {"message": "Chat deleted successfully"} 