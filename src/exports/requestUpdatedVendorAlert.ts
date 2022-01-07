import * as functions from "firebase-functions";
import admin = require("firebase-admin");

const db = admin.firestore();
const fcm = admin.messaging();

export const requestUpdatedVendorAlert = functions.firestore
  .document("requests")
  .onUpdate(async snapshot => {
    try {
      const request = snapshot.after.data();

      const querySnapshot = db.collection("tokens").doc(request!["vendorId"]);
      const doc = await querySnapshot.get();
      const deviceToken = doc.data()!["deviceToken"];
      const requestStatus: string = doc.data()!["status"];
      let payLoad: admin.messaging.MessagingPayload;
      if (requestStatus === "canceled") {
        payLoad = {
          notification: {
            title: "😔 Request canceled!",
            body: `${request!.scoutName} has canceled your request to book ${
              request!.spaceName
            }.`,
            clickAction: "FLUTTER_NOTIFICATION_CLICK"
          }
        };
        return fcm.sendToDevice(deviceToken, payLoad);
      }
      return;
    } catch (error) {
      throw error;
    }
  });
