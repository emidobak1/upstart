// File: src/utils/supabaseStorage.ts

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define the bucket name
const BUCKET_NAME = 'blog_picture';

/**
 * Uploads an image to Supabase Storage
 * @param file - The file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadBlogImage(file: File): Promise<string> {
  try {
    // Initialize Supabase client
    const supabase = createClientComponentClient();
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `featured/${fileName}`;
    
    // Upload file to the blog_picture bucket
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL for the file
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw new Error('Failed to upload image');
  }
}