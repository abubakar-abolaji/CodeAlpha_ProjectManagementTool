import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, LogOut, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { projects, fetchProjects, createProject } = useProjectStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()),
  );

  const onCreateProject = async () => {
    if (!name.trim()) return;
    const project = await createProject({
      name: name.trim(),
      description: description.trim() || undefined,
      priority: 'medium',
      color: '#38bdf8',
    });
    if (project) {
      navigate(`/projects/${project._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-400">Workspace</p>
              <h1 className="text-lg font-semibold">TaskFlow</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">{user?.name}</span>
            <button
              onClick={() => void logout().then(() => navigate('/login'))}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30 lg:grid-cols-[1.5fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Overview</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Keep your team moving forward</h2>
            <p className="mt-3 max-w-xl text-slate-300">
              Organize tasks, track project progress, and align teams with a focused delivery workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium text-white">Create project</p>
              <Plus className="h-4 w-4 text-sky-400" />
            </div>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Project name"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-sky-400"
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short description"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-sky-400"
              />
              <button
                onClick={() => void onCreateProject()}
                className="w-full rounded-xl bg-sky-500 px-4 py-2.5 font-semibold text-white hover:bg-sky-400"
              >
                Create workspace
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Projects</p>
              <h3 className="mt-1 text-2xl font-bold text-white">My workspaces</h3>
            </div>
            <label className="relative block w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-white outline-none focus:border-sky-400"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-sky-500/60"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white"
                    style={{ background: project.color || '#38bdf8' }}
                  >
                    {project.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">
                    {project.status}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-white">{project.name}</h4>
                <p className="mt-2 line-clamp-3 min-h-[48px] text-sm text-slate-300">
                  {project.description || 'No description yet.'}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                  <span>{project.members.length} members</span>
                  <span>{project.priority}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
