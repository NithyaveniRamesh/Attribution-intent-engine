from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from classifier import classify_conversation


app = FastAPI(
    title="SentLogic Attribution POC",
    description="Confidence-aware customer intent classification prototype",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://attribution-intent-engine-1.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConversationRequest(BaseModel):
    conversation: str


@app.get("/")
def root():
    return {
        "message": "SentLogic Attribution POC is running"
    }


@app.post("/analyze")
def analyze_conversation(request: ConversationRequest):
    result = classify_conversation(request.conversation)

    return result