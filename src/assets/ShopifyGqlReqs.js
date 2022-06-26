import mongoConnection from "../assets/mongoConnection.js";

export const LoadOrders = async (date, names) => {
  console.log("inside the Load ORders Function!");

  const newList = await mongoConnection
    .NewList(names)
    .then((data) => console.log("created new lists:", data))
    .catch((err) => console.log("error creating new lists:", err));

  let adminObj = await mongoConnection.GetAdmin();
  console.log("adminObj:", adminObj);
  console.log("node_env:", process.env.NODE_ENV);
  let token = adminObj.accessToken;

  var myHeaders = new Headers();
  myHeaders.append("X-Shopify-Access-Token", token);
  myHeaders.append("Content-Type", "application/json");

  console.log("date:", date);

  var graphql = JSON.stringify({
    query: `
    mutation {
      bulkOperationRunQuery(
          query:""" 
          {orders(first:10000,  query:"tag:${date} AND fulfillment_status:unfulfilled")  {
            edges {
                node {
                    currentTotalPriceSet{
                        presentmentMoney{
                          amount
                      }
                    }
                    transactions{
                      id
                    }
                    app{
                      name
                    }
                    createdAt
                    tags
                    totalWeight
                    shippingAddress {
                        name
                        address1
                        address2
                        city
                        province
                        zip
                    } 
                    customer {
                    note
                    phone
                    email
                    }
                    lineItems(first: 1000) {
                    edges {
                        node {
                        discountedTotalSet{
                          shopMoney{
                            amount
                          }
                        }
                        image {
                            src
                        }
                        name
                        quantity
                        sku
                        variant {
                            id
                        }
                        discountedUnitPriceSet{
                        shopMoney{
                          amount
                        }
                        }
                        variant{
                            weight
                            weightUnit
                        }
                    }
                    }
                    }
                    name
                    id
                    fulfillmentOrders(first:1){
                      edges{
                        node{
                          id
                        }
                      }
                    }
                }
            }
        }
    }"""
      ) {
      bulkOperation {
          id
          status
      }
      userErrors {
          field
          message
      }
      }
  }`,
    variables: {},
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    redirect: "follow",
  };

  const ordersData = await fetch(
    `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log("result", result))
    .catch((error) => console.log("error", error));

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
    var myHeaders = new Headers();
    myHeaders.append("X-Shopify-Access-Token", token);
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
      query: `
        query {
            currentBulkOperation {
                id
                status
                errorCode
                createdAt
                completedAt
                objectCount
                fileSize
                url
                partialDataUrl
            }
            }
            `,
      variables: {},
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow",
    };

    const theReq = await fetch(
      `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("error", error));

    try {
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

  requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const jsonlRes = await fetch(theUrl, requestOptions)
    .then(async (response) => {
      response = await response.text();
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

  let adminObj = await mongoConnection.GetAdmin();
  let token = adminObj.accessToken;

  var myHeaders = new Headers();
  myHeaders.append("X-Shopify-Access-Token", token);
  myHeaders.append("Content-Type", "application/json");

  var graphql = JSON.stringify({
    query:
      `
      mutation {
        fulfillmentCreateV2(fulfillment: 
        {
            lineItemsByFulfillmentOrder
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
    }
    `
        : ``,
    variables: {},
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    redirect: "follow",
  };

  console.log("graphql");

  const fufilledOrder = await fetch(
    `https://${process.env.SHOP}/admin/api/2021-10/graphql.json`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log("result", result))
    .catch((error) => console.log("error", error));

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
