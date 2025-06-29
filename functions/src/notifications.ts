import * as admin from 'firebase-admin';

const db = admin.firestore();

export const notifications = {
  // Send meal reminders
  sendMealReminders: async (mealType: string) => {
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
          if (!parentDoc.exists) continue;
          
          const parentData = parentDoc.data();
          const preferences = parentData?.preferences?.notifications;
          
          if (preferences?.mealReminders) {
            await notifications.sendMealReminderToParent(parentId, childData, mealType);
          }
        }
      }
      
      console.log(`Meal reminders sent for ${mealType}`);
      
    } catch (error) {
      console.error('Error sending meal reminders:', error);
      throw error;
    }
  },

  // Send meal reminder to specific parent
  sendMealReminderToParent: async (parentId: string, childData: any, mealType: string) => {
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
      
    } catch (error) {
      console.error('Error sending meal reminder to parent:', error);
    }
  },

  // Send achievement notifications
  sendAchievementNotifications: async (childId: string, achievement: any) => {
    try {
      const childDoc = await db.collection('children').doc(childId).get();
      if (!childDoc.exists) return;
      
      const childData = childDoc.data();
      const parentIds = childData?.parentIds || [];
      
      for (const parentId of parentIds) {
        const parentDoc = await db.collection('users').doc(parentId).get();
        if (!parentDoc.exists) continue;
        
        const parentData = parentDoc.data();
        const preferences = parentData?.preferences?.notifications;
        
        if (preferences?.achievements) {
          await notifications.sendAchievementToParent(parentId, childData, achievement);
        }
      }
      
    } catch (error) {
      console.error('Error sending achievement notifications:', error);
      throw error;
    }
  },

  // Send achievement to specific parent
  sendAchievementToParent: async (parentId: string, childData: any, achievement: any) => {
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
      
    } catch (error) {
      console.error('Error sending achievement to parent:', error);
    }
  },

  // Send nutrition alerts
  sendNutritionAlerts: async (childId: string, alert: any) => {
    try {
      const childDoc = await db.collection('children').doc(childId).get();
      if (!childDoc.exists) return;
      
      const childData = childDoc.data();
      const parentIds = childData?.parentIds || [];
      
      for (const parentId of parentIds) {
        const parentDoc = await db.collection('users').doc(parentId).get();
        if (!parentDoc.exists) continue;
        
        const parentData = parentDoc.data();
        const preferences = parentData?.preferences?.notifications;
        
        if (preferences?.reportGeneration) {
          await notifications.sendNutritionAlertToParent(parentId, childData, alert);
        }
      }
      
    } catch (error) {
      console.error('Error sending nutrition alerts:', error);
      throw error;
    }
  },

  // Send nutrition alert to specific parent
  sendNutritionAlertToParent: async (parentId: string, childData: any, alert: any) => {
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
      
    } catch (error) {
      console.error('Error sending nutrition alert to parent:', error);
    }
  }
}; 