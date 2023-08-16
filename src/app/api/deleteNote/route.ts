import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type Data = {
    id: number;
}

export async function POST(request: Request, response: Response) {
     const data: Data = await request.json();
   await prisma.notes.delete({where: {id: data.id}});
    console.log("All notes have been deleted");

    return new Response("Ok", {
     status: 200,
     headers: {
          "Content-Type": "application/json"
     },
     statusText: "Ok"
     })
}