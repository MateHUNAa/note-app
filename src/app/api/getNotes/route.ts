import { db } from "@/lib/db";

export async function GET(request: Request, response: Response) {

     const notes = await db.notes.findMany();
     const creators = await db.user.findMany();

     console.log("Notes have been fetched: ", notes);
     
     return new Response(JSON.stringify({ notes, creators }), {
          status: 200,
          headers: {
               "Content-Type": "application/json"
          },
          statusText: "Ok"
     })

}