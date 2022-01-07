import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import payMoneyToEnclave from "../modules/payMoneyToEnclave";
import transferMoneyToVendor from "../modules/transferMoneyToVendor";
import payToEnclaveSuccessful from "../modules/payToEnclaveSuccessful";
import transferToVendorSuccessful from "../modules/payToVendorSuccessful";

const db = admin.firestore();

export default functions.https.onCall(async (data, context) => {
  const {
    scoutID,
    requestID,
    totalAmount,
    scoutPhoneNumber,
    vendorPhoneNumber,
    scoutNetwork,
    vendorNetwork,
    paymentID,
    paymentFee,
    spaceName,
    scoutName
  } = data;

  const paymentDocRef = db.collection("payments").doc(paymentID);
  const reqDocRef = db.collection("requests").doc(requestID);

  try {
    console.info("Paying for requested space");
    console.info(data);

    //* Number format 233500124824

    const transferToVendorFee = (+totalAmount - +paymentFee) * 0.01;
    const bookingFee = +totalAmount * 0.9 - transferToVendorFee;

    if (scoutID !== context.auth?.uid)
      throw Error("You are not authorized to make this transaction");

    const reqDoc = await reqDocRef.get();
    const paymentDoc = await paymentDocRef.get();

    const reqStatus = reqDoc.data()!["status"] as string;
    const paymentStatus = paymentDoc.data()!["status"] as string;

    if (reqStatus === "accepted" && paymentStatus === "INITIATED") {
      //* PAYING MONEY INTO VENDOR ACCOUNT
      await payMoneyToEnclave(
        totalAmount,
        scoutPhoneNumber,
        scoutNetwork,
        paymentID,
        spaceName
      );

      if (await payToEnclaveSuccessful(`${paymentID}-pay-to-enclave`))
        await paymentDocRef.update({
          status: "PENDING"
        });
      else {
        console.error(`Payment ${paymentID} to Enclave was not successful`);
        throw Error("Could not initiate payment process");
      }

      //* TRANSFERRING 90% OF RECEIVED MONEY TO VENDOR
      await transferMoneyToVendor(
        `${bookingFee}`,
        vendorPhoneNumber,
        vendorNetwork,
        paymentID,
        spaceName,
        scoutName
      );
      if (await transferToVendorSuccessful(`${paymentID}-transfer-to-vendor`))
        await paymentDocRef.update({
          status: "COMPLETED"
        });
      else {
        console.error(`Transfer ${paymentID} to vendor was not successful`);
        throw Error(
          "Could not complete payment process. Please report to Enclave."
        );
      }
    }
  } catch (error) {
    await paymentDocRef.update({
      status: "CANCELED"
    });
    throw error;
  }
});
