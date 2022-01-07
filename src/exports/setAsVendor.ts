import * as functions from "firebase-functions";
import grantVendorRole from "../modules/grantVendorRole";

export default functions.https.onCall((data, context) => {
  return grantVendorRole(data.email);
});
