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
        <h1>Projects</h1>
        <div>
          {projects.length === 0 ? (
              <p>No projects</p>
          ) : (
              <ul>
                {projects.map((p)=> (
                    <li key={p.id}>
                      <div>
                        <div>{p.name}</div>
                      </div>

                      <Link
                      href={`/projects/${p.id}`}>
                        View tasks -
                      </Link>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </main>
  );
}
