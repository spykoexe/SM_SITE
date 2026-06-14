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
exports.getReviews = getReviews;
exports.createReview = createReview;
exports.createTicket = createTicket;
exports.getStats = getStats;
const publicService = __importStar(require("../services/publicService"));
const validation_1 = require("../utils/validation");
async function getReviews(req, res, next) {
    try {
        const reviews = await publicService.getReviews();
        res.json({ success: true, data: reviews });
    }
    catch (err) {
        next(err);
    }
}
async function createReview(req, res, next) {
    try {
        const data = validation_1.reviewSchema.parse(req.body);
        const review = await publicService.createReview(data, req.user?.id);
        res.status(201).json({ success: true, data: review });
    }
    catch (err) {
        next(err);
    }
}
async function createTicket(req, res, next) {
    try {
        const data = validation_1.ticketSchema.parse(req.body);
        const ticket = await publicService.createTicket(data, req.user?.id);
        res.status(201).json({ success: true, data: ticket });
    }
    catch (err) {
        next(err);
    }
}
async function getStats(req, res, next) {
    try {
        const stats = await publicService.getPublicStats();
        res.json({ success: true, data: stats });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=publicController.js.map