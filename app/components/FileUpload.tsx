"use client";
import React, { useRef, useState } from "react";
import { IKImage, IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess?: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}




export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image",
}: FileUploadProps) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };

    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false);
        setError(null);
        if (onSuccess) {
            onSuccess(response);
        }
    };

    const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentCompleted = Math.round((evt.loaded / evt.total) * 100);
            onProgress(percentCompleted);
        }
    };

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    };

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please select a video file");
                return false
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("File size should be less than 100MB")
                return false
            }

        } else {
            const validTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validTypes.includes(file.type)) {
                setError("Please select a valid image file")
                return false
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("File size should be less than 5MB")
                return false
            }
        }

    }
    return (
        <div className="space-y-2">
            <IKUpload
                fileName={fileType === "video" ? "video" : "image"}
                useUniqueFileName={true}
                validateFile={(file) => file.size < 2000000}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleProgress}
                onUploadStart={handleStartUpload}
                folder={fileType === "video" ? "videos" : "images"}
            />
            {
                uploading && (
                    <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                )
            }

            {
                error && (
                    <div className="text-red-500">{error}</div>
                )
            }
        </div>
    );
}