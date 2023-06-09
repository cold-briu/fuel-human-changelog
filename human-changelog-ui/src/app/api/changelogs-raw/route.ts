import { Client } from "@notionhq/client"
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

export async function GET(request: Request) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId ?? "NO_DATABASE_ID",
            filter: {
                "property": "Status",
                "select": {
                    "equals": "live"
                }
            }
        } as QueryDatabaseParameters);
        const data = response.results.map(({ properties, url }: any) => {
            return {
                name: properties.Name.title[0].plain_text,
                origin: properties.origin.rich_text[0].text.content,
                version: properties.version.number,
                changelog: properties.Changelog.rich_text[0].text.content,
                url
            }
        })

        return new Response(JSON.stringify(response))
    } catch (error) {
        console.error(error);

    }
}
