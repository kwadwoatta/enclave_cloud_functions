import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

import payToEnclaveSuccessful from "../modules/payToEnclaveSuccessful";

const db = admin.firestore();

export default functions.https.onCall(async (data, context) => {
  const {
    userID,
    eventID,
    totalAmount,
    userPhoneNumber,
    userNetwork,
    paymentID
  } = data;

  const paymentDocRef = db.collection("eventPayments").doc(paymentID);
  const eventDocRef = db.collection("events").doc(eventID);

  try {
    console.info("Paying to post event");
    console.info(data);

    //* Number format 233500124824

    if (userID !== context.auth?.uid)
      throw Error("You are not authorized to make this transaction");

    const eventDoc = await eventDocRef.get();
    const paymentDoc = await paymentDocRef.get();

    const eventStatus = eventDoc.data()!["status"] as string;
    const paymentStatus = paymentDoc.data()!["status"] as string;

    if (eventStatus === "accepted" && paymentStatus === "INITIATED") {
      //* PAYING MONEY INTO VENDOR ACCOUNT
      await payMoneyToPostAd(
        totalAmount,
        userPhoneNumber,
        userNetwork,
        paymentID,
        eventID
      );

      if (await payToEnclaveSuccessful(`${paymentID}-pay-for-event`))
        await paymentDocRef.update({
          status: "PENDING"
        });
      else {
        console.error(`Payment ${paymentID} to Enclave was not successful`);
        throw Error("Could not initiate payment process");
      }
    }
  } catch (error) {
    await paymentDocRef.update({
      status: "CANCELED"
    });
    throw error;
  }
});

async function payMoneyToPostAd(
  totalAmount: string,
  userPhoneNumber: string,
  network: string,
  paymentID: string,
  eventID: string
) {
  try {
    const httpConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic base64_encode('MWFlNGFiMTdmYjcyYzZkMzg1YjU0ZmJlMDZkMmYzNjE=')",
        "Cache-Control": "no-cache"
      }
    };

    const httpData = {
      amount: totalAmount,
      processing_code: "000200",
      transaction_id: `${paymentID}-pay-for-event`,
      desc: `Paying ${totalAmount} to post event with id ${eventID}  on ${
        new Date().toISOString
      }. Payment ID: ${paymentID}`,
      merchant_id: "TTM-00001229",
      subscriber_number: userPhoneNumber,
      "r-switch": network
    };

    const { data } = await axios.post(
      `https://test.theteller.net/v1.1/transaction/process`,
      httpData,
      httpConfig
    );

    switch (data["code"]) {
      case "000":
        return data;
      case "111":
        return data;

      case "101":
        throw Error("Insufficient funds in wallet");

      case "105":
        throw Error("Insufficient funds in wallet");

      case "100":
        throw Error("Transaction not permitted to cardholder");

      case "102":
        throw Error("Number not registered for mobile money");

      case "103":
        throw Error("Wrong PIN or transaction timed out");

      case "104":
        throw Error("Transaction declined or terminated");

      case "107":
        throw Error("USSD is busy, please try again later");

      case "114":
        throw Error("Invalid Voucher code");

      case "200":
        return data["reason"];
      //"reason": "https://test.theteller.net/v1.1/3ds/resource/authentication/000000000000"
      // VBV is an acronym form Verified for Visa, this is a security feature on cards which requires further authorization by card holder when such cards are used for online transaction.
      // If your payment request get a response as shown below,
      // it means the request requires further authorization by card holder.
      // Simply redirect your user to the url specied in the reason field in the response.
      // The URL takes the user to his card issuing bank secure ACS page to complete transaction

      case "600":
        throw Error("Access Denied");

      case "979":
        throw Error("Access Denied. Invalid Credential");

      case "909":
        throw Error("Duplicate Transaction ID. Transaction ID must be unique");

      case "999":
        throw Error("Access Denied. Merchant ID is not set");

      // Payment request sent successfully
      // case "100":
      //   throw Error("Transaction Failed or Declined");
      // case "105":
      //   throw Error(
      //     "Invalid amount or general failure. Try changing transaction id"
      //   );

      default:
        return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
