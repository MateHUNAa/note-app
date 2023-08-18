import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAdminAsync } from "@/lib/utils/accessControl";
import { Roles } from "@prisma/client";
import { AxiosError } from "axios";

type Data = {
  userId: string;
  role: Roles;
};

export async function POST(request: Request, response: Response) {
  const data: Data = await request.json();

  if(!data || !data.userId || !data.role) { 
    return new Response("Bad Request", { status: 400 });
  }

  const session = await getAuthSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if(!await isAdminAsync(session.user)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const updatedUser = await db.user.update({
      where: {
        id: data.userId,
      },
      data: {
        role: data.role,
      },
    });

    console.log(`${updatedUser.name}'s has been updated. Now ${data.role.toUpperCase()} !`, updatedUser);

    return new Response(JSON.stringify(updatedUser), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
    
  } catch (error) {
    if (error instanceof AxiosError) {
      return new Response(error.response?.data, {
        status: error.response?.status || 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
  }
}
