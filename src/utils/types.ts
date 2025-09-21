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
  rankingCriteria?: string | null;
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
  rankingCriteria?: string | null;
  timeLimit?: string | null;
  status?: string;
  projectId?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  rankingCriteria?: string | null;
  timeLimit?: string | null;
  status?: string;
  projectId?: string | null;
}

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  accessCode: string;
  finalDate?: string | null;
  isActive: boolean;
  clientId: string;
  client?: Client;
  tasks?: Task[];
  candidates?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDto {
  title: string;
  description?: string | null;
  finalDate?: string | null;
  isActive?: boolean;
  clientId: string;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string | null;
  finalDate?: string | null;
  isActive?: boolean;
  clientId?: string;
}

export interface ImproveDescriptionDto {
  text: string;
}

export interface ImproveDescriptionResponse {
  result: string;
}


// AJTBD refine-quiz types
export interface AjtbdSuggestion {
  kind: "variation" | "follow_up";
  suggestion: string;
}

export interface AjtbdResponse {
  problem: AjtbdSuggestion[];
  context: AjtbdSuggestion[];
  expected_outcome: AjtbdSuggestion[];
}

export interface RefineQuizDto {
  problem: string;
  context: string;
  expected_outcome: string;
}


