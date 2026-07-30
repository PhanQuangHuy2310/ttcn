// src/utils/notification.js
// Universal Helper for creating real-time notifications in Supabase
// Never throws errors so it never breaks main workflows

import { notificationsService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

/**
 * Send a notification to a specific user
 * @param {string} userId - Target user ID
 * @param {string} title - Title of the notification
 * @param {string} message - Content message
 * @param {string} type - 'SYSTEM' | 'EXAM_OPEN' | 'EXAM_GRADED' | 'CLASS_JOIN' | 'MATERIAL'
 * @param {string|null} actionUrl - Optional link when clicked
 */
export const sendNotification = async (userId, title, message, type = 'SYSTEM', actionUrl = null) => {
  if (!userId || !title) return;
  try {
    await notificationsService.create({
      user_id: userId,
      title,
      message,
      type,
      read_status: false,
      action_url: actionUrl,
      created_at: new Date().toISOString(),
    });
  } catch {
    // silently fail
  }
};

/**
 * Send a notification to all users of a specific role (e.g. 'ADMIN', 'TEACHER', 'STUDENT')
 */
export const sendRoleNotification = async (role, title, message, type = 'SYSTEM', actionUrl = null) => {
  try {
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('role', role);
    if (!users || users.length === 0) return;

    const notifs = users.map(u => ({
      user_id: u.id,
      title,
      message,
      type,
      read_status: false,
      action_url: actionUrl,
      created_at: new Date().toISOString(),
    }));

    await supabase.from('notifications').insert(notifs);
  } catch {
    // silently fail
  }
};
