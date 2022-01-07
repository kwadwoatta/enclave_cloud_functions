import axios from "axios";

async function payMoneyToEnclave(
  totalAmount: string,
  scoutPhoneNumber: string,
  network: string,
  paymentID: string,
  spaceName: string
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
      transaction_id: `${paymentID}-pay-to-enclave`,
      desc: `Paying ${totalAmount} to book ${spaceName}  on ${
        new Date().toISOString
      }. Payment ID: ${paymentID}`,
      merchant_id: "TTM-00001229",
      subscriber_number: scoutPhoneNumber,
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
        throw Error("VBV Required");

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

export default payMoneyToEnclave;
