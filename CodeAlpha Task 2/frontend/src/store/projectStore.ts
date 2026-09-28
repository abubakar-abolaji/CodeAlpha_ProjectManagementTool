import { create } from 'zustand';
import { api } from '../lib/api';
import type { ApiResponse, Board, Project, Task, User } from '../types';

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  boards: Board[];
  tasks: Task[];
  members: User[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (payload: { name: string; description?: string; priority?: string; color?: string }) => Promise<Project | null>;
  fetchBoards: (projectId: string) => Promise<void>;
  createBoard: (projectId: string, payload: { name: string; description?: string; columns?: { id: string; name: string; position: number }[] }) => Promise<void>;
  fetchTasks: (projectId?: string) => Promise<void>;
  createTask: (payload: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProject: null,
  boards: [],
  tasks: [],
  members: [],
  loading: false,
  fetchProjects: async () => {
    set({ loading: true });
    const { data } = await api.get<ApiResponse<Project[]>>('/projects');
    set({ projects: data.data, loading: false });
  },
  fetchProject: async (projectId) => {
    set({ loading: true });
    const { data } = await api.get<ApiResponse<Project>>(`/projects/${projectId}`);
    set({ activeProject: data.data, loading: false });
    await get().fetchBoards(projectId);
    await get().fetchTasks(projectId);
    const members = await api.get<ApiResponse<User[]>>(`/projects/${projectId}/members`);
    set({ members: members.data.data });
  },
  createProject: async (payload) => {
    const { data } = await api.post<ApiResponse<Project>>('/projects', payload);
    const project = data.data;
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },
  fetchBoards: async (projectId) => {
    const { data } = await api.get<ApiResponse<Board[]>>(`/projects/${projectId}/boards`);
    set({ boards: data.data });
  },
  createBoard: async (projectId, payload) => {
    await api.post(`/projects/${projectId}/boards`, payload);
    await get().fetchBoards(projectId);
  },
  fetchTasks: async (projectId) => {
    const url = projectId ? `/tasks?project=${projectId}` : '/tasks';
    const { data } = await api.get<ApiResponse<Task[]>>(url);
    set({ tasks: data.data });
  },
  createTask: async (payload) => {
    await api.post('/tasks', payload);
    await get().fetchTasks(payload.project);
  },
  updateTaskStatus: async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    await get().fetchTasks(get().activeProject?._id);
  },
}));
