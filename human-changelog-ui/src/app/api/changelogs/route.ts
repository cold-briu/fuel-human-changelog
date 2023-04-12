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
                changelog: properties.Changelog.rich_text[0].text.content,
                url
            }
        })

        return new Response(JSON.stringify(data))
    } catch (error) {
        console.error(error);
    }
}

export async function POST(request: Request) {
    const { name, origin, version, changelog } = await request.json();
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
                "origin": {
                    "rich_text": [
                        {
                            "text": {
                                "content": origin,
                            },
                        },
                    ],
                },
                "version": {
                    "number": 1,
                },
                "Changelog": {
                    "rich_text": [
                        {
                            "text": {
                                "content": changelog,
                            },
                        },
                    ],
                },
                "Status": {
                    "select": {
                        "name": "new"
                    }
                }
            } as any
        })
        return new Response(JSON.stringify(response))
    } catch (error) {
        console.error(error);
    }
}