import { db } from "@/lib/db";
import type { Roles } from "@prisma/client";
type Data = {
  id: string;
};

type User = {
  id: string;
  role: Roles;
  name: string | null;
  email: string;
  image: string;
  username: string;
};

export async function PATCH(request: Request, response: Response) {
  const data: Data = await request.json();

  if (!data.id) {
    return new Response("No id provided.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const user = await db.user.findFirst({
      where: {
        id: data.id,
      },
    });

    console.log("User found: ", user);

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      statusText: "Ok",
    });
  } catch (error) {
    return new Response("An error occurred while trying to get the user.", {
      status: 500,
    });
  }
}
