import { PrismaClient, Roles } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
const prisma = new PrismaClient();

type Data = {
  global: boolean;
};

export async function POST(request: Request, response: Response) {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data: Data = await request.json();

  const role = user.role;

  if (data.global && role === Roles.ADMIN) {
    await prisma.notes.deleteMany();
  } else if (!data.global) {
    await prisma.notes.deleteMany({
      where: {
        creatorId: session?.user.id,
      },
    });
  }


  console.log("All notes have been deleted");

  return new Response("Ok", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    statusText: "Ok",
  });
}
