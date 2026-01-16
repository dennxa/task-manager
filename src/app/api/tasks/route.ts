import {NextResponse} from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/db/prisma";

const VALID_STATUS = new Set(["TODO","IN_PROGRESS","DONE"])

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
    const status = typeof body?.status == "string" ? body.status : "";

    if (!VALID_STATUS.has(status)) {
        return NextResponse.json(
            { error: "VALIDATION_ERROR", message: "status must be TODO, IN_PROGRESS or DONE"},
            { status: 400 }
        );
    }

    const tasks = await prisma.task.create({
        data: {
            title: body.title,
            projectId: body.projectId,
            assignee: body.assignee,
            status: status as any ?? "TODO",
        },
    });
    return NextResponse.json(tasks, { status:201 });
}


