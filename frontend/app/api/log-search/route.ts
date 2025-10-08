// API route to log search queries
//frontend/app/api/log-search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Typesense from 'typesense';

// Server-side Typesense client with admin key
const typesenseAdmin = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: Number(process.env.TYPESENSE_PORT || 443),
      protocol: process.env.TYPESENSE_PROTOCOL || 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY!,
  connectionTimeoutSeconds: 5,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const searchLog = {
      query: body.query,
      result_count: body.result_count,
      filter_type: body.filter_type,
      clicked_result: body.clicked_result || '',
      timestamp: body.timestamp,
      user_agent: body.user_agent,
      session_id: body.session_id,
    };

    // Ensure collection exists
    try {
      await typesenseAdmin.collections('search_logs').retrieve();
    } catch (error) {
      // Create collection if it doesn't exist
      await typesenseAdmin.collections().create({
        name: 'search_logs',
        fields: [
          { name: 'query', type: 'string' },
          { name: 'result_count', type: 'int32' },
          { name: 'filter_type', type: 'string' },
          { name: 'clicked_result', type: 'string', optional: true },
          { name: 'timestamp', type: 'int64' },
          { name: 'user_agent', type: 'string' },
          { name: 'session_id', type: 'string' },
        ],
      });
    }

    // Create document
    await typesenseAdmin
      .collections('search_logs')
      .documents()
      .create(searchLog);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging search:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log search' },
      { status: 500 }
    );
  }
}