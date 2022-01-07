import axios from "axios";

async function payToEnclaveSuccessful(transactionID: string) {
  try {
    const httpConfig = {
      headers: {
        "Content-Type": "application/json",
        "Merchant-Id": "MWFlNGFiMTdmYjcyYzZkMzg1YjU0ZmJlMDZkMmYzNjE=",
        "Cache-Control": "no-cache"
      }
    };

    const { data } = await axios.get(
      `https://test.theteller.net/v1.1/users/transactions/${transactionID}/status`,
      httpConfig
    );

    if (data["code"] === "000") {
      console.log(data["status"]);
      console.log(data["reason"]);
      console.log(data["transaction_id"]);
      console.log(data["r_switch"]);
      console.log(data["subscriber_number"]);
      console.log(data["amount"]);
      return true;
    } else return false;
  } catch (error) {
    throw error;
  }
}

export default payToEnclaveSuccessful;
