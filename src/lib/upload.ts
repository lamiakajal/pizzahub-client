// Sends an image to our upload route and returns the hosted image URL.
export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);

  const response = await fetch("/api/upload", { method: "POST", body });
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.url) {
    throw new Error(result?.message ?? "Image upload failed");
  }

  return result.url as string;
}
