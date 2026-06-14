"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.handleUploadError = handleUploadError;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, env_1.env.UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const allowedMimeTypes = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/pdf", "text/plain", "application/json",
    "video/mp4", "audio/mpeg",
];
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: parseInt(env_1.env.UPLOAD_MAX_SIZE, 10) },
    fileFilter: (_req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`));
        }
    },
});
function handleUploadError(err, req, res, next) {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ success: false, message: "Fichier trop volumineux" });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
        logger_1.logger.error(err);
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
}
//# sourceMappingURL=upload.js.map