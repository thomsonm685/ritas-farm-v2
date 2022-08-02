import mongoConnection from "../assets/mongoConnection.js";
import axios from "axios";
import { bulkOrders } from "../../server/GQL/mutations.js";

export const LoadOrders = async (names, dates, tags) => {
  console.log("inside the Load ORders Function!");

  const newList = await mongoConnection
    .NewList(names)
    .then((data) => console.log("created new lists:", data))
    .catch((err) => console.log("error creating new lists:", err));

  let adminObj = await mongoConnection.GetAdmin();
  console.log("adminObj:", adminObj);
  console.log("node_env:", process.env.NODE_ENV);
  let token = adminObj.accessToken;

  console.log("dates:", dates);
  console.log("tags:", tags);

  // console.log("date:", date);

  // var graphql = JSON.stringify({
  //   query: `
  //   mutation {
  //     bulkOperationRunQuery(
  //         query:"""
  //         {orders(first:10000,  query:"tag:${date} AND fulfillment_status:unfulfilled")  {
  //           edges {
  //               node {
  //                   currentTotalPriceSet{
  //                       presentmentMoney{
  //                         amount
  //                     }
  //                   }
  //                   transactions{
  //                     id
  //                   }
  //                   app{
  //                     name
  //                   }
  //                   createdAt
  //                   tags
  //                   totalWeight
  //                   shippingAddress {
  //                       name
  //                       address1
  //                       address2
  //                       city
  //                       province
  //                       zip
  //                   }
  //                   customer {
  //                   note
  //                   phone
  //                   email
  //                   }
  //                   lineItems(first: 1000) {
  //                   edges {
  //                       node {
  //                       discountedTotalSet{
  //                         shopMoney{
  //                           amount
  //                         }
  //                       }
  //                       image {
  //                           src
  //                       }
  //                       name
  //                       quantity
  //                       sku
  //                       variant {
  //                           id
  //                       }
  //                       discountedUnitPriceSet{
  //                       shopMoney{
  //                         amount
  //                       }
  //                       }
  //                       variant{
  //                           weight
  //                           weightUnit
  //                       }
  //                   }
  //                   }
  //                   }
  //                   name
  //                   id
  //                   fulfillmentOrders(first:1){
  //                     edges{
  //                       node{
  //                         id
  //                       }
  //                     }
  //                   }
  //               }
  //           }
  //       }
  //   }"""
  //     ) {
  //     bulkOperation {
  //         id
  //         status
  //     }
  //     userErrors {
  //         field
  //         message
  //     }
  //     }
  // }`,
  //   variables: {},
  // });
  // var requestOptions = {
  //   method: "POST",
  //   headers: {
  //     "X-Shopify-Access-Token": token,
  //     "Content-Type": "application/json"
  //   },
  //   body: graphql,
  //   redirect: "follow",
  // };

  // const ordersData = await axios.post(
  //   `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
  //   requestOptions
  // )
  //   .then((response) => response.text())
  //   .then((result) => console.log("result", result))
  //   .catch(({ response }) => {
  //     console.log(response.data);
  //     console.log(response.status);
  //     console.log(response.headers);
  // })
  let allTagsQuery = "";
  [...dates, ...tags].forEach((tag, i) => {
    if (i === 0) allTagsQuery = tag;
    else allTagsQuery += " AND tag:" + tag;
  });

  // await bulkOrders(process.env.SHOP, token, allTagsQuery);

  console.log("allTagsQuery:", allTagsQuery);
  var data = JSON.stringify({
    query:
      '\n    mutation {\n      bulkOperationRunQuery(\n          query:""" \n          {orders(first:10000,  query:"tag:' +
      allTagsQuery +
      ' AND fulfillment_status:unfulfilled")  {\n            edges {\n                node {\n                   currentTotalPriceSet{\n                        presentmentMoney{\n                          amount\n                      }\n                    }\n                    transactions{\n                      id\n                    }\n                    app{\n                      name\n                    }\n                    note\n   createdAt\n                    tags\n                    totalWeight\n                    shippingAddress {\n                        name\n                        address1\n                        address2\n                        city\n                        province\n                        zip\n                    } \n                    customer {\n                    note\n                    phone\n                    email\n                    }\n                    lineItems(first: 1000) {\n                    edges {\n                        node {\n                        discountedTotalSet{\n                          shopMoney{\n                            amount\n                          }\n                        }\n                        image {\n                            src\n                        }\n                        name\n                        quantity\n                        sku\n                        variant {\n                            id\n                        }\n                        discountedUnitPriceSet{\n                        shopMoney{\n                          amount\n                        }\n                        }\n                        variant{\n                            weight\n                            weightUnit\n                        }\n                    }\n                    }\n                    }\n                    name\n                    id\n                    fulfillmentOrders(first:1){\n                      edges{\n                        node{\n                          id\n                        }\n                      }\n                    }\n                }\n            }\n        }\n    }"""\n      ) {\n      bulkOperation {\n          id\n          status\n      }\n      userErrors {\n          field\n          message\n      }\n      }\n  }',
    variables: {},
  });

  var config = {
    method: "post",
    url: "https://ritas-farm-dev.myshopify.com/admin/api/2021-10/graphql.json?Content-Type=application/json",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
      redirect: "follow",
    },
    data: data,
  };

  const ordersData = await axios(config)
    .then(function (response) {
      console.log("RES:", JSON.stringify(response.data));
    })
    .catch(({ response }) => {
      console.log(response.data);
      console.log(response.status);
      console.log(response.headers);
    });

  let timeoutCounter = 0;

  // const cancelAndRestartReq = async (id) => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("X-Shopify-Access-Token", token);
  //   myHeaders.append("Content-Type", "application/json");

  //   var graphql = JSON.stringify({
  //     query:`
  //       mutation {
  //         bulkOperationCancel(id: ${id}) {
  //         bulkOperation {
  //         status
  //         }
  //         userErrors {
  //         field
  //       message
  //         }
  //         }
  //       }
  //     `
  //     })
  //     var requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: graphql,
  //       redirect: "follow",
  //     };
  //     const theReq = await fetch(
  //       `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
  //       requestOptions
  //     )
  //       .then((response) => response.json())
  //       .then((result) => {
  //         return result;
  //       })
  //       .catch((error) => console.log("error", error));

  //     await ordersData();

  //     urlPoll();

  //     console.log(theUrl);

  //   return
  // }

  const urlPoll = async (resolve, reject) => {
    // var myHeaders = new Headers();
    // myHeaders.append("X-Shopify-Access-Token", token);
    // myHeaders.append("Content-Type", "application/json");

    // var graphql = JSON.stringify({
    //   query: `
    //     query {
    //         currentBulkOperation {
    //             id
    //             status
    //             errorCode
    //             createdAt
    //             completedAt
    //             objectCount
    //             fileSize
    //             url
    //             partialDataUrl
    //         }
    //         }
    //         `,
    //   variables: {},
    // });
    // var requestOptions = {
    //   method: "POST",
    //   headers: {
    //     "X-Shopify-Access-Token": token,
    //     "Content-Type": "application/json"
    //   },
    //   body: graphql,
    //   redirect: "follow",
    // };

    var data = JSON.stringify({
      query:
        "\n        query {\n            currentBulkOperation {\n                id\n                status\n                errorCode\n                createdAt\n                completedAt\n                objectCount\n                fileSize\n                url\n                partialDataUrl\n            }\n            }\n            ",
      variables: {},
    });

    var config = {
      method: "post",
      url: "https://ritas-farm-dev.myshopify.com/admin/api/2021-10/graphql.json?Content-Type=application/json",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
        redirect: "follow",
      },
      data: data,
    };

    let theReq = await axios(config)
      .then(function (response) {
        console.log("polling res", JSON.stringify(response.data));
        return response;
      })
      .catch(({ response }) => {
        console.log("error in poll:", response.data);
        console.log(response.status);
        console.log(response.headers);
      });
    // .then((response) => {
    //   console.log(response);
    //   response.json()})
    // .then((result) => {
    //   return result;
    // })
    // .catch((error) => console.log("error", error));

    try {
      console.log("theReq:", theReq);
      theReq = theReq.data;
      console.log("theReq.json:".theReq);
      console.log(
        "theReq.data.currentBulkOperation.status:",
        theReq.data.currentBulkOperation.status
      );
      // if(timeoutCounter >= 60) {
      //   cancelAndRestartReq(theReq.data.currentBulkOperation.id);
      // }
      if (theReq.data.currentBulkOperation.status === "RUNNING") {
        console.log("Running");
        timeoutCounter += 1;
      }
      if (theReq.data.currentBulkOperation.status === "COMPLETED") {
        console.log("DONE!!!!");
        return resolve(theReq.data.currentBulkOperation.url);
      } else {
        setTimeout(urlPoll, 3000, resolve, reject);
      }
    } catch (err) {
      setTimeout(urlPoll, 3000, resolve, reject);
      console.log("error polling:", err);
    }
  };

  const theUrl = await new Promise(urlPoll) // we have the url where the jsonl is
    .then((response) => response)
    .catch((error) => console.log("error", error));

  console.log(theUrl);

  if (theUrl === null) return console.log("No Orders!");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const jsonlRes = await axios
    .get(theUrl, requestOptions)
    .then(async (response) => {
      response = response.data;
      response = `${response}`;
      console.log("response:", response);
      response = `[${response.split(/\n/).join().replace(/,$/g, "")}]`;
      // console.log(response);
      response = await JSON.parse(response);
      console.log("responseafter:", response);

      // response = await response
      //   .replace(/({"createdAt")|({"image")/gm, (match) => `,${match}`)
      //   .replace(/,/, "");
      // response = await JSON.parse(`[${response}]`);
      return response;
    })
    .catch((error) => console.log("error", error));

  return jsonlRes;
};

