import { getStorageResponseDataOrThrow, supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

const BUCKET_NAME = "toki-images";

export const uploadImage = async (uri: string, path: string, mimeType: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

  getStorageResponseDataOrThrow(
    await supabase.storage.from(BUCKET_NAME).upload(path, decode(base64), {
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
