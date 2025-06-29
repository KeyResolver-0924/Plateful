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
exports.imageRecognition = void 0;
const functions = __importStar(require("firebase-functions"));
// const db = admin.firestore();
exports.imageRecognition = {
    // Process uploaded image for food recognition
    processUploadedImage: functions.storage
        .object()
        .onFinalize(async (object) => {
        var _a;
        if (!((_a = object.name) === null || _a === void 0 ? void 0 : _a.includes('/meal_photos/')))
            return;
        try {
            await exports.imageRecognition.analyzeFood(object.name);
            console.log(`Image processed: ${object.name}`);
        }
        catch (error) {
            console.error('Error processing image:', error);
        }
    }),
    // Analyze food in image
    analyzeFood: async (imagePath) => {
        // This would integrate with Google Vision API
        console.log(`Analyzing food in image: ${imagePath}`);
    },
    // Match foods to database
    matchFoodsToDatabase: async (visionResults) => {
        // This would match Vision API results to food database
        console.log('Matching foods to database');
        return [];
    }
};
//# sourceMappingURL=imageRecognition.js.map