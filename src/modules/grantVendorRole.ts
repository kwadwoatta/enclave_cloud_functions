import * as admin from "firebase-admin";

async function grantVendorRole(email: string): Promise<void> {
  try {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && (user.customClaims as any).vendor === true) return;
    if (user.customClaims && (user.customClaims as any).scout === true)
      return admin.auth().setCustomUserClaims(user.uid, {
        vendor: true,
        scout: true
      });
    return admin.auth().setCustomUserClaims(user.uid, {
      vendor: true,
      scout: false
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default grantVendorRole;
