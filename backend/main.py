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
    allow_origins=["*"],
    allow_credentials=False,
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