import * as admin from "firebase-admin";

function checkEmailAvailability(email: String): Promise<boolean> {
  try {
    return admin.firestore().runTransaction(async crudTransaction => {
      const usersCollRef = admin.firestore().collection("/vendors");

      const querySnapshot = await usersCollRef
        .where("email", "==", email)
        .get();
      if (querySnapshot.docs[0] === undefined) return false;
      else return true;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default checkEmailAvailability;
