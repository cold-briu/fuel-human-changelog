import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

export async function GET(request: Request) {
    try {
        const response = await notion.databases.retrieve({ database_id: databaseId ?? "NO_DB_ID" });
        return new Response(JSON.stringify(response))
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}
