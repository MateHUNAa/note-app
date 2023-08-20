import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request, response: Response) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await db.notes.deleteMany({
      where: {
        creatorId: session?.user.id,
      },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response("Ok", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    statusText: "Ok",
  });
}
