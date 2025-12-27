"use client";

import { useParams } from "next/navigation";
import { ChatInterface } from "../../components/ChatInterface";
import { MetricsDashboard } from "../../components/MetricsDashboard";
import { useSocketMetrics } from "../../hooks/useSocketMetrics";

export default function DynamicChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const { metrics } = useSocketMetrics();

  
  return (
    <div className="h-full flex flex-col p-6 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Chat window takes most of the screen */}
        <div className="lg:col-span-3 h-[85vh]">
          <ChatInterface agentId={agentId} />
        </div>

        {/* Analytics on the side */}
        <div className="flex flex-col gap-4">
          <MetricsDashboard 
            title="Live Latency" 
            data={metrics.latency} 
            color="#10b981"
            dataKey="value"
            />
          <MetricsDashboard 
            title="Token Usage" 
            data={metrics.tokens} 
            color="#10b981" 
            dataKey="value"
            />
        </div>
      </div>
    </div>
  );
}