export const FulfillAndChargeOrder = async (
  order,
  chargeAmount = 0.0,
  noCharge = false
) => {
  console.log("noCharge:", noCharge);

  console.log("in charge and fulfill");

  let adminObj = await mongoConnection.GetAdmin();
  let token = adminObj.accessToken;

  // var myHeaders = new Headers();
  // myHeaders.append("X-Shopify-Access-Token", token);
  // myHeaders.append("Content-Type", "application/json");

  // var graphql = JSON.stringify({
  //   query:
  //     `
  //     mutation {
  //       fulfillmentCreateV2(fulfillment:
  //       {
  //           lineItemsByFulfillmentOrder
  //           {
  //             fulfillmentOrderId:"${order.fulfillments[0].id}"
  //           },
  //           notifyCustomer:true
  //       }
  //       )
  //       {
  //           userErrors {
  //               field
  //               message
  //           }
  //       }
  //     }
  //     ` + !noCharge
  //       ? `
  //     mutation orderCapture {
  //       orderCapture(
  //           input:
  //           {
  //               amount: "${chargeAmount}",
  //               id: "${order.id}",
  //               parentTransactionId: "${
  //                 order.transactions[order.transactions.length - 1].id
  //               }",
  //           }
  //       )
  //       {
  //           userErrors {
  //               field
  //               message
  //           }
  //       }
  //   }
  //   `
  //       : ``,
  //   variables: {},
  // });

  console.log("order.fulfillments[0].id:", order.fulfillments[0].id);

  let graphqlQuery = {
    query:
      ` mutation fulfillmentCreateV2 {
      fulfillmentCreateV2(fulfillment: 
      {
          lineItemsByFulfillmentOrder:
          {
            fulfillmentOrderId:"${order.fulfillments[0].id}"
          },   
          notifyCustomer:true
      }
      ) 
      {
          userErrors {
              field
              message
          }
      }
    }
    ` + !noCharge
        ? `
    mutation orderCapture {
      orderCapture(
          input: 
          {                        
              amount: "${chargeAmount}",                            
              id: "${order.id}",                            
              parentTransactionId: "${
                order.transactions[order.transactions.length - 1].id
              }",                     
          }
      ) 
      {
          userErrors {
              field
              message
          }
      }
  }`
        : "",
    variables: {},
  };

  var requestOptions = {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    // body: graphql,
    redirect: "follow",
  };

  console.log("graphql 1");

  // const fulfilledOrder = await axios.post(
  //   `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
  //   requestOptions
  // )
  //   .then((response) => console.log("result", response.data))
  //   .catch(({ response }) => {
  //     console.log(response.data);
  //     console.log(response.status);
  //     console.log(response.headers);
  //   })
  const chargedOrder = await axios({
    url: `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
    method: "post",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    data: graphqlQuery,
  })
    .then((response) => {
      console.log("result", response.data);
      console.log("fulfilled?:", response.data);
      console.log("errors:", response.data.data.orderCapture.userErrors);
    })
    .catch(({ response }) => {
      console.log(response.data);
      console.log(response.status);
      console.log(response.headers);
    });

  // HERE TO END

  graphqlQuery = {
    query: ` mutation {
        fulfillmentCreateV2(fulfillment: 
        {
            lineItemsByFulfillmentOrder:
            {
              fulfillmentOrderId:"${order.fulfillments[0].id}"
            },   
            notifyCustomer:true
        }
        ) 
        {
            userErrors {
                field
                message
            }
        }
      }
      `,
    variables: {},
  };

  const fufilledOrder = await axios({
    url: `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
    method: "post",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    data: graphqlQuery,
  })
    .then((response) => {
      console.log("fulfillent result", response.data);
    })
    .catch(({ response }) => {
      console.log(response.data);
      console.log(response.status);
      console.log(response.headers);
    });

  return fufilledOrder;
};

