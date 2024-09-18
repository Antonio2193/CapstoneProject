import 'dotenv/config';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'epicode',
    },
});

const uploadCloudinary = multer({ storage: storage }); // il primo storage è da documentazione, il secondo è la variabile creata a riga 12

export default uploadCloudinary