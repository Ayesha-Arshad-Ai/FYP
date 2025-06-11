from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client_db = AsyncIOMotorClient(settings.MONGO_DETAILS, serverSelectionTimeoutMS=5000)
database = client_db.cybershield
user_collection = database.users
posts_collection = database.posts
likes_collection = database.likes
comments_collection = database.comments
messages_collection = database.messages