// export const FulfillAndChargeOrder = async (orderId, databaseOnly, chargeAmount="0.00", ) => {

// let adminObj = await mongoConnection.GetAdmin();
// let token = adminObj.accessToken;

// if (databaseOnly) return;

// Request To Charge Order
// var myHeaders = new Headers();
// myHeaders.append("X-Shopify-Access-Token", token);
// myHeaders.append("Content-Type", "application/json");

// var graphql = JSON.stringify({
//     query:`
//         mutation orderCapture {
//             orderCapture(
//                 input:
//                 {
//                     "amount": ${chargeAmount},
//                     "id": ${orderId},
//                     "parentTransactionId": "",
//                 }
//             )
//             {
//                 userErrors {
//                     field
//                     message
//                 }
//             }
//         }`
//     })
// var requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: graphql,
//     redirect: "follow",
// };
// const payedOrder = await fetch(`https://${process.env.SHOP}/admin/api/2021-07/graphql.json`, requestOptions)
//     .then((response) => response.text())
//     .then((result) => console.log("payedOrder result:", result))
//     .catch((error) => console.log("payedOrder error:", error));

// Request To Fulfill Order
//     var myHeaders = new Headers();
//     myHeaders.append("X-Shopify-Access-Token", token);
//     myHeaders.append("Content-Type", "application/json");

//     var graphql = JSON.stringify({
//         query: `
//         mutation {
//         fulfillmentCreateV2(fulfillment:
//         {
//             lineItemsByFulfillmentOrder:
//             {
//                 fulfillmentOrderId:${orderId.replace('Order','FulfillmentOrder')}
//             },
//             notifyCustomer:true
//         }
//         )
//         {
//             userErrors {
//                 field
//                 message
//             }
//         }
//         }
//         `,
//         variables: {
//         },
//     });
//     var requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: graphql,
//         redirect: "follow",
//     };

//     const fufilledOrder = await fetch(`https://${process.env.SHOP}/admin/api/2021-07/graphql.json`, requestOptions)
//         .then((response) => response.text())
//         .then((result) => console.log("result", result))
//         .catch((error) => console.log("error", error));

//     return fufilledOrder;
// }
