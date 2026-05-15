import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
# Load API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="AI Code Reviewer")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class CodeRequest(BaseModel):
    code: str

# Root endpoint (optional, for testing)
@app.get("/")
def read_root():
    return {"message": "AI Code Reviewer Backend is running!"}

# Review endpoint
@app.post("/review")
def review_code(request: CodeRequest):
    code = request.code
    prompt = f"""
    Review this code and give improvements, bugs, best practices, and a code quality score:
    {code}
    """

    try:
        # Use GPT-3.5 instead of GPT-4
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # ✅ GPT-3.5 works without subscription
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=500
        )
        # Access the AI response
        ai_review = response.choices[0].message.content.strip()
        return {"review": ai_review}

    except Exception as e:
        return {"review": f"Error: {str(e)}"}
