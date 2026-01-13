import {NextResponse} from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/db/prisma";

// export async function GET() {
//     const tasks = await prisma.task.findMany({
//         orderBy: { createdAt: "desc"}
//     });
//     return NextResponse.json(tasks);
// }

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const projectId = searchParams.get("projectId") ?? undefined;
    const status = searchParams.get("status") ?? undefined;

    const tasks = await prisma.task.findMany({
        where: {
            ...(projectId ? {projectId} : {}),
            ...(status ? {status}: {}),
        },
        orderBy: { createdAt: "desc"}
    });
    return NextResponse.json(tasks);
}

export async function POST(req: Request) {
    const body = await req.json();
    const tasks = await prisma.task.create({
        data: {
            title: body.title,
            projectId: body.projectId,
            assignee: body.assignee,
            status: body.status ?? "TODO",
        },
    });
    return NextResponse.json(tasks, { status:201 });
}


