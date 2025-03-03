from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

# In-memory storage (replace with database in production)
chats = {}

@app.get("/api/models")
async def get_models():
    # In a real application, this would detect locally installed models
    return {
        "models": [
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5"},
            {"id": "gpt-4", "name": "GPT-4"},
            {"id": "deepseek", "name": "DeepSeek"}
        ]
    }

@app.get("/api/chats")
async def get_chats():
    return {"chats": list(chats.values())}

@app.post("/api/chats")
async def create_chat(model: str):
    chat_id = str(datetime.now().timestamp())
    new_chat = Chat(
        id=chat_id,
        title="New Chat",
        messages=[],
        model=model,
        created_at=datetime.now().isoformat()
    )
    chats[chat_id] = new_chat
    return new_chat

@app.post("/api/chats/{chat_id}/messages")
async def send_message(chat_id: str, message: Message):
    if chat_id not in chats:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat = chats[chat_id]
    chat.messages.append(message)
    
    # Simulate AI response
    ai_response = Message(
        role="assistant",
        content=f"This is a simulated response to: {message.content}"
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