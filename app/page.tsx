"use client";

import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ChatInterface } from "./components/ChatInterface";
import { useSocketMetrics } from "./hooks/useSocketMetrics";
import { MetricsDashboard } from "./components/MetricsDashboard";

export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const { metrics, isLive } = useSocketMetrics();

  return (
    <div className="flex flex-col h-full p-6 bg-red">
      <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors text-sm">
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[85vh]">
        {/* Chat Area */}
        <div className="lg:col-span-3 h-full">
          <ChatInterface agentId={agentId} />
        </div>

        {/* Local Metrics */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Agent Performance</h3>
          <MetricsDashboard title="Latency" data={metrics.latency} color="#10b981" dataKey="value" />
          <MetricsDashboard title="Tokens" data={metrics.tokens} color="#3b82f6" dataKey="value" />
          
          <div className="mt-auto p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
             <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Connection State</p>
             <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-zinc-300">{isLive ? 'Healthy' : 'Handshaking...'}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}