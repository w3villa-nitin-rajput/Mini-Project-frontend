import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, Trash2, X } from "lucide-react";
import { useUploadImage } from "../../hooks/useUploadImage";

const ProfilePictureUpload = ({ currentImage, onImageUpload, isUploadingGlobal }) => {
    const fileInputRef = useRef(null);
    const { uploadImage, uploading, progress } = useUploadImage();
    const [preview, setPreview] = useState(currentImage || "");

    useEffect(() => {
        setPreview(currentImage || "");
    }, [currentImage]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            const result = await uploadImage(file);
            if (result) {
                // Return URL and Public ID correctly
                onImageUpload(result.url, result.public_id);
            } else {
                // Revert on fail
                setPreview(currentImage || "");
            }
        } catch (err) {
            setPreview(currentImage || "");
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const isUploading = uploading || isUploadingGlobal;

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Camera className="w-12 h-12 text-gray-400" />
                    )}
                </div>

                <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isUploading ? <Upload className="w-5 h-5 animate-bounce" /> : <Camera className="w-5 h-5" />}
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
            />

            {uploading && (
                <div className="w-full max-w-xs">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-center mt-1 text-gray-500">Uploading... {progress.toFixed(0)}%</p>
                </div>
            )}

            <p className="text-xs text-gray-500 text-center">
                Allowed Formats: JPG, PNG, WebP.<br />Max size: 5MB.
            </p>
        </div>
    );
};

export default ProfilePictureUpload;
