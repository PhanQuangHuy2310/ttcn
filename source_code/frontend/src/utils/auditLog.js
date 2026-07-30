// src/utils/auditLog.js
// PHASE 5: Frontend audit log helper
// Call auditLog(userId, 'ACTION_TYPE', 'Description') anywhere to record

import { auditLogsService } from '../services/supabaseService';

export const AUDIT_ACTIONS = {
  // Auth
  LOGIN:               'LOGIN',
  LOGOUT:              'LOGOUT',
  // Exam
  EXAM_START:          'START_EXAM',
  EXAM_SUBMIT:         'SUBMIT_EXAM',
  EXAM_CREATE:         'CREATE_EXAM',
  EXAM_UPDATE:         'UPDATE_EXAM',
  EXAM_DELETE:         'DELETE_EXAM',
  // Users
  USER_CREATE:         'CREATE_USER',
  USER_UPDATE:         'UPDATE_USER',
  USER_DELETE:         'DELETE_USER',
  // Classes
  CLASS_CREATE:        'CREATE_CLASS',
  CLASS_UPDATE:        'UPDATE_CLASS',
  // Materials
  MATERIAL_UPLOAD:     'UPLOAD_MATERIAL',
  MATERIAL_DELETE:     'DELETE_MATERIAL',
  // Questions
  QUESTION_CREATE:     'CREATE_QUESTION',
  QUESTION_DELETE:     'DELETE_QUESTION',
  // Grading
  ESSAY_GRADED:        'GRADE_SUBMISSION',
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
