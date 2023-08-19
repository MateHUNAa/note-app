import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";
import type { User } from "@prisma/client";

async function canChangeName(userId: string) {
  const recentAttempts = await db.usernameChangeAttempts.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
    },
  });

  return recentAttempts.length < 3;
}

export async function PATCH(req: Request, res: Response) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { username } = UsernameValidator.parse(body);

    const allowedToChange = await canChangeName(session.user.id);

    if (!allowedToChange) {
      return new Response(
        "You can only change your username 3 times every 5 minutes",
        { status: 429, statusText: "Too Many Requests" }
      );
    } else {
      await db.usernameChangeAttempts.deleteMany({
        where: {
          userId: session.user.id,
        },
      });
    }

    const isExist = await db.user.findFirst({ where: { username: username } });
    if (isExist) {
      console.log(
        `Failed to updated ${session.user.name},  Username already exists`
      );
      return new Response("Username already exists", { status: 409 });
    }

    // update Username

    await db.user.update({
      where: { id: session.user.id },
      data: { username: username },
    });

    await db.usernameChangeAttempts.create({
      data: {
        userId: session.user.id,
        name: username as string,
      },
    });

    return new Response("Username updated", { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response("Invalid PATCH Request data passed", { status: 422 });
    }

    return new Response("Could not update username, please try again later.", {
      status: 500,
    });
  }
}
