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
exports.mlProcessor = void 0;
const functions = __importStar(require("firebase-functions"));
// const db = admin.firestore();
exports.mlProcessor = {
    // Update acceptance model
    updateAcceptanceModel: functions.firestore
        .document('mealFoodItems/{itemId}')
        .onWrite(async (change, context) => {
        if (!change.after.exists)
            return;
        try {
            const foodData = change.after.data();
            if (!foodData) {
                console.log('No food data found');
                return;
            }
            await exports.mlProcessor.updateMLModel(foodData.childId, foodData.foodItemId, foodData);
            await exports.mlProcessor.recalculatePredictions(foodData.childId, foodData.foodItemId);
        }
        catch (error) {
            console.error('Error updating acceptance model:', error);
        }
    }),
    // Update ML model
    updateMLModel: async (childId, foodItemId, foodData) => {
        console.log(`Updating ML model for child ${childId}, food ${foodItemId}`);
    },
    // Recalculate predictions
    recalculatePredictions: async (childId, foodItemId) => {
        console.log(`Recalculating predictions for child ${childId}, food ${foodItemId}`);
    }
};
//# sourceMappingURL=mlProcessor.js.map