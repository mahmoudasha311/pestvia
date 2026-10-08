/** Reserved contract for future admin uploads. No storage service is connected. */
export interface StoredImage {
  id: string;
  url: string;
  width: number;
  height: number;
  contentType: string;
}

export interface ImageStorageProvider {
  upload(input: { data: Uint8Array; filename: string; contentType: string }): Promise<StoredImage>;
  remove(id: string): Promise<void>;
}
