import TaskTable from "./task-table";

export default async function ProjectPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return (
        <main className="p-6">
            <TaskTable projectId={id} />
        </main>
    );
}