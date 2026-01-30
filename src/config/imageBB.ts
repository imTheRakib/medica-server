import axios from "axios";
import FormData from "form-data";
import config from "../config";

const uploadToImageBB = async (
  imageBuffer: Buffer,
  filename: string,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", imageBuffer.toString("base64"));
    formData.append("name", filename);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${config.IMAGEBB_API_KEY}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );

    return response.data.data.url;
  } catch (error) {
    console.error("ImageBB upload error:", error);
    throw new Error("Failed to upload image to ImageBB");
  }
};

export { uploadToImageBB };
