import Link from "next/dist/client/link";

type Project = {
  id: string;
  name: string;
  createdAt: string;
};

async function getProjects(): Promise<Project[]> {
  const res = await fetch("http://localhost:3000/api/projects", {cache: "no-store"});
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}
export default async function HomePage() {
  const projects = await getProjects();

  return(
      <main className="p-6 space-y-6">
          <header className="space-y-1">
              <h1 className="text-2xl font-semibold">Projects</h1>
              <p className="text-sm text-gray-600">
                  Select a project to view and manage its tasks
              </p>
          </header>
          <section className="border p-4">
              {projects.length === 0 ? (
                  <p className="text-sm text-gray-600">No projects</p>
              ) : (
                  <ul className="space-y-3">
                      {projects.map((p)=>(
                          <li key={p.id} className="flex items-center justify-between gap-4 border rounded p-3">
                              <div className="min-w-0">
                                  <div className="font-medium truncate">
                                      {p.name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                      Created: {new Date(p.createdAt).toLocaleString()}
                                  </div>
                              </div>
                              <Link
                                  className="border rounded px-3 py-2 text-sm "
                                  href={`/projects/${p.id}`}>
                                  View tasks
                              </Link>
                          </li>
                      ))}
                  </ul>
              )}
          </section>
      </main>
  );
}
