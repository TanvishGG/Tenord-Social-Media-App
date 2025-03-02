import sharp from "sharp";

export async function processProfileImage(
  image: string,
  type: "banner" | "avatar" = "avatar",
): Promise<Buffer> {
  if (!/^data:image\/(png|jpeg|jpg|webp);base64/.test(image)) {
    throw new Error("Invalid avatar");
  }
  const buffer = Buffer.from(image.split(",")[1], "base64");
  const sharpimg = sharp(buffer);
  if (type === "avatar") {
    return await sharpimg
      .resize(512, 512, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 100 })
      .toBuffer();
  } else if (type === "banner") {
    return await sharpimg
      .resize(1024, 576, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 100 })
      .toBuffer();
  } else {
    throw new Error("Invalid type");
  }
}
