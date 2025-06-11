from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserSummary(BaseModel):
    id: str
    name: Optional[str]
    username: Optional[str]
    profile_pic: Optional[str]


class MessageOut(BaseModel):
    id: str
    text: str
    created_at: datetime
    sender: UserSummary


class SendMessageIn(BaseModel):
    token: str
    other_id: str
    text: str


# malay/routes/chat.py
from fastapi import APIRouter, HTTPException, status, Depends, Query, Path
from malay.database import user_collection, messages_collection
from malay.config import settings
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
from malay.services.generator import CyberGenerator
router = APIRouter()
cg = CyberGenerator(api_key=settings.gemini_api)




@router.get("/chat/users/{token}")
async def list_users(token : str):
    """
    List all other users so you can start a chat.
    React can call GET /chat/users?token=... and render the sidebar.
    """
    current = await user_collection.find_one({"token": token})
    cursor = user_collection.find(
        {"_id": {"$ne": current["_id"]}},
        {"password": 0, "token": 0}
    )
    others = await cursor.to_list(length=100)
    return [
        UserSummary(
            id=u["_id"],
            name=u.get("name"),
            username=u.get("username"),
            profile_pic=u.get("profile_pic"),
        )
        for u in others
    ]


@router.get("/chat/{other_id}/{token}/messages", response_model=List[MessageOut])
async def get_messages(
    other_id: str, token:str
):
    current = await user_collection.find_one({"token": token})
    # ensure other party exists
    other = await user_collection.find_one({"_id": other_id}, {"password": 0, "token": 0})
    if not other:
        raise HTTPException(status_code=404, detail="Chat partner not found")

    # fetch all messages in either direction
    cursor = messages_collection.find({
        "$or": [
            {"sender_id": current["_id"], "receiver_id": other_id},
            {"sender_id": other_id,      "receiver_id": current["_id"]}
        ]
    }).sort("created_at", 1)

    raw = await cursor.to_list(length=1000)

    out: List[MessageOut] = []
    for m in raw:
        sender = await user_collection.find_one(
            {"_id": m["sender_id"]},
            {"password": 0, "token": 0}
        )
        out.append(
            MessageOut(
                id=m["_id"],
                text=m["text"],
                created_at=m["created_at"],
                sender=UserSummary(
                    id=sender["_id"],
                    name=sender.get("name"),
                    username=sender.get("username"),
                    profile_pic=sender.get("profile_pic"),
                )
            )
        )
    return out


@router.post(
    "/chat/message",
    response_model=MessageOut,
    responses={
        400: {
            "description": "Cyberbullying detected",
            "content": {
                "application/json": {
                    "example": {
                        "cyberbullying": True,
                        "bullying_type": "harassment",
                        "suggestion": "Please be more respectful."
                    }
                }
            },
        }
    },
)
async def send_message(data: SendMessageIn):
    # 1. Authenticate sender
    current = await user_collection.find_one({"token": data.token})
    if not current:
        raise HTTPException(status_code=401, detail="Invalid token")

    # 2. Ensure recipient exists
    if not await user_collection.find_one({"_id": data.other_id}):
        raise HTTPException(status_code=404, detail="Recipient not found")

    # 3. Run cyberbullying detection
    cyber_answer = cg.detect_cyberbulying(data.text)
    if cyber_answer.get("cyberbulying") == "no":
        # 4a. No bullying: save message
        msg_doc = {
            "_id":         str(ObjectId()),
            "sender_id":   current["_id"],
            "receiver_id": data.other_id,
            "text":        data.text,
            "created_at":  datetime.utcnow(),
        }
        await messages_collection.insert_one(msg_doc)

        return MessageOut(
            id=msg_doc["_id"],
            text=msg_doc["text"],
            created_at=msg_doc["created_at"],
            sender=UserSummary(
                id=current["_id"],
                name=current.get("name"),
                username=current.get("username"),
                profile_pic=current.get("profile_pic"),
            )
        )
    else:
        # 4b. Bullying detected: return suggestion
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "cyberbullying": True,
                "bullying_type": cyber_answer.get("cyberbulying_type"),
                "suggestion":    cyber_answer.get("suggestion"),
            },
        )