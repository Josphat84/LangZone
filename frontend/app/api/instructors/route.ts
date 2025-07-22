//frontend/app/api/instructors/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    const { 
      name,
      email,
      language,
      expertise,
      price,
      description,
      country,
      is_native,
      image_url
    } = formData;

    // Validate required fields
    if (!name || !email || !language || !price || !description || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email exists
    const emailCheck = await pool.query(
      'SELECT id FROM instructors WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Insert new instructor
    const result = await pool.query(
      `INSERT INTO instructors (
        name, email, language, expertise, price, 
        description, country, is_native, image_url,
        created_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), 'pending')
      RETURNING id`,
      [
        name,
        email,
        language,
        expertise,
        parseFloat(price),
        description,
        country,
        is_native === 'true',
        image_url || null
      ]
    );

    return NextResponse.json(
      { id: result.rows[0].id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}