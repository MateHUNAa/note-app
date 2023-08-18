import { db } from "@/lib/db";

export async function GET(request: Request, response: Response) {

     const creators = await db.user.findMany();

     console.log("Creators have been fetched: ", creators);
     
     return new Response(JSON.stringify(creators), {
          status: 200,
          headers: {
               "Content-Type": "application/json"
          },
          statusText: "Ok"
     })

}