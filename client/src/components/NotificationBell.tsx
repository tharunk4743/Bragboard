import React, { useEffect, useState, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { apiService } from "../services/apiService";
import { Notification } from "../data/types";
import { useAuth } from "../context/AuthContext";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
};

const NotificationBell: React.FC = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    try {
      const data = await apiService.getNotifications();
      setNotes(data);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  useEffect(() => {
    load();
    // simple polling every 30s for now
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const unread = notes.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    try {
      await apiService.markNotificationRead(id);
      setNotes((prev) => prev.map((p) => (p.id === id ? { ...p, isRead: true } : p)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAll = async () => {
    try {
      await apiService.markAllNotificationsRead();
      setNotes((prev) => prev.map((p) => ({ ...p, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  if (!authState?.user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unread > 0 && (
          <span className="absolute -top-0 -right-0 inline-flex items-center justify-center px-2 py-0.5 text-[10px] rounded-full bg-rose-500 text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-slate-200 z-40">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <strong>Notifications</strong>
            <div className="flex items-center space-x-2">
              <button className="text-xs text-slate-500 hover:text-slate-700" onClick={handleMarkAll}>
                Mark all read
              </button>
              <button className="text-xs text-slate-400 hover:text-slate-700" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-auto">
            {notes.length === 0 && <div className="p-4 text-sm text-slate-500">No notifications</div>}
            {notes.map((n) => (
              <div key={n.id} className={`p-3 border-b hover:bg-slate-50 ${n.isRead ? "bg-white" : "bg-amber-50"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{n.title || "Notification"}</div>
                    <div className="text-xs text-slate-600">{n.content}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{formatDate(n.createdAt)}</div>
                  </div>
                  <div className="ml-3 flex flex-col items-end space-y-2">
                    {!n.isRead ? (
                      <button className="p-1 text-emerald-600" onClick={() => handleMarkRead(n.id)} title="Mark read">
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Read</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
