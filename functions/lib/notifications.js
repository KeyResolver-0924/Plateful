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
exports.notifications = void 0;
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.notifications = {
    // Send meal reminders
    sendMealReminders: async (mealType) => {
        var _a;
        try {
            // Get all active children
            const childrenQuery = await db.collection('children')
                .where('profile.isActive', '==', true)
                .get();
            for (const childDoc of childrenQuery.docs) {
                const childData = childDoc.data();
                const parentIds = childData.parentIds || [];
                // Get parent preferences
                for (const parentId of parentIds) {
                    const parentDoc = await db.collection('users').doc(parentId).get();
                    if (!parentDoc.exists)
                        continue;
                    const parentData = parentDoc.data();
                    const preferences = (_a = parentData === null || parentData === void 0 ? void 0 : parentData.preferences) === null || _a === void 0 ? void 0 : _a.notifications;
                    if (preferences === null || preferences === void 0 ? void 0 : preferences.mealReminders) {
                        await exports.notifications.sendMealReminderToParent(parentId, childData, mealType);
                    }
                }
            }
            console.log(`Meal reminders sent for ${mealType}`);
        }
        catch (error) {
            console.error('Error sending meal reminders:', error);
            throw error;
        }
    },
    // Send meal reminder to specific parent
    sendMealReminderToParent: async (parentId, childData, mealType) => {
        try {
            const message = {
                notification: {
                    title: `Time for ${mealType}!`,
                    body: `It's time for ${childData.profile.firstName}'s ${mealType}. Let's make it fun and nutritious!`
                },
                data: {
                    type: 'meal_reminder',
                    mealType,
                    childId: childData.id,
                    childName: childData.profile.firstName
                },
                topic: `parent_${parentId}`
            };
            // Send push notification
            await admin.messaging().send(message);
            console.log(`Meal reminder sent to parent ${parentId}`);
        }
        catch (error) {
            console.error('Error sending meal reminder to parent:', error);
        }
    },
    // Send achievement notifications
    sendAchievementNotifications: async (childId, achievement) => {
        var _a;
        try {
            const childDoc = await db.collection('children').doc(childId).get();
            if (!childDoc.exists)
                return;
            const childData = childDoc.data();
            const parentIds = (childData === null || childData === void 0 ? void 0 : childData.parentIds) || [];
            for (const parentId of parentIds) {
                const parentDoc = await db.collection('users').doc(parentId).get();
                if (!parentDoc.exists)
                    continue;
                const parentData = parentDoc.data();
                const preferences = (_a = parentData === null || parentData === void 0 ? void 0 : parentData.preferences) === null || _a === void 0 ? void 0 : _a.notifications;
                if (preferences === null || preferences === void 0 ? void 0 : preferences.achievements) {
                    await exports.notifications.sendAchievementToParent(parentId, childData, achievement);
                }
            }
        }
        catch (error) {
            console.error('Error sending achievement notifications:', error);
            throw error;
        }
    },
    // Send achievement to specific parent
    sendAchievementToParent: async (parentId, childData, achievement) => {
        try {
            const message = {
                notification: {
                    title: `🎉 Achievement Unlocked!`,
                    body: `${childData.profile.firstName} just earned: ${achievement.title}`
                },
                data: {
                    type: 'achievement',
                    achievementId: achievement.id,
                    childId: childData.id,
                    childName: childData.profile.firstName
                },
                topic: `parent_${parentId}`
            };
            await admin.messaging().send(message);
            console.log(`Achievement notification sent to parent ${parentId}`);
        }
        catch (error) {
            console.error('Error sending achievement to parent:', error);
        }
    },
    // Send nutrition alerts
    sendNutritionAlerts: async (childId, alert) => {
        var _a;
        try {
            const childDoc = await db.collection('children').doc(childId).get();
            if (!childDoc.exists)
                return;
            const childData = childDoc.data();
            const parentIds = (childData === null || childData === void 0 ? void 0 : childData.parentIds) || [];
            for (const parentId of parentIds) {
                const parentDoc = await db.collection('users').doc(parentId).get();
                if (!parentDoc.exists)
                    continue;
                const parentData = parentDoc.data();
                const preferences = (_a = parentData === null || parentData === void 0 ? void 0 : parentData.preferences) === null || _a === void 0 ? void 0 : _a.notifications;
                if (preferences === null || preferences === void 0 ? void 0 : preferences.reportGeneration) {
                    await exports.notifications.sendNutritionAlertToParent(parentId, childData, alert);
                }
            }
        }
        catch (error) {
            console.error('Error sending nutrition alerts:', error);
            throw error;
        }
    },
    // Send nutrition alert to specific parent
    sendNutritionAlertToParent: async (parentId, childData, alert) => {
        try {
            const message = {
                notification: {
                    title: `📊 Nutrition Update`,
                    body: `${childData.profile.firstName}'s nutrition report is ready: ${alert.message}`
                },
                data: {
                    type: 'nutrition_alert',
                    alertId: alert.id,
                    childId: childData.id,
                    childName: childData.profile.firstName
                },
                topic: `parent_${parentId}`
            };
            await admin.messaging().send(message);
            console.log(`Nutrition alert sent to parent ${parentId}`);
        }
        catch (error) {
            console.error('Error sending nutrition alert to parent:', error);
        }
    }
};
//# sourceMappingURL=notifications.js.map