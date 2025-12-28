"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext"; 


export default function CreateAgentPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); 
  const [formData, setFormData] = useState({
    name: "",
    systemPrompt: "",
    model: "gpt-3.5-turbo",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAgent(formData);
      // Refresh the page/sidebar and go to the dashboard
      router.push("/dashboard");
      router.refresh(); 
    } catch (err) {
      alert("Failed to create agent");
    }
  };
  if (loading || !user) return <div className="p-8 text-white">Loading...</div>;
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Configure New Agent</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Agent Name</label>
          <input
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Customer Support Bot"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">System Prompt</label>
          <textarea
            required
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.systemPrompt}
            onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
            placeholder="Describe the agent's personality and instructions..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Model</label>
          <select
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
            <option value="gpt-4">GPT-4 (Smart)</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
          Create Agent
        </button>
      </form>
    </div>
  );
}