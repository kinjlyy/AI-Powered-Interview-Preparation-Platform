const API_URL = "http://localhost:5000/api/auth";

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json();
}

export async function signup(data) {
  return fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .then((result) => {
      localStorage.setItem("token", result.token);
      return result;
    });
}

export async function login(data) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .then((result) => {
      localStorage.setItem("token", result.token);
      return result;
    });
}

