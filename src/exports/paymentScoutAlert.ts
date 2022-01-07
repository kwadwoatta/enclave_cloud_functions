import * as functions from "firebase-functions";
import admin = require("firebase-admin");

const db = admin.firestore();
const fcm = admin.messaging();

export const paymentInitiatedScoutAlert = functions.firestore
  .document("payments")
  .onCreate(async snapshot => {
    try {
      const payment = snapshot.data();

      const querySnapshot = db.collection("tokens").doc(payment!["vendorId"]);
      const doc = await querySnapshot.get();
      const deviceToken = doc.data()!["deviceToken"];
      const paymentStatus: string = doc.data()!["status"];
      let payLoad: admin.messaging.MessagingPayload;
      if (paymentStatus === "pending") {
        payLoad = {
          notification: {
            title: "⏳ Payment initiated!",
            body: `Your payment to book ${
              payment!.spaceName
            } has been initiated. Please wait for an update.`,
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

export const paymentUpdatedScoutAlert = functions.firestore
  .document("payments")
  .onCreate(async snapshot => {
    try {
      const payment = snapshot.data();

      const querySnapshot = db.collection("tokens").doc(payment!["vendorId"]);
      const doc = await querySnapshot.get();
      const deviceToken = doc.data()!["deviceToken"];
      const paymentStatus: string = doc.data()!["status"];
      let payLoad: admin.messaging.MessagingPayload;
      if (paymentStatus === "pending") {
        payLoad = {
          notification: {
            title: "🤑 Payment successful!",
            body: `Your payment ${payment!.vendorName} to book ${
              payment!.spaceName
            } is successful. Good luck with your event.`,
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
