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

  // Read body as text first to handle empty responses (e.g., DELETE returning empty body)
  const text = await res.text();
  let parsed = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // If response is not JSON, keep raw text
      parsed = text;
    }
  }

  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`;
    try {
      const err = parsed;
      // extract raw message or assemble from errors array
      let raw = err && (err.message || err.error || "");
      if (!raw && err && Array.isArray(err.errors)) {
        raw = err.errors.map((e) => e.defaultMessage || e.message || JSON.stringify(e)).join("; ");
      }

      const translateValidation = (msg) => {
        if (!msg) return msg;
        const lower = String(msg).toLowerCase();
        if (lower.includes("bad credentials")) return "Sai tên đăng nhập hoặc mật khẩu";
        if (lower.includes("validation failed for argument")) return "Bạn chưa nhập Username";
        if (lower.includes("must be a well-formed email address") || lower.includes("well-formed email")) return "Email không hợp lệ";
        if (lower.includes("must not be null") || lower.includes("must not be blank") || lower.includes("not be empty")) return "Trường bắt buộc, không được để trống";

        const fieldMatch = msg.match(/on field '([^']+)'/i);
        const defaultMatch = msg.match(/default message \[([^\]]+)\]/i);
        if (fieldMatch && defaultMatch) {
          const field = fieldMatch[1];
          const def = defaultMatch[1];
          const fieldNames = { email: 'Email', username: 'Tên đăng nhập', fullName: 'Họ và tên', phone: 'Số điện thoại' };
          let defTranslated = def;
          if (/well-formed email/i.test(def)) defTranslated = 'phải là địa chỉ email hợp lệ';
          else if (/size must be between (\d+) and (\d+)/i.test(def)) {
            const m = def.match(/size must be between (\d+) and (\d+)/i);
            defTranslated = `độ dài phải từ ${m[1]} đến ${m[2]}`;
          } else if (/must not be null/i.test(def) || /must not be blank/i.test(def)) defTranslated = 'không được để trống';
          else if (/pattern/i.test(def)) defTranslated = 'không đúng định dạng';
          return `Trường '${fieldNames[field] || field}' không hợp lệ: ${defTranslated}`;
        }

        if (lower.includes('email')) return 'Chưa nhập email hoặc email không hợp lệ';
        return msg;
      };

      const translated = translateValidation(raw || (err && (err.message || err.error)));
      errorMessage = translated || errorMessage;
    } catch {
      // ignore parsing errors
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;
  return parsed;
}

export const api = {
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload }),
  createUser: (payload) =>
    request("/api/users", { method: "POST", body: payload }),
  getUsers: (token) => request("/api/users", { token }),
  getRoles: (token) => request("/api/roles", { token }),
  updateUser: (token, id, payload) =>
    request(`/api/users/${id}`, { method: "PUT", token, body: payload }),
  getEmployees: (token) => request("/api/employees", { token }),
  createEmployee: (token, payload) =>
    request("/api/employees", { method: "POST", token, body: payload }),
  getDepartments: (token) => request("/api/departments", { token }),
  createDepartment: (token, payload) =>
    request("/api/departments", { method: "POST", token, body: payload }),
  updateDepartment: (token, id, payload) =>
    request(`/api/departments/${id}`, { method: "PUT", token, body: payload }),
  deleteDepartment: (token, id) =>
    request(`/api/departments/${id}`, { method: "DELETE", token }),
  getAttendance: (token) => request("/api/attendance", { token }),
  getLeaves: (token) => request("/api/leaves", { token }),
  createLeave: (token, payload) => request("/api/leaves", { method: "POST", token, body: payload }),
  getPayrolls: (token) => request("/api/payroll", { token }),
  getRecruitment: (token) => request("/api/recruitments", { token }),
  createRecruitment: (token, payload) => request("/api/recruitments", { method: "POST", token, body: payload }),
  updateRecruitment: (token, id, payload) => request(`/api/recruitments/${id}`, { method: "PUT", token, body: payload }),
  deleteRecruitment: (token, id) => request(`/api/recruitments/${id}`, { method: "DELETE", token }),
  getContracts: (token) => request("/api/contracts", { token }),
  createContract: (token, payload) =>
    request("/api/contracts", { method: "POST", token, body: payload }),
  updateContract: (token, id, payload) =>
    request(`/api/contracts/${id}`, { method: "PUT", token, body: payload }),
  deleteContract: (token, id) =>
    request(`/api/contracts/${id}`, { method: "DELETE", token }),
  getPositions: (token) => request("/api/positions", { token }),
  createPosition: (token, payload) =>
    request("/api/positions", { method: "POST", token, body: payload }),
  updatePosition: (token, id, payload) =>
    request(`/api/positions/${id}`, { method: "PUT", token, body: payload }),
  deletePosition: (token, id) =>
    request(`/api/positions/${id}`, { method: "DELETE", token }),
  getPublicRecruitments: () => request("/api/recruitments"),
  getRecruitmentById: (id) => request(`/api/recruitments/${id}`),
  createCandidate: (payload) =>
    request("/api/candidates", { method: "POST", body: payload }),
  getEmployeeById: (token, id) => request(`/api/employees/${id}`, { token }),

  createEmployee: (token, payload) =>
    request("/api/employees", { method: "POST", token, body: payload }),

  updateEmployee: (token, id, payload) =>
    request(`/api/employees/${id}`, { method: "PUT", token, body: payload }),

  deleteEmployee: (token, id) =>
    request(`/api/employees/${id}`, { method: "DELETE", token }),
  approveLeave: (token, id, payload) =>
    request(`/api/leaves/${id}/approve`, {
      method: "PUT",
      token,
      body: payload,
    }),
  rejectLeave: (token, id, payload) =>
    request(`/api/leaves/${id}/reject`, {
      method: "PUT",
      token,
      body: payload,
    }),
  // Work schedules
  getWorkSchedules: (token) => request('/api/work-schedules', { token }),
  createWorkSchedule: (token, payload) => request('/api/work-schedules', { method: 'POST', token, body: payload }),
  updateWorkSchedule: (token, id, payload) => request(`/api/work-schedules/${id}`, { method: 'PUT', token, body: payload }),
  deleteWorkSchedule: (token, id) => request(`/api/work-schedules/${id}`, { method: 'DELETE', token }),
};
