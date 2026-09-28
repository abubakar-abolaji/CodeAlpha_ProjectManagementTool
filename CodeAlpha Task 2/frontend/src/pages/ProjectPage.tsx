import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, CircleDashed, Plus, Sparkles } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import type { Task } from '../types';

const columns = [
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
] as const;

export function ProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { activeProject, boards, tasks, fetchProject, createTask, createBoard, updateTaskStatus } = useProjectStore();
  const [boardName, setBoardName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskColumn, setTaskColumn] = useState<Task['status']>('todo');

  useEffect(() => {
    if (projectId) {
      void fetchProject(projectId);
    }
  }, [fetchProject, projectId]);

  const groupedTasks = useMemo(
    () =>
      columns.reduce(
        (acc, column) => {
          acc[column.id] = tasks.filter((task) => task.column === column.id || task.status === column.id);
          return acc;
        },
        {} as Record<string, Task[]>,
      ),
    [tasks],
  );

  const onCreateBoard = async () => {
    if (!projectId || !boardName.trim()) return;
    await createBoard(projectId, {
      name: boardName.trim(),
      description: 'Team board',
      columns: [
        { id: 'todo', name: 'Todo', position: 0 },
        { id: 'in_progress', name: 'In Progress', position: 1 },
        { id: 'review', name: 'Review', position: 2 },
        { id: 'completed', name: 'Completed', position: 3 },
      ],
    });
    setBoardName('');
  };

  const onCreateTask = async () => {
    if (!projectId || !taskTitle.trim()) return;
    await createTask({
      project: projectId,
      title: taskTitle.trim(),
      column: taskColumn,
      status: taskColumn,
      priority: 'medium',
      labels: [],
      attachments: [],
      position: tasks.length,
    });
    setTaskTitle('');
  };

  if (!activeProject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-lg font-medium">Loading project…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-400">Project</p>
              <h1 className="text-xl font-semibold text-white">{activeProject.name}</h1>
            </div>
          </div>
          <Link to="/dashboard" className="text-sm text-sky-400 hover:text-sky-300">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-400">Overview</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{activeProject.name}</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              {activeProject.description || 'This project is ready for planning and delivery.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-slate-700 px-3 py-1">{activeProject.status}</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">{activeProject.priority}</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">{activeProject.members.length} members</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sky-400">Create task</p>
            <div className="space-y-3">
              <input
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Task title"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
              />
              <select
                value={taskColumn}
                onChange={(event) => setTaskColumn(event.target.value as Task['status'])}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => void onCreateTask()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 font-semibold text-white hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />
                Add task
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Boards</p>
            <div className="flex items-center gap-3">
              <input
                value={boardName}
                onChange={(event) => setBoardName(event.target.value)}
                placeholder="New board name"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-400"
              />
              <button
                onClick={() => void onCreateBoard()}
                className="rounded-xl bg-violet-500 px-3 py-2 font-medium text-white hover:bg-violet-400"
              >
                Create board
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {boards.map((board) => (
              <div key={board._id} className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-white">{board.name}</p>
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-sm text-slate-300">{board.columns.length} columns</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          {columns.map((column) => (
            <div key={column.id} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-white">{column.title}</p>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                  {groupedTasks[column.id]?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {groupedTasks[column.id]?.length ? (
                  groupedTasks[column.id].map((task) => (
                    <div key={task._id} className="rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="font-medium text-white">{task.title}</p>
                        {task.status === 'completed' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <CircleDashed className="h-4 w-4 text-slate-400" />}
                      </div>
                      <p className="mb-3 text-xs text-slate-400">{task.priority}</p>
                      <button
                        onClick={() => void updateTaskStatus(task._id, column.id === 'completed' ? 'completed' : column.id === 'review' ? 'review' : column.id === 'in_progress' ? 'in_progress' : 'todo')}
                        className="w-full rounded-lg border border-slate-700 px-2 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-500"
                      >
                        Move to {column.title}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                    No tasks in this stage.
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
