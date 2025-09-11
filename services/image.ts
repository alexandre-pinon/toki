import { getStorageResponseDataOrThrow, supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { useCallback, useMemo } from "react";

export function useImageService() {
  const BUCKET_NAME = "toki-images";

  const uploadImage = useCallback(async (uri: string, path: string, mimeType: string): Promise<string> => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

    getStorageResponseDataOrThrow(
      await supabase.storage.from(BUCKET_NAME).upload(path, decode(base64), {
        upsert: true,
        contentType: mimeType,
      }),
    );

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const removeImage = useCallback(async (path: string): Promise<void> => {
    getStorageResponseDataOrThrow(await supabase.storage.from(BUCKET_NAME).remove([path]));
  }, []);

  return useMemo(() => ({ uploadImage, removeImage }), [uploadImage, removeImage]);
}
