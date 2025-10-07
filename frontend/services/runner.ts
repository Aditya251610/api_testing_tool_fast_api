import api from "../lib/api";

export async function runTest(payload: any) {
  return api.post("/run-test/", payload);
}

export async function getLogs() {
  return api.get("/logs/");
}

export async function getLogById(id: string) {
  return api.get(`/logs/${id}`);
}
