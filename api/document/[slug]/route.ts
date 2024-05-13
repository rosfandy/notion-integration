import {
  fetchPageBlocks,
  getDocumentBySlug,
  getNotionMD,
  renderNotionHTML,
} from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const { slug } = params;

  try {
    const post = await getDocumentBySlug(slug);
    if (post === undefined)   
      return new Response(JSON.stringify({ message: "Not Found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });

    const blocks = await fetchPageBlocks(post.id);
    const notionHTML = await renderNotionHTML(post, blocks, slug);
  
    return NextResponse.json({
      notionHTML,
    })

  } catch (error) {
    // Proper error handling: returning a custom error message
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
