import { getAllDocument, getDocumentByTags } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const { tag } = params; 

  try {
    if (tag === 'all') {
      // If no slug, assume fetching all documents
      const post = await getAllDocument();
      if (post === undefined)
        return new Response(JSON.stringify({ message: "No documents found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });

      return NextResponse.json({post});  // Return all posts directly
    }
    const post = await getDocumentByTags(tag);
    if (post === undefined)
      return new Response(JSON.stringify({ message: "Not Found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });

    return NextResponse.json({ post });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
