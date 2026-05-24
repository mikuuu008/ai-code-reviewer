import random

# ================= PYTHON QUIZ =================
python_questions = [
    {"q": "What keyword defines a function in Python?", "a": "def"},
    {"q": "What symbol is used for list in Python?", "a": "[]"},
    {"q": "What function prints output?", "a": "print"},
]

def python_quiz():
    return random.choice(python_questions)


# ================= JAVA CHALLENGE =================
def java_challenge():
    return {
        "task": "Write a Java function to add two numbers",
        "starter": "int add(int a, int b) { }"
    }


# ================= C MEMORY GAME =================
def c_memory_game():
    sequence = random.sample(range(1, 10), 4)
    return {
        "sequence": sequence,
        "instruction": "Memorize this sequence"
    }


# ================= C# TYPING TEST =================
def csharp_typing():
    sentence = "FastAPI makes backend development powerful and fast"
    return {
        "text": sentence
    }