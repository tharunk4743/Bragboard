import axios, { AxiosInstance } from "axios";
import { UserRole } from "../data/types";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE as string) || "http://127.0.0.1:8000";

axios.defaults.baseURL = API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

if (typeof window !== "undefined") {
  console.debug("API_BASE_URL:", API_BASE_URL);
}

// attach auth token automatically
axios.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      if (!cfg.headers) (cfg as any).headers = {};
      (cfg.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return cfg;
});

axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    console.error("API request failed:", {
      url: error?.config?.url,
      method: error?.config?.method,
      message: error?.message,
      status: error?.response?.status,
      responseData: error?.response?.data,
    });
    return Promise.reject(error);
  }
);

export const apiService = {
  // LOGIN
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // SIGNUP
  async signup(
    email: string,
    fullName: string,
    password: string,
    role: UserRole
  ) {
    const response = await api.post("/auth/signup", {
      email,
      full_name: fullName,
      password,
      role,
    });
    return response.data;
  },

  // SHOUTOUT LIST
  async getShoutouts() {
    const r = await api.get("/shoutouts");
    return (r.data || []).map((s: any) => ({
      id: String(s.id),
      title: s.title,
      description: s.content || s.description || "",
      category: s.category || "Teamwork",
      skills: s.skills || [],
      creatorId: s.author_id ? String(s.author_id) : null,
      recipientIds: s.recipient_ids || [],
      recipients: s.recipients || [],
      comments: s.comments || [],
      cheers: s.cheers || 0,
      createdAt: s.created_at || new Date().toISOString(),
    }));
  },

  // SINGLE SHOUTOUT
  async getShoutoutById(id: string | number) {
    const r = await api.get(`/shoutouts/${id}`);
    const s = r.data;
    return {
      id: String(s.id),
      title: s.title,
      description: s.content || s.description || "",
      category: s.category || "Teamwork",
      skills: s.skills || [],
      creatorId: s.author_id ? String(s.author_id) : null,
      recipientIds: s.recipient_ids || [],
      recipients: s.recipients || [],
      comments: s.comments || [],
      cheers: s.cheers || 0,
      createdAt: s.created_at || new Date().toISOString(),
    };
  },

  // CREATE SHOUTOUT  👉 use in your old UI
  async createShoutout(payload: {
    title: string;
    content: string;
    author_id: string;
    recipient_ids: string[];
  }) {
    const r = await api.post("/shoutouts", payload);
    return r.data;
  },

  // UPDATE SHOUTOUT
  async updateShoutout(
    id: string | number,
    payload: {
      title: string;
      content: string;
      recipient_ids: string[];
    }
  ) {
    const r = await api.put(`/shoutouts/${id}`, payload);
    return r.data;
  },

  // DELETE SHOUTOUT
  async deleteShoutout(id: string | number) {
    const r = await api.delete(`/shoutouts/${id}`);
    return r.data;
  },

  // COMMENTS
  async addComment(
    shoutoutId: string | number,
    userId: string | number,
    content: string,
    userName?: string
  ) {
    const payload: any = { user_id: userId, content };
    if (userName) payload.user_name = userName;
    const r = await api.post(`/shoutouts/${shoutoutId}/comments`, payload);
    return r.data;
  },

  // CHEERS
  async toggleCheer(shoutoutId: string | number, userId: string | number) {
    const r = await api.post(`/shoutouts/${shoutoutId}/cheer`, {
      user_id: userId,
    });
    return r.data;
  },

  // EMPLOYEES
  async getEmployees() {
    const r = await api.get("/employees");
    return r.data;
  },

  async toggleEmployeeStatus(id: string | number) {
    const r = await api.put(`/employees/${id}/toggle`);
    return r.data;
  },

  // LEADERBOARD
  async getLeaderboard() {
    const r = await api.get("/leaderboard");
    return (r.data || []).map((u: any, idx: number) => ({
      userId: String(u.id ?? idx),
      fullName: u.full_name ?? u.name ?? "",
      avatarUrl: u.avatar_url ?? null,
      shoutoutCount: u.shoutout_count ?? 0,
      cheerCount: u.cheer_count ?? u.cheers ?? 0,
      points: u.points ?? 0,
      rank: u.rank ?? idx + 1,
      badge: u.badge ?? "none",
    }));
  },

  // NOTIFICATIONS
  async getNotifications() {
    const r = await api.get("/notifications");
    return r.data || [];
  },

  async markNotificationRead(notificationId: string | number) {
    const r = await api.put(`/notifications/${notificationId}/read`);
    return r.data;
  },

  // REWARDS (placeholder)
  async getRewards() {
    return [];
  },

  // PASSWORD RESET
  async requestPasswordReset(email: string) {
    const r = await api.post("/auth/reset-request", { email });
    return r.data;
  },

  async resetPassword(token: string, password: string) {
    const r = await api.post("/auth/reset", { token, password });
    return r.data;
  },
};

export default api;
