import * as functions from "firebase-functions";
import checkEmailAvailability from "../modules/checkEmailAvailability";

export default functions.https.onCall((data, context) => {
  return checkEmailAvailability(data.email);
});
