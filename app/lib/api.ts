const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

/**
 * Helper to get headers including the Bearer token
 */
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export const api = {
  // --- Agent Management ---
  async getAgents() {
    const res = await fetch(`${BASE_URL}/api/agents`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch agents");
    return res.json();
  },

  async createAgent(agentData: { name: string; systemPrompt: string; model: string }) {
    const res = await fetch(`${BASE_URL}/api/agents`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(agentData),
    });
    if (!res.ok) throw new Error("Failed to create agent");
    return res.json();
  },

  // --- Chat & History ---
  async getMessages(agentId: string) {
    const res = await fetch(`${BASE_URL}/api/message/${agentId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return []; 
    return res.json();
  },
  
  async sendMessage(agentId: string, message: string) {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ agentId, message }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

  // --- Stats ---
  async totalTokens() {
    const res = await fetch(`${BASE_URL}/api/stats/my-tokens`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return { totalTokens: 0 };
    return res.json();
  },

  async deleteAgent(agentId: string) {
    const res = await fetch(`${BASE_URL}/api/agents/${agentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete agent");
    return res.json();
  },
};