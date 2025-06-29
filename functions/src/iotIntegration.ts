import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const iotIntegration = {
  // Handle plate device data
  handlePlateDeviceData: functions.https.onRequest(async (req, res) => {
    const { deviceId, readings, timestamp } = req.body;
    
    try {
      const device = await iotIntegration.validateDevice(deviceId);
      if (!device) {
        res.status(401).send('Unauthorized device');
        return;
      }
      
      await iotIntegration.processDeviceReadings(deviceId, readings, timestamp);
      res.status(200).send('Data processed successfully');
    } catch (error) {
      console.error('Error processing device data:', error);
      res.status(500).send('Internal server error');
    }
  }),

  // Validate device
  validateDevice: async (deviceId: string) => {
    const deviceDoc = await db.collection('plateDevices').doc(deviceId).get();
    return deviceDoc.exists ? deviceDoc.data() : null;
  },

  // Process device readings
  processDeviceReadings: async (deviceId: string, readings: any, timestamp: any) => {
    console.log(`Processing readings from device ${deviceId}`);
  }
}; 