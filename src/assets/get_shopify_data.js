import createClient from "../server/handlers/client";
import "isomorphic-fetch";
import { gql } from "apollo-boost";

let get_shopify_data = {};
const client = createClient(process.env.SHOP, process.env.SHOPIFY_ACCESS_TOKEN);

function GET_ORDER_DATA(url) {
  // return gql`
  //   mutation {
  //     appPurchaseOneTimeCreate(
  //       name: "test"
  //       price: { amount: 10, currencyCode: USD }
  //       returnUrl: "${url}"
  //       test: true
  //     ) {
  //       userErrors {
  //         field
  //         message
  //       }
  //       confirmationUrl
  //       appPurchaseOneTime {
  //         id
  //       }
  //     }
  //   }
  // `;
}

console.log("client:", client);

// Function to make the graphQL request to shopify for order data
get_shopify_data.get_orders = async () => {
  return { some: "data" };
};

export default get_shopify_data;
