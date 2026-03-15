"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  message?: string;
  data?: any;
}

interface NotificationCenterProps {
  notifications: Notification[];
}

export default function NotificationCenter({ notifications }: NotificationCenterProps) {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white border border-zinc-100 shadow-2xl rounded-2xl p-4 w-72 flex gap-3 pointer-events-auto"
          >
            <div className="bg-purple-100 p-2 rounded-lg h-fit text-[#702963]">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest leading-tight">{n.title}</h4>
              {n.type === "EOD_SUMMARY" ? (
                <div className="mt-2 space-y-1">
                  {n.message && (
                    <p className="text-[11px] text-[#702963] font-bold leading-tight mb-2">
                       {n.message}
                    </p>
                  )}
                  <p className="text-[10px] text-zinc-500 font-medium">
                    Date: <span className="text-zinc-900 font-bold">{n.data?.date}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 border-t border-zinc-50">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Created: <span className="text-zinc-600">{n.data?.tasks_created}</span></p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Done: <span className="text-zinc-600">{n.data?.tasks_completed}</span></p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Pending: <span className="text-zinc-600">{n.data?.tasks_pending}</span></p>
                  </div>
                  <p className="text-[11px] font-black text-[#702963] pt-0.5">
                    {n.data?.completion_percentage}% Completed
                  </p>
                  <p className="text-[9px] text-zinc-300 font-medium pt-1 border-t border-zinc-50 italic">
                    Executed: {n.data?.executed_at ? new Date(n.data.executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 mt-1 font-medium leading-relaxed">
                  {n.message || `Status updated for ${n.data?.title}`}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
