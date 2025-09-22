const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage riêng cho file .rar
const storageRar = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        resource_type: 'raw',            // bắt buộc cho file .rar, .zip, .pdf,...
        folder: 'rar_files',             // folder trên cloudinary
        format: async (req, file) => 'rar', // ép định dạng lưu thành .rar
        public_id: (req, file) => {
            return file.originalname.split('.')[0]; // giữ nguyên tên file (không đuôi)
        }
    },
});

module.exports = { storageRar };
