import axios from "axios";

async function transferMoneyToVendor(
  bookingFee: string,
  vendorPhoneNumber: string,
  vendorNetwork: string,
  paymentID: string,
  spaceName: string,
  scoutName: string
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
      account_number: vendorPhoneNumber,
      account_issuer: vendorNetwork,
      merchant_id: "TTM-00001229",
      transaction_id: `${paymentID}-transfer-to-vendor`,
      processing_code: "404000",
      amount: bookingFee,
      "r-switch": "FLT",
      desc: `Payment of ${bookingFee} from ${scoutName} to book ${spaceName}. Payment date: ${
        new Date().toISOString
      }. Payment ID: ${paymentID}`,
      pass_code: "Your Pass code"
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
    throw error;
  }
}

export default transferMoneyToVendor;
