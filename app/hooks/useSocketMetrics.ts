"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export function useSocketMetrics(agentId?: string) {
  const [isLive, setIsLive] = useState(socket.connected);
  const [totalTokens, setTotalTokens] = useState(0);
  const [metrics, setMetrics] = useState({
    latency: [] as { value: number; timestamp: string }[],
    tokens: [] as { value: number; timestamp: string }[],
  });

  useEffect(() => {
    let staleTimer: NodeJS.Timeout;

    const resetStaleTimer = () => {
      clearTimeout(staleTimer);
      setIsLive(true);
      staleTimer = setTimeout(() => {
        setIsLive(false);
      }, 5000);
    };

    function onConnect() {
      setIsLive(true);
      if (agentId) socket.emit('join_room', agentId);
    }
    
    function onDisconnect() {
      setIsLive(false);
      // Clear data on hard disconnect so charts don't show stale info
      setMetrics({ latency: [], tokens: [] });
      setTotalTokens(0);
      clearTimeout(staleTimer);
    }

    function onTelemetryUpdate(data: { type: 'latency' | 'tokens'; value: number; timestamp: string }) {
      resetStaleTimer(); // Data received, so we are definitely live

      setMetrics((prev) => {
        const key = data.type;
        const newArray = [...prev[key], { value: data.value, timestamp: data.timestamp }];
        if (newArray.length > 20) newArray.shift();
        return { ...prev, [key]: newArray };
      });

      if (data.type === 'tokens') {
        setTotalTokens((prev) => prev + data.value);
      }
    }

    // Attach listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("telemetry_update", onTelemetryUpdate);

    // Connection logic
    if (!socket.connected) {
      socket.connect();
    } else if (agentId) {
      socket.emit('join_room', agentId);
    }

    return () => {
      if (agentId) socket.emit('leave_room', agentId);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("telemetry_update", onTelemetryUpdate);
      clearTimeout(staleTimer);
    };
  }, [agentId]); 

  return { metrics, totalTokens, isLive };
}