import { Shopify } from "@shopify/shopify-api";
// import dbActions from "../../database/actions.js";

export const bulkOrders = async ({ shop, accessToken, tags }) => {
  const client = new Shopify.Clients.Graphql(shop, accessToken);

  const oneTimeCharge = await client.query({
    data: {
      query: `    
      mutation bulkOperationRunQuery(query    $name: String!,) {
          appPurchaseOneTime {
            createdAt,
            id,
          }
          confirmationUrl
          userErrors {
            field
            message
          }
        }
      `,
      variables: {
        name: "Custom Report",
        price: {
          amount,
          currencyCode: "USD",
        },
        returnUrl: url,
        test: false,
      },
    },
  });

  console.log("oneTimeCharge:", oneTimeCharge);
  console.log(
    "oneTimeCharge:",
    oneTimeCharge.body.data.appPurchaseOneTimeCreate.userErrors
  );

  return oneTimeCharge.body.data.appPurchaseOneTimeCreate.confirmationUrl;
};

// export const createOneTimeCharge = async ({
//   shop,
//   accessToken,
//   amount,
//   url,
// }) => {
//   const client = new Shopify.Clients.Graphql(shop, accessToken);

//   const oneTimeCharge = await client.query({
//     data: {
//       query: `
//       mutation appPurchaseOneTimeCreate($name: String!, $price: MoneyInput!, $returnUrl: URL!, $test: Boolean!) {
//         appPurchaseOneTimeCreate(name: $name, price: $price, returnUrl: $returnUrl, test:$test) {
//           appPurchaseOneTime {
//             createdAt,
//             id,
//           }
//           confirmationUrl
//           userErrors {
//             field
//             message
//           }
//         }
//       }`,
//       variables: {
//         name: "Custom Report",
//         price: {
//           amount,
//           currencyCode: "USD",
//         },
//         returnUrl: url,
//         test: false,
//       },
//     },
//   });

//   console.log("oneTimeCharge:", oneTimeCharge);
//   console.log(
//     "oneTimeCharge:",
//     oneTimeCharge.body.data.appPurchaseOneTimeCreate.userErrors
//   );

//   return oneTimeCharge.body.data.appPurchaseOneTimeCreate.confirmationUrl;
// };

// export const createSubscription = async ({
//   shop,
//   accessToken,
//   url,
//   authAmount,
// }) => {
//   const client = new Shopify.Clients.Graphql(shop, accessToken);

//   // const plans = {
//   //   Basic: {
//   //     price: 100,
//   //     orders: '0-500'
//   //   },
//   //   Standard: {
//   //     price: 175,
//   //     orders: '501-1,500'
//   //   },
//   //   Pro: {
//   //     price: 250,
//   //     orders: '1,501-3.000'
//   //   },
//   //   Premium: {
//   //     price: 352,
//   //     orders: '3,001-4,100'
//   //   },
//   // }

//   // const plan = plans[planName]

//   const subscription = await client.query({
//     data: {
//       query: `
//       mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $test: Boolean!){
//         appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, test: $test) {
//           userErrors {
//             field
//             message
//           }
//           appSubscription {
//             id
//             lineItems {
//               id
//             }
//           }
//           confirmationUrl
//         }
//       }
//       `,
//       variables: {
//         name: "Per-Order Monthly Payment Authorization",
//         returnUrl: url,
//         test: false,
//         lineItems: [
//           {
//             plan: {
//               // appRecurringPricingDetails: {
//               //   price: {
//               //     amount: plan.price,
//               //     currencyCode: "USD",
//               //   },
//               //   interval: "EVERY_30_DAYS",
//               // },
//               appUsagePricingDetails: {
//                 cappedAmount: {
//                   amount: authAmount,
//                   currencyCode: "USD",
//                 },
//                 terms:
//                   "You will be billed at a rate of 8 cents/order, following the run of your monthly report.",
//               },
//             },
//           },
//         ],
//       },
//     },
//   });

//   console.log(
//     "subscriptionCharge:",
//     subscription.body.data.appSubscriptionCreate.appSubscription.lineItems[0]
//   );
//   console.log("subscriptionUrl:", subscription.body.data.appSubscriptionCreate);
//   console.log("subscriptionChargeErrors:", subscription.body.data.errors);

//   return subscription.body.data.appSubscriptionCreate;
// };

// export const createUsageCharge = async ({
//   shop,
//   accessToken,
//   amount,
//   subscriptionId,
// }) => {
//   const client = new Shopify.Clients.Graphql(shop, accessToken);

//   console.log("subscriptionId:", subscriptionId);

//   const usageCharge = await client.query({
//     data: {
//       query: `
//       mutation appUsageRecordCreate($description: String!, $price: MoneyInput!, $subscriptionLineItemId: ID!) {
//         appUsageRecordCreate(description: $description, price: $price, subscriptionLineItemId:$subscriptionLineItemId) {
//           userErrors {
//             field
//             message
//           }
//           appUsageRecord {
//             id
//           }
//         }
//       }`,
//       variables: {
//         subscriptionLineItemId: subscriptionId,
//         description: "Monthly Report",
//         price: {
//           amount,
//           currencyCode: "USD",
//         },
//       },
//     },
//   });

//   console.log("usageCharge:", usageCharge.body.data.appUsageRecordCreate);
//   console.log(
//     "usageCharge ERROR:",
//     usageCharge.body.data.appUsageRecordCreate.userErrors
//   );

//   return usageCharge.body.data.appUsageRecordCreate.userErrors[0]
//     ? "Partial Charge"
//     : "Full Charge";
// };
