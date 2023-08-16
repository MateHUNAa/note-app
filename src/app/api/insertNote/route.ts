import { getAuthSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type Data = {
    content: string;
}

export async function POST(request: Request, response: Response) {
    const data: Data = await request.json();


    const session = await getAuthSession()

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    const note = await prisma.notes.create({
        data: {
            content: data.content,
            creatorId: session.user.id,
        }
    });

    console.log("Note has been created: ", note);

    return new Response("Ok", {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        },
        statusText: "Ok"
    })
}