from fastapi import APIRouter, HTTPException, status, Form, UploadFile, File, Query
from datetime import datetime
from bson import ObjectId
from malay.services.generator import CyberGenerator
from malay.database import (
    posts_collection,
    likes_collection,
    comments_collection,
    user_collection
)
import os
import shutil
from malay.config import settings

router = APIRouter()
cg = CyberGenerator(api_key=settings.gemini_api)
POST_IMAGE_DIR = "C:/Users/abc/Downloads/cyber-sheild/cyber-sheild/ai-cybersheild/public/assests/post_images"
os.makedirs(POST_IMAGE_DIR, exist_ok=True)
@router.post("/posts", status_code=status.HTTP_201_CREATED)
async def create_post(
    token: str = Form(...),
    caption: str = Form(None),
    image: UploadFile = File(None),
    mood: str = Form(None),
):
    user = await user_collection.find_one({"token": token})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    image_filename = None
    dest = None

    if image:
        image_filename = f"{ObjectId()}_{image.filename}"
        dest = os.path.join(POST_IMAGE_DIR, image_filename)
        with open(dest, "wb") as buf:
            shutil.copyfileobj(image.file, buf)

    post_type = "text"
    if image and caption:
        post_type = "mixed"
        cyber_answer = cg.detect_cyberbulying_img(dest, caption)
    elif image:
        post_type = "image"
        cyber_answer = cg.detect_cyberbulying_img(dest, '')
    elif caption:
        cyber_answer = cg.detect_cyberbulying(caption)
    else:
        cyber_answer = {"cyberbulying": "no"}

    if cyber_answer['cyberbulying'] == 'no':
        post = {
            "_id": str(ObjectId()),
            "user_id": user["_id"],
            "caption": caption,
            "image": image_filename,
            "created_at": datetime.utcnow(),
            "like_count": 0,
            "comment_count": 0,
            "mood": mood,
            "post_type": post_type,
        }
        await posts_collection.insert_one(post)
        return {"status": True, "message": "Post created successfully."}
    else:
        return {
            "status": False,
            "message": "Cyberbullying detected!",
            "suggestion": cyber_answer.get('suggestion', 'Please modify your content.'),
            "cyberbullying_type": cyber_answer.get('cyberbulying_type', 'Unknown'),
        }


@router.get("/posts")
async def get_posts(token: str = Query(...)):
    user = await user_collection.find_one({"token": token})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    posts = []
    async for post in posts_collection.find().sort("created_at", -1):
        author = await user_collection.find_one({"_id": post["user_id"]})
        liked = await likes_collection.find_one({"post_id": post["_id"], "user_id": user["_id"]})
        comment_cursor = comments_collection.find({"post_id": post["_id"]})
        comments = [
            {
                "text": c["text"],
                "created_at": c["created_at"],
                "user": await user_collection.find_one({"_id": c["user_id"]})
            } async for c in comment_cursor
        ]
        posts.append({
            "_id": post["_id"],
            "caption": post["caption"],
            "image": post["image"],
            "created_at": post["created_at"],
            "like_count": post["like_count"],
            "comment_count": post["comment_count"],
            "mood": post["mood"],
            "post_type": post["post_type"],
            "user": {
                "_id": author["_id"],
                "name": author["name"],
                "profile": author.get("profile_pic")
            },
            "liked": bool(liked),
            "comments": comments
        })
    return posts

@router.post("/posts/{post_id}/like")
async def toggle_like(post_id: str, token: str = Form(...)):
    user = await user_collection.find_one({"token": token})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    post = await posts_collection.find_one({"_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = await likes_collection.find_one({"post_id": post_id, "user_id": user["_id"]})
    if existing_like:
        await likes_collection.delete_one({"_id": existing_like["_id"]})
        await posts_collection.update_one({"_id": post_id}, {"$inc": {"like_count": -1}})
        return {"liked": False}
    else:
        await likes_collection.insert_one({"post_id": post_id, "user_id": user["_id"]})
        await posts_collection.update_one({"_id": post_id}, {"$inc": {"like_count": 1}})
        return {"liked": True}

@router.get("/posts/search")
async def search_posts(query: str, token: str = Query(...)):
    user = await user_collection.find_one({"token": token})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    posts = []
    async for post in posts_collection.find({"caption": {"$regex": query, "$options": "i"}}).sort("created_at", -1):
        author = await user_collection.find_one({"_id": post["user_id"]})
        liked = await likes_collection.find_one({"post_id": post["_id"], "user_id": user["_id"]})
        posts.append({
            "_id": post["_id"],
            "caption": post["caption"],
            "image": post["image"],
            "created_at": post["created_at"],
            "like_count": post["like_count"],
            "comment_count": post["comment_count"],
            "mood": post["mood"],
            "post_type": post["post_type"],
            "user": {
                "_id": author["_id"],
                "name": author["name"],
                "profile": author.get("profile_pic")
            },
            "liked": bool(liked)
        })
    return posts

@router.post("/posts/{post_id}/comments", status_code=status.HTTP_201_CREATED)
async def add_comment(
    post_id: str,
    token: str = Form(...),
    comment_text: str = Form(...)
):
    user = await user_collection.find_one({"token": token})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    post = await posts_collection.find_one({"_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    cyber_answer = cg.detect_cyberbulying(comment_text)

    if cyber_answer['cyberbulying'] == 'no':
        comment = {
            "_id": str(ObjectId()),
            "post_id": post_id,
            "user_id": user["_id"],
            "text": comment_text,
            "created_at": datetime.utcnow()
        }

        await comments_collection.insert_one(comment)
        await posts_collection.update_one(
            {"_id": post_id},
            {"$inc": {"comment_count": 1}}
        )

        return {"status": True, "message": "Comment added successfully"}

    else:
        return {
            "status": False,
            "message": "Cyberbullying detected!",
            "suggestion": cyber_answer.get('suggestion', 'Please modify your content.'),
            "cyberbullying_type": cyber_answer.get('cyberbulying_type', 'Unknown'),
        }
