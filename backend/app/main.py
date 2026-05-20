from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import subprocess
import tempfile
import os
from dotenv import load_dotenv

from openai import OpenAI

# ================= LOCAL IMPORTS =================
from app.db import (
    create_user,
    get_user,
    verify_password,
    save_history,
    get_history,
    get_settings,
    save_settings
)

from app.auth import (
    create_access_token,
    verify_token
)

# ================= INIT =================
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()



# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= MODELS =================
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


# ================= HOME =================
@app.get("/")
def home():
    return {"message": "🚀 AI Code Hero Backend Running Successfully"}


def ai_bot_engine(bot_name: str, message: str):
    
    system_prompt = f"You are a {bot_name}. Respond in a helpful, technical way."

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"AI Error: {str(e)}"  
    
@app.post("/run-bot")
def run_bot(req: BotRequest):

    result = ai_bot_engine(req.bot_name, req.message)

    return {
        "bot": req.bot_name,
        "input": req.message,
        "output": result
    }
# ================= REGISTER =================
@app.post("/register")
def register(user: User):
    return create_user(user.email, user.password)


# ================= LOGIN =================
@app.post("/login")
def login(data: Auth):

    email = data.email.strip().lower()
    user = get_user(email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password")

    return {
        "success": True,
        "token": create_access_token({
            "user_id": user["id"],
            "email": user["email"]
        })
    }


# ================= BOT ENGINE (ADMIN PANEL) =================
def run_bot_engine(bot_name: str, message: str):

    if "Python" in bot_name:
        return f"🐍 Python Bot: processed '{message}' → result 42"

    elif "JavaScript" in bot_name:
        return f"⚡ JS Bot: executed '{message}' → console OK"

    elif "Java" in bot_name:
        return f"☕ Java Bot: compiled '{message}' → SUCCESS"

    elif "C Bot" in bot_name:
        return f"💻 C Bot: running '{message}' → SAFE EXECUTION"

    elif "Security" in bot_name:
        return f"🔐 Security Bot: scanned '{message}' → NO THREATS"

    else:
        return "❌ Unknown bot"


# ================= RUN BOT API =================
@app.post("/run-bot")
def run_bot(req: BotRequest):
    result = run_bot_engine(req.bot_name, req.message)
    return {
        "bot": req.bot_name,
        "input": req.message,
        "output": result
    }


# ================= CODE REVIEW ENGINE =================
@app.post("/review")
def review(req: CodeReq):

    code = req.code.strip()

    if not code:
        return {"review": "❌ No code provided", "status": "error"}

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
            file_path = os.path.join(temp_dir, "Main.java")

            with open(file_path, "w") as f:
                f.write(code)

            compile_result = subprocess.run(
                ["javac", file_path],
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
                timeout=5
            )

        else:
            return {"review": "❌ Unsupported language", "status": "error"}

        output = result.stdout
        error = result.stderr

        if error:
            return {"review": error, "status": "error"}

        return {
            "review": output if output.strip() else "⚠️ No output",
            "status": "success"
        }

    except Exception as e:
        return {"review": str(e), "status": "error"}


# ================= CHAT (OPENAI) =================
@app.post("/chat")
def chat(req: ChatReq):

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful AI coding assistant."},
                {"role": "user", "content": req.message}
            ]
        )

        return {
            "reply": response.choices[0].message.content
        }

    except Exception as e:
        return {"reply": f"⚠️ AI error: {str(e)}"}


# ================= SETTINGS =================
@app.get("/settings")
def get_user_settings(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user = verify_token(token)

    return get_settings(user["user_id"])


@app.post("/settings")
def update_settings(req: SettingsReq, authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user = verify_token(token)

    save_settings(
        user["user_id"],
        int(req.dark_mode),
        req.api_key
    )

    return {"success": True}


# ================= HISTORY =================
@app.get("/history")
def history():

    try:
        return {"history": get_history(1)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))