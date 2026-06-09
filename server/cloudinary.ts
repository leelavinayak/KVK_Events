import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

// Ensure upload folder exists locally
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_URL || 
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  );
};

if (isCloudinaryConfigured()) {
  console.log("Cloudinary is configured and ready!");
} else {
  console.log("Cloudinary not configured. Uploaded images will be saved inside Local Scratch Storage.");
}

export const ImageUploadService = {
  /**
   * Uploads an image (either base64 data URL or external URL)
   * Returns the final available URL of the uploaded active image.
   */
  async uploadImage(base64OrUrl: string): Promise<string> {
    if (!base64OrUrl) {
      throw new Error("No image data provided");
    }

    // 1. If Cloudinary is configured, send the data there
    if (isCloudinaryConfigured()) {
      try {
        const uploadResult = await cloudinary.uploader.upload(base64OrUrl, {
          folder: "kvkevents",
        });
        return uploadResult.secure_url;
      } catch (err: any) {
        console.error("Cloudinary upload failed, falling back to local file creation.", err.message);
      }
    }

    // 2. Fallback to Local Storage inside /data/uploads/
    if (base64OrUrl.startsWith("data:image")) {
      try {
        const matches = base64OrUrl.match(/^data:image\/([A-Za-z0-9-+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new Error("Invalid base64 image data format");
        }

        const fileExtension = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const filePath = path.join(UPLOADS_DIR, fileName);

        fs.writeFileSync(filePath, buffer);
        
        // Return a relative path served statically via Express config
        return `/uploads/${fileName}`;
      } catch (err: any) {
        console.error("Local base64 saving failed", err);
        throw new Error(`Failed to save uploaded image locally: ${err.message}`);
      }
    }

    // If it's already an HTTP image link, just return it
    if (base64OrUrl.startsWith("http")) {
      return base64OrUrl;
    }

    throw new Error("Unknown image format. Must be base64 or URL.");
  }
};
