const BASE_URL = "http://127.0.0.1:8000";

export const loginUser = async (email, password) => {
  const res = await fetch(BASE_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

export const registerUser = async (email, password) => {
  const res = await fetch(BASE_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

export const reviewCode = async (code, lang) => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + "/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ code, lang })
  });

  return res.json();
};

export const getHistory = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + "/history", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
};