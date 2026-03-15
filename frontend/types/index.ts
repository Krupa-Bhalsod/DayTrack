export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export interface ArchivedTask extends Task {
  archive_date: string;
  archived_at: string;
}

export interface DailySummary {
  _id: string;
  user_id: string;
  date: string;
  tasks_created: number;
  tasks_completed: number;
  tasks_pending: number;
  completion_percentage: number;
  generated_at: string;
}
