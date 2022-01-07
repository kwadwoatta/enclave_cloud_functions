import * as admin from "firebase-admin";

async function grantScoutRole(email: string): Promise<void> {
  try {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && (user.customClaims as any).scout === true) return;
    if (user.customClaims && (user.customClaims as any).vendor === true)
      return admin.auth().setCustomUserClaims(user.uid, {
        scout: true,
        vendor: true
      });
    return admin.auth().setCustomUserClaims(user.uid, {
      scout: true,
      vendor: false
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default grantScoutRole;
