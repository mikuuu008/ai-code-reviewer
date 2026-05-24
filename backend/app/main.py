import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import WebSocket, WebSocketDisconnect
import random

import subprocess
import tempfile
import os
from dotenv import load_dotenv

from openai import OpenAI

from app.db import (
    create_user,
    get_user,
    verify_password,
    save_history,
    get_history,
    get_settings,
    save_settings,
    get_connection
)

from app.auth import (
    create_access_token,
    verify_token
)

from app.games import (
    python_quiz,
    java_challenge,
    c_memory_game,
    csharp_typing
)

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Auth(BaseModel):
    email: str
    password: str


class User(BaseModel):
    email: str
    password: str


class CodeReq(BaseModel):
    code: str
    lang: str


class ChatReq(BaseModel):
    message: str


class BotRequest(BaseModel):
    bot_name: str
    message: str


class SettingsReq(BaseModel):
    dark_mode: bool
    api_key: str


@app.get("/")
def home():
    return {"message": "🚀 AI Code Hero Backend Running Successfully"}


# ================= REVIEW CODE =================
@app.post("/review")
def review(req: CodeReq):

    code = req.code.strip()

    if not code:
        return {"review": "⚠️ No code provided", "status": "error"}

    try:
        result = None

        # ================= PYTHON =================
        if req.lang == "python":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as tmp:
                tmp.write(code.encode())
                file_path = tmp.name

            result = subprocess.run(
                ["python", file_path],
                capture_output=True,
                text=True,
                timeout=5
            )

        # ================= JAVASCRIPT =================
        elif req.lang == "javascript":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".js") as tmp:
                tmp.write(code.encode())
                file_path = tmp.name

            result = subprocess.run(
                ["node", file_path],
                capture_output=True,
                text=True,
                timeout=5
            )

        # ================= JAVA =================
        elif req.lang == "java":
            temp_dir = tempfile.mkdtemp()
            java_file = os.path.join(temp_dir, "Main.java")

            with open(java_file, "w") as f:
                f.write(code)

            compile_result = subprocess.run(
                ["javac", java_file],
                capture_output=True,
                text=True
            )

            if compile_result.stderr:
                return {"review": compile_result.stderr, "status": "error"}

            result = subprocess.run(
                ["java", "-cp", temp_dir, "Main"],
                capture_output=True,
                text=True,
                timeout=5
            )

        # ================= C =================
        elif req.lang == "c":
            temp_dir = tempfile.mkdtemp()

            c_file = os.path.join(temp_dir, "main.c")
            exe_file = os.path.join(temp_dir, "main.exe")

            with open(c_file, "w") as f:
                f.write(code)

            compile_result = subprocess.run(
                ["gcc", c_file, "-o", exe_file],
                capture_output=True,
                text=True
            )

            if compile_result.stderr:
                return {"review": compile_result.stderr, "status": "error"}

            result = subprocess.run(
                [exe_file],
                capture_output=True,
                text=True,
                timeout=5,
                shell=True
            )

        # ================= C# (FIXED INDENTATION) =================
        elif req.lang == "csharp":
            temp_dir = tempfile.mkdtemp()

            cs_file = os.path.join(temp_dir, "Program.cs")

            with open(cs_file, "w") as f:
                f.write(code)

            project_file = os.path.join(temp_dir, "Program.csproj")

            with open(project_file, "w") as f:
                f.write("""
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
""")

            result = subprocess.run(
                ["dotnet", "run", "--project", temp_dir],
                capture_output=True,
                text=True,
                timeout=10
            )

        # ================= SAFE OUTPUT =================
        output = result.stdout.strip() if result and result.stdout else ""
        error = result.stderr.strip() if result and result.stderr else ""

        if error:
            return {"review": error, "status": "error"}

        if output:
            return {"review": output, "status": "success"}

        return {"review": "⚠️ Code executed successfully but no output", "status": "success"}

    except subprocess.TimeoutExpired:
        return {"review": "❌ Code execution timeout", "status": "error"}

    except Exception as e:
        return {"review": str(e), "status": "error"}
    
    
    # ================= SIMPLE MEMORY DB =================
users = {}

# ================= CHAT API =================
@app.post("/chat")
def chat(req: ChatReq):
    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a helpful coding assistant."},
                {"role": "user", "content": req.message}
            ]
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        return {"reply": str(e)}

# ================= RUN BOT =================
@app.post("/run-bot")
def run_bot(req: BotRequest):

    return {
        "output": f"{req.bot_name} analyzed: {req.message}"
    }

# ================= GAME API =================
@app.get("/game/{name}")
def game(name: str):

    if name == "python":
        return {"q": "What is output of print(3*3)?", "a": "9"}

    if name == "java":
        return {"task": "Write a for loop in Java"}

    if name == "c":
        return {"sequence": ["A", "B", "C", "D"]}

    if name == "csharp":
        return {"text": "Console.WriteLine('Hello AI');"}

    return {"error": "Game not found"}

# ================= REGISTER =================
@app.post("/register")
def register(req: Auth):

    if req.email in users:
        return {"detail": "User already exists"}

    users[req.email] = req.password
    return {"message": "User created successfully"}

# ================= LOGIN =================
@app.post("/login")
def login(req: Auth):

    if req.email not in users:
        return {"detail": "User not found"}

    if users[req.email] != req.password:
        return {"detail": "Wrong password"}

    return {"token": "dummy-token-123"}