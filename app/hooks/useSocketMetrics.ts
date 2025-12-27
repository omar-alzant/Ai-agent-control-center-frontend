import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';

export function useSocketMetrics() {
    const [metrics, setMetrics] = useState({
      latency: [] as any[],
      tokens: [] as any[],
      messages: [] as any[]
    });
    const [isLive, setIsLive] = useState(false);
  
    useEffect(() => {
      const onConnect = () => setIsLive(true);
      const onDisconnect = () => setIsLive(false);

      const onTelemetry = (newPoint: any) => {
        setMetrics((prev) => {
          // Standardize the key: if type is 'token', use 'tokens'
          let targetKey = newPoint.type === 'token' ? 'tokens' : (newPoint.type as keyof typeof metrics);
          
          // Debugging: Check if data is actually arriving
          console.log("Incoming socket data:", newPoint);
      
          if (!prev[targetKey]) {
            console.warn(`Metric type "${newPoint.type}" not found in state keys.`);
            return prev;
          }
      
          return {
            ...prev,
            [targetKey]: [...prev[targetKey], {
              ...newPoint,
              // Ensure the chart finds a 'value' property if that's what dataKey expects
              value: newPoint.value || newPoint.count || 0 
            }].slice(-20)
          };
        });
      };
  
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('telemetry_update', onTelemetry);
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('telemetry_update', onTelemetry);
      };
    }, []);
  
    return { metrics, isLive };
  }