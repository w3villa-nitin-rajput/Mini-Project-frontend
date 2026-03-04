import { useState } from "react";
import imageCompression from "browser-image-compression";
import { profileService } from "../api/api";
import axios from "axios";
import { toast } from "react-toastify";

export const useUploadImage = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadImage = async (file) => {
        if (!file) return null;

        // 1. Validation
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Invalid file type. Only JPG, PNG, and WebP are allowed.");
            return null;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should not exceed 5MB.");
            return null;
        }

        setUploading(true);
        setProgress(10);

        try {
            // 2. Compress Image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            setProgress(30);

            // 3. Get Signature from backend
            const sigResponse = await profileService.getCloudinarySignature();
            const { signature, timestamp, cloud_name, api_key } = sigResponse.data;
            setProgress(50);

            // 4. Upload to Cloudinary using signed upload
            const formData = new FormData();
            formData.append("file", compressedFile);
            formData.append("api_key", api_key);
            formData.append("timestamp", timestamp);
            formData.append("signature", signature);

            const uploadResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        // Scale 50 to 100
                        setProgress(50 + (percentCompleted / 2));
                    },
                }
            );

            setProgress(100);
            return {
                url: uploadResponse.data.secure_url,
                public_id: uploadResponse.data.public_id
            };
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image.");
            throw error;
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return { uploadImage, uploading, progress };
};
