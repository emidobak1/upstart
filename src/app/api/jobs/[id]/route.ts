// src/app/api/jobs/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET a single job by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Fetch the job with the specified ID
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .single();

    // Handle errors
    if (error) {
      throw error;
    }

    // Return the job details as JSON
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}