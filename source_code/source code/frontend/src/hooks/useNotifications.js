// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { notificationsService } from '../services/supabaseService';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await notificationsService.getForUser(userId);
    const items = data ?? [];
    setNotifications(items);
    setUnreadCount(items.filter(n => !n.read_status).length);
    setLoading(false);
  }, [userId]);

  // Initial load
  useEffect(() => { load(); }, [load]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          const newNotif = payload.new;
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          const updated = payload.new;
          setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
          setUnreadCount(prev => prev); // Will be accurate on next reload
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markRead = useCallback(async (id) => {
    await notificationsService.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_status: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Đã sửa: Gọi trực tiếp Supabase để tránh lỗi thiếu API function
  const markAllRead = useCallback(async () => {
    if (!userId) return;
    await supabase.from('notifications').update({ read_status: true }).eq('user_id', userId);
    setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
    setUnreadCount(0);
  }, [userId]);

  return { notifications, loading, unreadCount, markRead, markAllRead, reload: load };
};