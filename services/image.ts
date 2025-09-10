import { getStorageResponseDataOrThrow, supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

export function useImageService() {
  const BUCKET_NAME = "toki-images";

  const uploadImage = async (uri: string, path: string, mimeType: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

    getStorageResponseDataOrThrow(
      await supabase.storage.from(BUCKET_NAME).upload(path, decode(base64), {
        upsert: true,
        contentType: mimeType,
      }),
    );
  };

  return { uploadImage };
}
