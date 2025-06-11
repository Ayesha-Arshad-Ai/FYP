import sys
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from routes import users, posts, chatbot, cyber_free
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings


app = FastAPI(
    title="cybershield",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

origins = [
    "http://localhost:3000",     # your React app
    "http://127.0.0.1:3000",
    "http://localhost:8000",     # Swagger UI itself
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[""],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Include routers
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(chatbot.router)
app.include_router(cyber_free.router)
if __name__ == "__main__":
    import uvicorn
   # uvicorn.run(app, host="0.0.0.0", port=8000)
