import * as functions from "firebase-functions";
import grantScoutRole from "../modules/grantScoutRole";

export default functions.https.onCall((data, context) => {
  return grantScoutRole(data.email);
});
