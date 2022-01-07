// toVendorRequestAlerts.ts
import * as functions from "firebase-functions";
import admin = require("firebase-admin");

const db = admin.firestore();
const fcm = admin.messaging();

export const requestCreatedVendorAlert = functions.firestore
  .document("requests")
  .onCreate(async snapshot => {
    const request = snapshot.data();

    const querySnapshot = db.collection("tokens").doc(request!["vendorId"]);
    const doc = await querySnapshot.get();
    const deviceToken = doc.data()!["deviceToken"];

    const payLoad: admin.messaging.MessagingPayload = {
      notification: {
        title: "🎉 New request!",
        body: `${request!.scoutName} has requested to book ${
          request!.spaceName
        }.`,
        clickAction: "FLUTTER_NOTIFICATION_CLICK"
      }
    };

    return fcm.sendToDevice(deviceToken, payLoad);
  });
