import sqlite3
import os
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "saas.db")


def get_connection():
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


# ================= INIT =================
def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        content TEXT,
        response TEXT
    )
    """)

    conn.commit()
    conn.close()


init_db()


# ================= PASSWORD =================
def hash_password(password):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


# ================= USER =================
def create_user(email, password):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email=?", (email,))
    if cur.fetchone():
        return {"success": False, "error": "User exists"}

    cur.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        (email, hash_password(password))
    )

    conn.commit()
    conn.close()
    return {"success": True}


def get_user(email):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cur.fetchone()

    conn.close()
    return user

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        dark_mode INTEGER DEFAULT 1,
        api_key TEXT DEFAULT '',
        updated_at TEXT
    )
    """)

    conn.commit()
    conn.close()  
    
    
def get_settings(user_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM settings WHERE user_id=?", (user_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return {
            "dark_mode": 1,
            "api_key": ""
        }

    return row


def save_settings(user_id, dark_mode, api_key):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM settings WHERE user_id=?", (user_id,))
    exists = cur.fetchone()

    if exists:
        cur.execute("""
            UPDATE settings
            SET dark_mode=?, api_key=?, updated_at=?
            WHERE user_id=?
        """, (dark_mode, api_key, datetime.now().isoformat(), user_id))
    else:
        cur.execute("""
            INSERT INTO settings (user_id, dark_mode, api_key, updated_at)
            VALUES (?, ?, ?, ?)
        """, (user_id, dark_mode, api_key, datetime.now().isoformat()))

    conn.commit()
    conn.close()
# ================= HISTORY =================
def save_history(user_id, type, content, response):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO history (user_id, type, content, response)
        VALUES (?, ?, ?, ?)
    """, (user_id, type, content, response))

    conn.commit()
    conn.close()


def get_history(user_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM history WHERE user_id=? ORDER BY id DESC",
        (user_id,)
    )

    rows = cur.fetchall()
    conn.close()

    return rows