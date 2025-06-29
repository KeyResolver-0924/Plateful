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
exports.userManagement = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const db = admin.firestore();
exports.userManagement = {
    // Create user profile when user signs up
    createUserProfile: functions.auth.user().onCreate(async (user) => {
        try {
            const { uid, email, displayName, phoneNumber } = user;
            // Create user profile in Firestore
            const userProfile = {
                userId: uid,
                email: email || '',
                userType: 'parent',
                profile: {
                    firstName: (displayName === null || displayName === void 0 ? void 0 : displayName.split(' ')[0]) || '',
                    lastName: (displayName === null || displayName === void 0 ? void 0 : displayName.split(' ').slice(1).join(' ')) || '',
                    phoneNumber: phoneNumber || '',
                    avatar: '',
                    timezone: 'America/New_York',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
                    isActive: true
                },
                subscription: {
                    planType: 'free',
                    status: 'active',
                    startDate: admin.firestore.FieldValue.serverTimestamp(),
                    endDate: null,
                    paymentMethodId: null
                },
                preferences: {
                    notifications: {
                        mealReminders: true,
                        reportGeneration: true,
                        achievements: true
                    },
                    language: 'en',
                    units: 'imperial'
                }
            };
            await db.collection('users').doc(uid).set(userProfile);
            console.log(`User profile created for ${uid}`);
        }
        catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }),
    // Create child profile
    createChildProfile: async (data) => {
        try {
            const { parentId, firstName, lastName, dateOfBirth, gender, ageGroup, allergies, dietaryRestrictions } = data;
            const childProfile = {
                parentIds: [parentId],
                profile: {
                    firstName,
                    lastName,
                    dateOfBirth,
                    gender,
                    avatar: '',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isActive: true
                },
                medicalInfo: {
                    allergies,
                    dietaryRestrictions,
                    specialNeeds: '',
                    pediatricianNotes: ''
                },
                ageGroup,
                plateDevice: {
                    deviceId: null,
                    isConnected: false,
                    lastSync: null,
                    calibrationData: {}
                }
            };
            const childRef = await db.collection('children').add(childProfile);
            console.log(`Child profile created: ${childRef.id}`);
            return childRef.id;
        }
        catch (error) {
            console.error('Error creating child profile:', error);
            throw error;
        }
    },
    // Update user preferences
    updateUserPreferences: async (data) => {
        try {
            const { userId, preferences } = data;
            await db.collection('users').doc(userId).update({
                preferences,
                'profile.lastUpdated': admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`User preferences updated for ${userId}`);
        }
        catch (error) {
            console.error('Error updating user preferences:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=userManagement.js.map