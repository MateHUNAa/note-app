import { db } from "@/lib/db";

export async function GET(request: Request, response: Response) {

     const notes = await db.notes.findMany();

     return new Response(JSON.stringify(notes), {
          headers: {
               "content-type": "application/json; charset=UTF-8",
          },
     });
     

}