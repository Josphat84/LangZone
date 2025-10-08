// scripts/createSearchLogsCollection.mjs
import dotenv from 'dotenv';
import Typesense from 'typesense';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve('./.env.local') });

console.log('TYPESENSE_ADMIN_API_KEY:', process.env.TYPESENSE_ADMIN_API_KEY); // ✅ should print your key

const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || process.env.TYPESENSE_HOST,
      port: Number(process.env.TYPESENSE_PORT) || 443,
      protocol: process.env.TYPESENSE_PROTOCOL || 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
  connectionTimeoutSeconds: 5,
});

async function createSearchLogsCollection() {
  try {
    const schema = {
      name: 'search_logs',
      fields: [
        { name: 'id', type: 'string' },
        { name: 'query', type: 'string' },
        { name: 'timestamp', type: 'int64' },
      ],
      default_sorting_field: 'timestamp',
    };

    // Delete if exists
    try {
      await typesense.collections('search_logs').delete();
      console.log('Deleted existing search_logs collection.');
    } catch {}

    const collection = await typesense.collections().create(schema);
    console.log('Created collection:', collection.name);
  } catch (err) {
    console.error('Error creating collection:', err);
  }
}

createSearchLogsCollection();
