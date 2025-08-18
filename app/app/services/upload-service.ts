import Axios from "../config/axios";

export interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
}

export const uploadFile = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<unknown> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await Axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.({
            percentage,
            loaded: progressEvent.loaded,
            total: progressEvent.total,
          });
        }
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
