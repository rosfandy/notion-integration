import { NotionRenderer } from "@notion-render/client";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

interface Renderer {
  render(el: any): Promise<string>;
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async () => {
  try {
    const post = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Status",
        status: {
          equals: "Published",
        },
      },
    });
    const jsonContent = {
      data: post.results,
    };
    return jsonContent;
  } catch (error) {
    throw error;
  }
};

export const getDocumentBySlug = async (slug: string) => {
  try {
    const post = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
      })
      .then((res) => res.results[0] as PageObjectResponse | undefined);
    return post;
  } catch (error) {
    throw error;
  }
};

export const getDocumentByTags = async (tags: string) => {
  try {
    const post = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: "Tags",
            multi_select: {
              contains: tags,
            },
          },
          {
            property: "Status",
            status: {
              equals: "Published",
            },
          },
        ],
      },
    });
    return post;
  } catch (error) {
    throw error;
  }
};

export const getAllDocument = async () => {
  try {
    const post = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Status",
        status: {
          equals: "Published",
        },
      },
    });
    return post;
  } catch (error) {
    throw error;
  }
};

export const renderNotionHTML = async (post: any, blocks: any, path: any) => {
  const renderer = new NotionRenderer({
    client: notion,
  });

  let combinedHTML = await getNotionHTML(blocks, renderer);
  const jsonContent = [
    {
      content: combinedHTML,
      properties: post.properties,
    },
  ];
  return jsonContent;
};

const getNotionHTML = async (
  blocks: any[],
  renderer: Renderer
): Promise<string> => {
  let combinedHTML = "";
  let listArray = [];
  for (let index = 0; index < blocks.length; index++) {
    const el = blocks[index];
    const html = await renderer.render(el);
    if (el.type === "numbered_list_item") {
      console.log(el.type)
      const listItem = extractListItems(html);
      listArray.push(listItem);
    } else {
      console.log(el.type)
      if (listArray.length != 0) {
        let listContainer = "";
        listArray.map((list) => {
          listContainer += list;
        });
        combinedHTML += `<ol class="notion-ordered-list">${listContainer}</ol>`;
        listArray = [];
      }
      combinedHTML += html;
    }
  }
  return combinedHTML;
};

export const fetchPageBlocks = async (pageId: string) => {
  return notion.blocks.children
    .list({ block_id: pageId })
    .then((res) => res.results as BlockObjectResponse[]);
};

export const getNotionMD = new NotionToMarkdown({ notionClient: notion });

const extractListItems = (html: string) => {
  const listItemRegex = /<ol[^>]*>((?:.|\s)*?)<\/ol>/g;
  let match;
  let listItems = [];

  while ((match = listItemRegex.exec(html)) !== null) {
    listItems.push(match[1].trim());
  }

  return listItems;
};
