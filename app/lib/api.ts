const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const api = {
  // Agent Management
  async getAgents() {
    const res = await fetch(`${BASE_URL}/api/agents`);
    return res.json();
  },

  async createAgent(agentData: { name: string; systemPrompt: string; model: string }) {
    const res = await fetch(`${BASE_URL}/api/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentData),
    });
    return res.json();
  },

  getChatHistory: async (agentId: string) => {
    const res = await fetch(`${BASE_URL}/api/message/${agentId}`);
    if (!res.ok) return [];
    return res.json();
  },
  // Chat
  async sendMessage(agentId: string, message: string) {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, message }),
    });
    return res.json();
  }
};