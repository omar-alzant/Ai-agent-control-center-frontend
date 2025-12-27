"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, PlusCircle, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from "../lib/api"; // Your API helper
interface Agent {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
}
export function Sidebar() {
  const pathname = usePathname();
  const [agents, setAgents] = useState<Agent[]>([]);

  // Fetch agents on mount to show in the sidebar
  useEffect(() => {
    api.getAgents()
    .then((data) => {
      setAgents(Array.isArray(data) ? data : []);
    })
    .catch(console.error);  }, []);

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col p-4 gap-2">
      <div className="flex items-center gap-2 px-2 mb-8 text-white font-bold text-lg">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">A</div>
        AgentCenter
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-3 mb-2">Menu</p>
          <Link href="/" className={clsx("flex items-center gap-3 px-3 py-2 rounded-lg", pathname === "/" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white")}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/create" className={clsx("flex items-center gap-3 px-3 py-2 rounded-lg", pathname === "/create" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white")}>
            <PlusCircle size={18} /> New Agent
          </Link>
        </div>

        {/* Dynamic Agents List */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-3 mb-2">Active Agents</p>
          <div className="max-h-[300px] overflow-y-auto space-y-1">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/chat/${agent.id}`}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  pathname === `/chat/${agent.id}` 
                    ? "bg-blue-600/10 text-blue-500 font-medium border border-blue-600/20" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <Bot size={16} />
                <span className="truncate">{agent.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}