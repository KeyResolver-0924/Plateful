import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();
const auth = admin.auth();

export const userManagement = {
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
          firstName: displayName?.split(' ')[0] || '',
          lastName: displayName?.split(' ').slice(1).join(' ') || '',
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
      
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }),

  // Create child profile
  createChildProfile: async (data: any) => {
    try {
      const {
        parentId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        ageGroup,
        allergies,
        dietaryRestrictions
      } = data;
      
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
      
    } catch (error) {
      console.error('Error creating child profile:', error);
      throw error;
    }
  },

  // Update user preferences
  updateUserPreferences: async (data: any) => {
    try {
      const { userId, preferences } = data;
      
      await db.collection('users').doc(userId).update({
        preferences,
        'profile.lastUpdated': admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`User preferences updated for ${userId}`);
      
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
}; 