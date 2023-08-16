import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from '@/lib/auth'
const prisma = new PrismaClient();

type Data = {
    content: string;
}

export async function POST(request: Request, response: Response) {
   
     const session = await getAuthSession()
   

     await prisma.notes.deleteMany({
          where: { 
               creatorId: session?.user.id
          }
     });
    console.log("All notes have been deleted");

    return new Response("Ok", {
     status: 200,
     headers: {
          "Content-Type": "application/json"
     },
     statusText: "Ok"
     })
}