export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members: string[];
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  color?: string;
  startDate?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  position: number;
}

export interface Board {
  _id: string;
  project: string;
  name: string;
  description?: string;
  columns: BoardColumn[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string;
  board?: string;
  column: string;
  createdBy: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  dueDate?: string;
  labels: string[];
  attachments: string[];
  position: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  task: string;
  user: string | User;
  message: string;
  mentions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationItem {
  _id: string;
  user: string;
  message: string;
  type: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
