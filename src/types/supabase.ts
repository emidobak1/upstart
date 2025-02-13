// types/supabase.ts
export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          school: string;
          graduation_year: string;
          location: string;
          created_at: string;
          updated_at: string;
        }
      },
      startups: {
        Row: {
          id: string;
          email: string;
          company_name: string;
          company_size: string;
          location: string;
          created_at: string;
          updated_at: string;
        }
      }
    }
  }
}

// Keep your existing interfaces
export interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  school: string;
  graduation_year: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Startup {
  id: string;
  email: string;
  company_name: string;
  company_size: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export type UserProfile = (Student | Startup) & {
  role: 'student' | 'startup';
};