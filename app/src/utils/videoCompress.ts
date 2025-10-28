import { Video } from "react-native-compressor";

export async function videoCompress(uri: string) {
  return await Video.compress(
    uri,
    {
      compressionMethod: "auto",
      minimumFileSizeForCompress: 5,
      maxSize: 5
    },
  );
}