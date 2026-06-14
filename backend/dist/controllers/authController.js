"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.verify2FA = verify2FA;
exports.refresh = refresh;
exports.logout = logout;
exports.logoutAll = logoutAll;
exports.setup2FA = setup2FA;
exports.confirm2FA = confirm2FA;
exports.disable2FA = disable2FA;
const authService = __importStar(require("../services/authService"));
const validation_1 = require("../utils/validation");
async function register(req, res, next) {
    try {
        const data = validation_1.registerSchema.parse(req.body);
        const result = await authService.register(data);
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const data = validation_1.loginSchema.parse(req.body);
        const ip = req.ip || req.socket.remoteAddress;
        const result = await authService.login(data, ip, req.headers["user-agent"]);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function verify2FA(req, res, next) {
    try {
        const { tempToken, code } = req.body;
        if (!tempToken || !code)
            throw new Error("tempToken et code requis");
        const ip = req.ip || req.socket.remoteAddress;
        const result = await authService.verify2FA(tempToken, code, ip, req.headers["user-agent"]);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function refresh(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw new Error("refreshToken requis");
        const result = await authService.refreshTokens(refreshToken);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function logout(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
        await authService.logout(req.user.id, token);
        res.json({ success: true, message: "Déconnecté" });
    }
    catch (err) {
        next(err);
    }
}
async function logoutAll(req, res, next) {
    try {
        await authService.logoutAll(req.user.id);
        res.json({ success: true, message: "Toutes les sessions ont été révoquées" });
    }
    catch (err) {
        next(err);
    }
}
async function setup2FA(req, res, next) {
    try {
        const result = await authService.setup2FA(req.user.id);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function confirm2FA(req, res, next) {
    try {
        const { code } = req.body;
        if (!code)
            throw new Error("Code requis");
        const result = await authService.confirm2FA(req.user.id, code);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function disable2FA(req, res, next) {
    try {
        const { password } = req.body;
        if (!password)
            throw new Error("Mot de passe requis");
        await authService.disable2FA(req.user.id, password);
        res.json({ success: true, message: "2FA désactivée" });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=authController.js.map