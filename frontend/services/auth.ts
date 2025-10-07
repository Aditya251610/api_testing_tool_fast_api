import api from "../lib/api";

export async function signup(data: { username: string; email: string; password: string }) {
  return api.post("/auth/signup", data);
}

export async function login(data: { username: string; password: string }) {
  return api.post("/auth/login", data);
}
