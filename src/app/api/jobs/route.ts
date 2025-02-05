// src/app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET all job postings
export async function GET() {
  try {
    // Fetch all jobs from the "jobs" table
    const { data, error } = await supabase.from('jobs').select('*');

    // Handle errors
    if (error) {
      throw error;
    }

    // Return the job postings as JSON
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}