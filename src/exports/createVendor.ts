import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import grantVendorRole from "../modules/grantVendorRole";
import checkVendorPhoneNumberAvailability from "../modules/checkVendorPhoneNumberAvailability";

export default functions.https.onCall(async (data, context) => {
  try {
    const { email, userName, phoneNumber, password, network } = data;
    const phoneNumberAvailable = await checkVendorPhoneNumberAvailability(
      `+233${phoneNumber}`
    );

    if (phoneNumberAvailable)
      throw Error(
        "Phone number is associated to a different vendor. Please use a different phone number"
      );

    const user = await admin.auth().createUser({
      email: email,
      emailVerified: false,
      phoneNumber: `+233${phoneNumber}`,
      password: password,
      displayName: userName,
      disabled: false
    });

    await admin
      .firestore()
      .collection("vendors")
      .doc(user.uid)
      .create({
        uid: user.uid,
        phoneNumber: `+233${phoneNumber}`,
        email: email,
        displayName: userName,
        network: network,
        phoneNumberVerified: false,
        creditCardNumber: null
      });

    await grantVendorRole(email);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
