import multer from "multer";
import path from "path";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const allowedMimeTypes = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf", "text/plain", "application/json",
  "video/mp4", "audio/mpeg",
];

export const upload = multer({
  storage,
  limits: { fileSize: parseInt(env.UPLOAD_MAX_SIZE, 10) },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`));
    }
  },
});

export function handleUploadError(err: any, req: any, res: any, next: any) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ success: false, message: "Fichier trop volumineux" });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    logger.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
}
