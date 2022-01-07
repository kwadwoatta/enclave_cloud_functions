import * as admin from "firebase-admin";
// import * as functions from "firebase-functions";

async function checkVendorPhoneNumberAvailability(
  phoneNumber: string
): Promise<boolean> {
  try {
    console.log(phoneNumber);
    const usersCollRef = admin.firestore().collection("/vendors");

    const querySnapshot = await usersCollRef
      .where("phoneNumber", "==", phoneNumber)
      .get();
    if (querySnapshot.docs[0] === undefined) return false;
    else return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default checkVendorPhoneNumberAvailability;
