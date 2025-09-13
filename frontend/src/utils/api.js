// Simple fetch helpers and base URL config.
// Change API_BASE if your backend runs on a different host/port.
export const API_BASE = "http://127.0.0.1:8000";

export async function postForm(url, formBody, token) {
  const res = await fetch(API_BASE + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formBody,
  });
  const text = await res.text();
  // Try parse JSON if possible
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: text };
  }
}

export async function apiGet(url, token) {
  const res = await fetch(API_BASE + url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  return { status: res.status, data };
}

export async function apiPostJson(url, jsonBody, token) {
  const res = await fetch(API_BASE + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(jsonBody),
  });
  const data = await res.json();
  return { status: res.status, data };
}
