import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/db/prisma";

const VALID_STATUS = new Set(["TODO","IN_PROGRESS","DONE"])

export async function PATCH (
    req: Request,
    context : {params: Promise<{ id: string }> }
){
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));

    const status = typeof body?.status == "string" ? body.status : "";

    if (!VALID_STATUS.has(status)) {
        return NextResponse.json(
            { error: "VALIDATION_ERROR", message: "status must be TODO, IN_PROGRESS or DONE"},
            { status: 400 }
        );
    }

    const updated = await prisma.task.update({
        where: {id},
        data: { status: status as any },
    }).catch(()=>null);

    if(!updated){
        return NextResponse.json({ error: "TASK_NOT_FOUND"}, {status: 404});
    }
    return NextResponse.json(updated);
}

export async function DELETE (
    req: Request,
    context : {params: Promise<{ id: string }> }
){
    const { id } = await context.params;

    const deleted = await prisma.task.delete({
        where: {id},
    }).catch(()=>null);

    if(!deleted){
        return NextResponse.json({ error: "TASK_NOT_FOUND"}, {status: 404});
    }
    return NextResponse.json(deleted);
}

