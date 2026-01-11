import {NextResponse} from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/db/prisma";

export async function GET() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc"}
    });
    return NextResponse.json(projects);
}

export async function POST(req: Request) {
    const body = await req.json();
    const project = await prisma.project.create({
        data: {
            name: body.name.trim(),
        },
    });
    return NextResponse.json(project, { status:201 });
}