import { getStorageResponseDataOrThrow, supabase } from "@/lib/supabase";
import { File } from "expo-file-system";

const BUCKET_NAME = "toki-images";

export const uploadImage = async (uri: string, path: string, mimeType: string): Promise<string> => {
  const fileBody = await new File(uri).arrayBuffer();

  getStorageResponseDataOrThrow(
    await supabase.storage.from(BUCKET_NAME).upload(path, fileBody, {
      upsert: true,
      contentType: mimeType,
    }),
  );

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
};

export const removeImage = async (path: string): Promise<void> => {
  getStorageResponseDataOrThrow(await supabase.storage.from(BUCKET_NAME).remove([path]));
};
