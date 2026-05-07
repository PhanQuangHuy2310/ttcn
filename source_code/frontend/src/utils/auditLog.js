// src/utils/auditLog.js
// PHASE 5: Frontend audit log helper
// Call auditLog(userId, 'ACTION_TYPE', 'Description') anywhere to record

import { auditLogsService } from '../services/supabaseService';

export const AUDIT_ACTIONS = {
  // Auth
  LOGIN:               'LOGIN',
  LOGOUT:              'LOGOUT',
  // Exam
  EXAM_START:          'EXAM_START',
  EXAM_SUBMIT:         'EXAM_SUBMIT',
  EXAM_CREATE:         'EXAM_CREATE',
  EXAM_PUBLISH:        'EXAM_PUBLISH',
  EXAM_CLOSE:          'EXAM_CLOSE',
  EXAM_DELETE:         'EXAM_DELETE',
  // Users
  USER_CREATE:         'USER_CREATE',
  USER_DELETE:         'USER_DELETE',
  USER_DEACTIVATE:     'USER_DEACTIVATE',
  USER_REACTIVATE:     'USER_REACTIVATE',
  // Classes
  CLASS_JOIN:          'CLASS_JOIN',
  CLASS_CREATE:        'CLASS_CREATE',
  CLASS_DELETE:        'CLASS_DELETE',
  STUDENT_REMOVE:      'STUDENT_REMOVE',
  // Materials
  MATERIAL_UPLOAD:     'MATERIAL_UPLOAD',
  MATERIAL_DELETE:     'MATERIAL_DELETE',
  // Questions
  QUESTION_CREATE:     'QUESTION_CREATE',
  QUESTION_DELETE:     'QUESTION_DELETE',
  // Grading
  ESSAY_GRADED:        'ESSAY_GRADED',
};

/**
 * Record an audit log entry.
 * Silently swallows errors so it never breaks the main flow.
 *
 * @param {string} userId    - UUID of user performing the action
 * @param {string} action    - One of AUDIT_ACTIONS
 * @param {string} description - Human-readable log line
 * @param {object} metadata  - Optional extra data (JSON)
 */
export const auditLog = async (userId, action, description, metadata = undefined) => {
  if (!userId || !action) return;
  try {
    await auditLogsService.insert({ user_id: userId, action_type: action, description, metadata });
  } catch {
    // Silent fail — audit logging must never break user actions
  }
};
