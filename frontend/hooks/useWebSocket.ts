"use client";

import { useState, useEffect, useCallback } from "react";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message?: string;
  data?: any;
}

export function useWebSocket(userId: string, onMessageReceived?: (data: any) => void) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

  const playSound = useCallback(() => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Audio play deferred:", err));
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`);

    ws.onopen = () => setStatus("connected");
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newNotification: Notification = { ...data, id: Date.now() };
      
      setNotifications(prev => [newNotification, ...prev]);
      playSound();
      
      if (onMessageReceived) {
        onMessageReceived(data);
      }

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    };

    ws.onclose = () => setStatus("disconnected");

    return () => ws.close();
  }, [userId, onMessageReceived, playSound]);

  return { notifications, status };
}
