import fs from "fs";
import path from "path";

export const deleteFileByUrl = (fileUrl) => {
  try {
    if (!fileUrl) return;

    const fileName = fileUrl.split("/src/Uploads/")[1];
    if (!fileName) return;

    const filePath = path.resolve("src/Uploads", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("File delete error:", error.message);
  }
};

export const deleteMultipleFilesByUrls = (fileUrls = []) => {
  fileUrls.forEach((fileUrl) => deleteFileByUrl(fileUrl));
};