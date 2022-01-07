import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export default functions.https.onCall(async (data, context) => {
  try {
    const { uid, photoURL } = data;

    const user = await admin
      .auth()
      .updateUser(uid, { photoURL: photoURL })
      .catch(error => {
        throw error;
      });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
