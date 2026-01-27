const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function buildHeaders(token, json = true) {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, { method = "GET", token, body } = {}) {
  const effectiveToken = token ?? localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(effectiveToken, body !== undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  createUser: (payload) => request("/api/users", { method: "POST", body: payload }),
  getUsers: (token) => request("/api/users", { token }),
  getRoles: (token) => request("/api/roles", { token }),
  updateUser: (token, id, payload) => request(`/api/users/${id}`, { method: "PUT", token, body: payload }),
  getEmployees: (token) => request("/api/employees", { token }),
  createEmployee: (token, payload) => request("/api/employees", { method: "POST", token, body: payload }),
  getDepartments: (token) => request("/api/departments", { token }),
  createDepartment: (token, payload) => request("/api/departments", { method: "POST", token, body: payload }),
  updateDepartment: (token, id, payload) => request(`/api/departments/${id}`, { method: "PUT", token, body: payload }),
  deleteDepartment: (token, id) => request(`/api/departments/${id}`, { method: "DELETE", token }),
  getAttendance: (token) => request("/api/attendance", { token }),
  getLeaves: (token) => request("/api/leaves", { token }),
  getPayrolls: (token) => request("/api/payroll", { token }),
  getRecruitment: (token) => request("/api/recruitments", { token }),
  getContracts: (token) => request("/api/contracts", { token }),
  createContract: (token, payload) => request("/api/contracts", { method: "POST", token, body: payload }),
  updateContract: (token, id, payload) => request(`/api/contracts/${id}`, { method: "PUT", token, body: payload }),
  deleteContract: (token, id) => request(`/api/contracts/${id}`, { method: "DELETE", token }),
  getPositions: (token) => request("/api/positions", { token }),
  createPosition: (token, payload) => request("/api/positions", { method: "POST", token, body: payload }),
  updatePosition: (token, id, payload) => request(`/api/positions/${id}`, { method: "PUT", token, body: payload }),
  deletePosition: (token, id) => request(`/api/positions/${id}`, { method: "DELETE", token }),
  getPublicRecruitments: () => request("/api/recruitments"),
  getRecruitmentById: (id) => request(`/api/recruitments/${id}`),
  createCandidate: (payload) => request("/api/candidates", { method: "POST", body: payload }),
  getEmployeeById: (token, id) => request(`/api/employees/${id}`, { token }),

  createEmployee: (token, payload) =>
    request("/api/employees", { method: "POST", token, body: payload }),

  updateEmployee: (token, id, payload) =>
    request(`/api/employees/${id}`, { method: "PUT", token, body: payload }),

  deleteEmployee: (token, id) =>
    request(`/api/employees/${id}`, { method: "DELETE", token }),

};
