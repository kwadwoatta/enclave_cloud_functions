import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export default functions.https.onCall(async (data, context) => {
  try {
    const { email } = data;

    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && (user.customClaims as any).vendor !== true)
      return false;
    return true;
  } catch (error) {
    throw error;
  }
});
