"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

type Task = {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    projectId: string;
    assignee: string;
    createdAt: string;
    updatedAt: string;
};

const STATUS_OPTIONS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function TaskTable({ projectId }: { projectId: string }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignee, setAssignee] = useState("");

    const filteredTasks = useMemo(() => {
        if (statusFilter === "ALL") return tasks;
        return tasks.filter((t) => t.status === statusFilter);
    }, [tasks, statusFilter]);

    async function loadTasks() {
        setLoading(true);
        try {
            const qs =
                statusFilter === "ALL"
                    ? `projectId=${encodeURIComponent(projectId)}`
                    : `projectId=${encodeURIComponent(projectId)}&status=${encodeURIComponent(
                        statusFilter
                    )}`;

            const res = await fetch(`/api/tasks?${qs}`, { cache: "no-store" });
            const data = await res.json();
            setTasks(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks();
    }, [projectId, statusFilter]);

    async function createTask(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            title,
            description: description || undefined,
            projectId,
            assignee,
            status: "TODO",
        };

        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err?.message ?? "Failed to create task");
            return;
        }

        setTitle("");
        setDescription("");
        setAssignee("");
        await loadTasks();
    }

    async function updateStatus(taskId: string, status: TaskStatus) {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err?.message ?? "Failed to update status");
            return;
        }

        await loadTasks();
    }

    async function deleteTask(taskId: string) {
        const ok = confirm("Delete this task?");
        if (!ok) return;

        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err?.message ?? "Failed to delete task");
            return;
        }

        await loadTasks();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Project tasks</h1>
                    <div className="text-sm text-gray-600 break-all">Project ID: {projectId}</div>
                </div>

                <Link className="text-sm underline" href="/">
                    Back
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Filter:</label>
                <select
                    className="border rounded px-2 py-1"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                    <option value="ALL">ALL</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {loading ? <span className="text-sm text-gray-600">Loading...</span> : null}
            </div>

            <form onSubmit={createTask} className="border p-4 space-y-3">
                <div className="font-medium">Create new task</div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-sm">Title</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Assignee</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-sm">Description (optional)</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <button className="border rounded px-3 py-2 text-sm" type="submit">
                    Create
                </button>
            </form>

            <div className="border">
                <div className="p-3 border-b font-medium">
                    {statusFilter === "ALL" ? "All tasks" : `Tasks: ${statusFilter}`}
                </div>

                {filteredTasks.length === 0 ? (
                    <div className="p-3 text-sm text-gray-600">No tasks found.</div>
                ) : (
                    <ul className="divide-y">
                        {filteredTasks.map((t) => (
                            <li key={t.id} className="p-3 flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="font-medium break-words">{t.title}</div>
                                    {t.description ? (
                                        <div className="text-sm text-gray-600 break-words">{t.description}</div>
                                    ) : null}
                                    <div className="text-xs text-gray-600 mt-1">
                                        Assignee: {t.assignee} • Updated:{" "}
                                        {new Date(t.updatedAt).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        className="border rounded px-2 py-1 text-sm"
                                        value={t.status}
                                        onChange={(e) => updateStatus(t.id, e.target.value as TaskStatus)}
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="border rounded px-2 py-1 text-sm"
                                        onClick={() => deleteTask(t.id)}
                                        type="button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}