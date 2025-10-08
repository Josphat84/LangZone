//frontend/lib/typesense/client.ts

import Typesense from "typesense"

let typesenseClient: Typesense.Client | null = null

export function getTypesenseClient() {
  if (!typesenseClient) {
    typesenseClient = new Typesense.Client({
      nodes: [
        {
          host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
          port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT || 443),
          protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "https",
        },
      ],
      apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY!,
      connectionTimeoutSeconds: 5,
    })
  }
  return typesenseClient
}
