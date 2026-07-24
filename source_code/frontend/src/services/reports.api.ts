import { supabase } from '../lib/supabase';

export const reportsApi = {
  getStudyAlerts: async () => {
    // Get all submissions for exams taught by the current teacher
    // Since RLS automatically filters submissions by teacher_id, we just select them.
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        id, score, status, submitted_at,
        users!submissions_student_id_fkey (id, full_name, email, student_id),
        exams (id, title, course_id)
      `)
      .neq('score', null);

    if (error) {
      console.error('Error fetching study alerts:', error);
      return { data: null, error: error.message };
    }

    // Process alerts
    const studentMap = {};

    data.forEach(sub => {
      const studentId = sub.users?.id;
      if (!studentId) return;
      
      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          user: sub.users,
          submissions: [],
          totalScore: 0,
          lowScoreCount: 0
        };
      }
      
      const score = parseFloat(sub.score);
      studentMap[studentId].submissions.push(sub);
      studentMap[studentId].totalScore += score;
      if (score < 5) {
        studentMap[studentId].lowScoreCount += 1;
      }
    });

    // Filter students at risk
    const alerts = [];
    Object.values(studentMap).forEach(student => {
      const count = student.submissions.length;
      const avg = count > 0 ? (student.totalScore / count).toFixed(1) : 0;
      
      // Alert criteria: average < 5 OR 2 or more exams < 5
      if (avg < 5 || student.lowScoreCount >= 2) {
        alerts.push({
          ...student.user,
          averageScore: parseFloat(avg),
          lowScoreCount: student.lowScoreCount,
          totalExams: count
        });
      }
    });

    // Sort by most at risk
    alerts.sort((a, b) => a.averageScore - b.averageScore);

    return { data: alerts, error: null };
  }
};
