import { supabase } from '../lib/supabase';

interface StudentUser {
  id: string;
  full_name?: string;
  email?: string;
  student_id?: string;
  [key: string]: any;
}

interface StudentMapItem {
  user: StudentUser;
  submissions: any[];
  totalScore: number;
  lowScoreCount: number;
}

interface AlertItem extends StudentUser {
  averageScore: number;
  lowScoreCount: number;
  totalExams: number;
}

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
    const studentMap: Record<string, StudentMapItem> = {};

    (data || []).forEach((sub: any) => {
      const user: StudentUser = Array.isArray(sub.users) ? sub.users[0] : sub.users;
      const studentId = user?.id;
      if (!studentId) return;
      
      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          user,
          submissions: [],
          totalScore: 0,
          lowScoreCount: 0
        };
      }
      
      const score = typeof sub.score === 'number' ? sub.score : parseFloat(sub.score || '0');
      if (isNaN(score)) return;

      studentMap[studentId].submissions.push(sub);
      studentMap[studentId].totalScore += score;
      if (score < 5) {
        studentMap[studentId].lowScoreCount += 1;
      }
    });

    // Filter students at risk
    const alerts: AlertItem[] = [];
    Object.values(studentMap).forEach((student: StudentMapItem) => {
      const count = student.submissions.length;
      const avgNum = count > 0 ? Number((student.totalScore / count).toFixed(1)) : 0;
      
      // Alert criteria: average < 5 OR 2 or more exams < 5
      if (avgNum < 5 || student.lowScoreCount >= 2) {
        alerts.push({
          ...student.user,
          averageScore: avgNum,
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
