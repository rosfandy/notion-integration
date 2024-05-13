## API Integration

Sebelum memulai diperlukan library untuk koneksi pada [notion](https://www.notion.so/). Module library untuk API dapat dilihat [disini](https://github.com/rosfandy/notion-integration).

```jsx
npm install @notionhq/client @/lib/notion
```

```jsx
yarn add @notionhq/client @/lib/notion
```

### Konfigurasi

Ini adalah file konfigurasi untuk kredensial koneksi notion. 

```tsx
import { Client } from "@notionhq/client";
import { getDatabase } from "@/lib/notion";
import { NextResponse } from "next/server";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export async function GET() {
    try {
        const database = await getDatabase()
        return NextResponse.json({
            database: database
        })
    
    } catch (error) {
        
    }
}
```

### Database API

Ini adalah kode untuk API `GET` database notion.

```tsx
import { Client } from "@notionhq/client";
import { getDatabase } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const database = await getDatabase()
        return NextResponse.json({
            database: database
        })
    
    } catch (error) {
        return error
    }
}
```

### Document API

Ini adalah kode untuk `GET` document by `slug` . Response dari `API` berupa **konten** dari document.

```tsx
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

    // convert to HTML
    const blocks = await fetchPageBlocks(post.id);
    const notionHTML = await renderNotionHTML(post, blocks, slug);

    // convert to MarkDown
    const mdblocks = await getNotionMD.pageToMarkdown(post.id);
    const notionMD = getNotionMD.toMarkdownString(mdblocks);
  
    return NextResponse.json({
      notionHTML,
      notionMD
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

```

### Tags API

Ini adalah kode untuk `GET` document by `tag`. Response dari `API` berupa data terkait document terkait.

```tsx
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

```
