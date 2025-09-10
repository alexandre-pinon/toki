import { getDataOrThrow, supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export function useImageService() {
  const BUCKET_NAME = "toki-images";

  const uploadImage = async (uri: string, path: string, mimeType: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

    getDataOrThrow(
      await supabase.storage.from(BUCKET_NAME).upload(path, decode(base64), {
        upsert: true,
        contentType: mimeType,
      }),
    );
  };

  return { uploadImage };
}
