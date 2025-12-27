"use client";

import { AgentList } from "../components/AgentList";
import { useSocketMetrics } from "../hooks/useSocketMetrics";
import { MetricsDashboard } from "../components/MetricsDashboard";
import { Activity, Bot, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { metrics, isLive } = useSocketMetrics();

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* 1. Header with System Status */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Agent Workspace</h1>
          <p className="text-zinc-400 mt-1">Global monitoring and management of your AI fleet.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-medium uppercase text-zinc-300">
              {isLive ? 'Network Live' : 'Connecting...'}
            </span>
          </div>
          <Link href="/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
            <PlusCircle size={18} /> New Agent
          </Link>
        </div>
      </header>

      {/* 2. Top-level Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <MetricsDashboard title="Global Latency (ms)" data={metrics.latency} color="#10b981" dataKey="value" />
        <MetricsDashboard title="Global Throughput (tokens)" data={metrics.tokens} color="#3b82f6" dataKey="value" />
      </div>

      {/* 3. The Agent Inventory */}
      <section>
        <div className="flex items-center gap-2 mb-6 text-zinc-300">
          <Bot size={22} className="text-blue-500" />
          <h2 className="text-xl font-semibold">Active Inventory</h2>
        </div>
        <AgentList />
      </section>
    </main>
  );
}