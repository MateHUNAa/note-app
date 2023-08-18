import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRoleAsync } from "@/lib/utils/accessControl";

export async function GET(request: Request, response: Response) {
  const session = await getAuthSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const role = user.role;
  return new Response(JSON.stringify({ role }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    statusText: "Ok",
  });
}
