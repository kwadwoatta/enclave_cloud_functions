//
import * as functions from "firebase-functions";
import admin = require("firebase-admin");

const db = admin.firestore();
const fcm = admin.messaging();

export const requestUpdatedScoutAlert = functions.firestore
  .document("requests")
  .onUpdate(async snapshot => {
    try {
      const request = snapshot.after.data();

      const querySnapshot = db.collection("tokens").doc(request!["scoutId"]);
      const doc = await querySnapshot.get();
      const deviceToken = doc.data()!["deviceToken"];
      const requestStatus: string = doc.data()!["status"];
      let payLoad: admin.messaging.MessagingPayload;

      switch (requestStatus) {
        case "accepted": {
          payLoad = {
            notification: {
              title: "🥳 Request accepted!",
              body: `${request!.vendorName} has accepted your request to book ${
                request!.spaceName
              }.`,
              clickAction: "FLUTTER_NOTIFICATION_CLICK"
            }
          };
          return fcm.sendToDevice(deviceToken, payLoad);
        }
        case "rejected": {
          payLoad = {
            notification: {
              title: "🥺 Request rejected!",
              body: `${request!.vendorName} has rejected your request to book ${
                request!.spaceName
              }.`,
              clickAction: "FLUTTER_NOTIFICATION_CLICK"
            }
          };
          return fcm.sendToDevice(deviceToken, payLoad);
        }
        default:
          return;
      }
    } catch (error) {
      throw error;
    }
  });
