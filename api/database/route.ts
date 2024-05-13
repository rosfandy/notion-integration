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