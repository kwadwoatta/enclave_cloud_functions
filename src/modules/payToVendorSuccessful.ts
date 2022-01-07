import axios from "axios";

async function transferToVendorSuccessful(transactionID: string) {
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

    // switch (data["code"]) {
    //   case "000":
    //     {
    //       console.log(data["status"]);
    //       console.log(data["reason"]);
    //       console.log(data["transaction_id"]);
    //       console.log(data["r_switch"]);
    //       console.log(data["subscriber_number"]);
    //       console.log(data["amount"]);
    //       return true;
    //     }
    //     break;
    //   case "000":
    //     {
    //       console.log(data["status"]);
    //       console.log(data["reason"]);
    //       console.log(data["transaction_id"]);
    //       console.log(data["r_switch"]);
    //       console.log(data["subscriber_number"]);
    //       console.log(data["amount"]);
    //       return true;
    //     }
    //     break;

    //   default:
    //     break;
    // }

    // return data;
  } catch (error) {
    throw error;
  }
}

export default transferToVendorSuccessful;
