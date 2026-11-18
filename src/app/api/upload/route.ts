import { NextResponse } from "next/server";
import { IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/validation";

// Uploads an image to ImgBB. The API key stays on the server.
export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "Image uploads are not configured" },
      { status: 500 }
    );
  }

  let file: FormDataEntryValue | null = null;
  try {
    const form = await request.formData();
    file = form.get("image");
  } catch {
    return NextResponse.json({ message: "Invalid upload request" }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No image was provided" }, { status: 400 });
  }
  if (!IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Use a JPG, PNG, WebP or GIF image" },
      { status: 400 }
    );
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { message: "Image must be 5 MB or smaller" },
      { status: 400 }
    );
  }

  const upstream = new FormData();
  upstream.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: upstream }
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success || !result?.data?.url) {
      return NextResponse.json(
        { message: "Image upload failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: result.data.url as string });
  } catch {
    return NextResponse.json(
      { message: "Image service is unreachable. Please try again." },
      { status: 502 }
    );
  }
}
