import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary upload function
const uploadToCloudinary = async (filePath: string, folder: string) => {
    return cloudinary.uploader.upload(filePath, {
        folder: folder || "uploads", // Default folder
    });
};

export default uploadToCloudinary;
