import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configure Supabase storage
const AVATAR_BUCKET = "avatars";

export const uploadAvatar = async (file, path) => {
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file);

  if (error) throw error;

  return data;
};

export const getAvatarUrl = (path) => {
  const {
    data: { publicUrl },
    error,
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  if (error) throw error;

  return publicUrl;
};
