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
                version: properties.version.rich_text[0].text.content,
                changelog: properties.changelog.rich_text[0].text.content,
                date: properties.date.rich_text[0].text.content,
                url: properties.releaseUrl.rich_text[0].text.content,
            }
        })

        return new Response(JSON.stringify(data))
    } catch (error) {
        console.error(error);
    }
}



export async function POST(request: Request) {
    const payload = await request.json();
    const { name, origin, version, changelog, date, url } = payload

    console.log("req payload", JSON.stringify(payload));

    if (
        name === undefined ||
        origin === undefined ||
        version === undefined ||
        changelog === undefined
    ) {

        return new Response(JSON.stringify({
            message: "Invalid request payload",
            payload
        }), { status: 400 })
    }
    try {
        const response = await notion.pages.create({
            "parent": {
                "type": "database_id",
                "database_id": databaseId ?? "NO_DATABASE_ID"
            },
            properties: {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": name,
                            },
                        },
                    ],
                },
                "origin": parseRichText(origin),
                "version": parseRichText(version),
                "changelog": parseRichText(changelog),
                "date": parseRichText(date),
                "releaseUrl": parseRichText(url),
                "Status": {
                    "select": {
                        "name": "new"
                    }
                }
            } as any
        })
        return new Response(JSON.stringify(response))
    } catch (error) {
        return new Response(JSON.stringify({ error, payload }), { status: 500 })
    }
}

function parseRichText(input: string) {
    return {
        "rich_text": [
            {
                "text": {
                    "content": input,
                },
            },
        ],
    }
}