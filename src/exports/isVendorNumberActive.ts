import * as functions from "firebase-functions";
import checkVendorPhoneNumberAvailability from "../modules/checkVendorPhoneNumberAvailability";

export default functions.https.onCall((data, context) => {
  return checkVendorPhoneNumberAvailability(data.phoneNumber);
});
