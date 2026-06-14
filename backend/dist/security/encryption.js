"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateSecureToken = generateSecureToken;
exports.generateBackupCodes = generateBackupCodes;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function generateSecureToken(length = 32) {
    return crypto_1.default.randomBytes(length).toString("hex");
}
function generateBackupCodes(count = 8) {
    return Array.from({ length: count }, () => crypto_1.default.randomBytes(4).toString("hex").toUpperCase().match(/.{4}/g).join("-"));
}
//# sourceMappingURL=encryption.js.map