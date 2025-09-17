export interface User {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  language?: string | null;
  flags?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  language?: string | null;
  avatar?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  timeLimit?: string | null;
  status?: string;
  projectId?: string | null;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  timeLimit?: string | null;
  status?: string;
  projectId?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  timeLimit?: string | null;
  status?: string;
  projectId?: string | null;
}


