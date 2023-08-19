import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { AxiosError } from "axios";

type Data = {
  id: string;
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

    return new Response(JSON.stringify(user as User), {
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
