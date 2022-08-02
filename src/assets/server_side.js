// import fetch from "node-fetch";
import mongoConnection from "../assets/mongoConnection.js";
import mongoose from "mongoose";
import date from "date-and-time";
import { FulfillAndChargeOrder, LoadOrders } from "../assets/ShopifyGqlReqs.js";
// import { ProductNames, ProductSkus } from "../assets/ProAndSku.js";
import { ProductNames, ProductSkus } from "../assets/proAndSku.js";

export const admin_data = async () => {
  let admin = await mongoConnection.GetAdmin();
  let orders = await mongoConnection.GetOrders();
  let skippedProducts = await mongoConnection.GetSkipped();
  console.log("admin:", admin);
  console.log("orders:", orders);
  console.log("skippedProducts:", skippedProducts);

  return [admin, orders, skippedProducts];
};

export const order_data = async () => {
  let orders = await mongoConnection.GetOrders();
  return orders;
};

export const add_workers = async (names) => {
  const added = await mongoConnection
    .AddWorker(names)
    .then((data) => console.log("added worker:", data))
    .catch((err) => console.log("error adding worker:", err));
  return added;
};

export const remove_workers = async (names) => {
  const removed = await mongoConnection
    .RemoveWorkers(names)
    .then((data) => console.log("removed worker(s):", data))
    .catch((err) => console.log("error removing worker(s):", err));
  return removed;
};

export const remove_products = async (
  order,
  worker,
  skippedProducts,
  removedProducts,
  fulfilledWeights,
  databaseOnly,
  noCharge
) => {
  console.log("skipped product array:", skippedProducts);
  // DONE! if has skipped, then no charge
  // when fufilling order and adding skipped to database, group then into a mini order
  // give full order info to skipped database (account for deleted products, and deleted products off skipped list)
  // full order goes through same filter as orginal, just no skipped products this time
  // skipped has same thing as 0sku
  // remove hard-coded data
  // MAKE SURE we're pushing skipped orders on, not overwriting the whole thing

  // await mongoConnection.RemoveProducts(order.id, worker, skippedProducts)
  // .then((data) => console.log("removed worker(s):", data))
  // .catch((err) => console.log("error removing worker(s):", err));
  let skippedArray = [];
  skippedProducts
    ? skippedProducts.forEach((product) => {
        if (!skippedArray[parseInt(product.sku)])
          skippedArray[parseInt(product.sku)] = [];
        skippedArray[parseInt(product.sku)].push(product);
      })
    : "";
  await mongoConnection
    .RemoveProducts(
      order,
      worker,
      skippedArray,
      removedProducts,
      fulfilledWeights
    )
    .then((data) => console.log("removed worker(s):", data))
    .catch((err) => console.log("error removing worker(s):", err));

  if (databaseOnly) return;

  if (skippedProducts && skippedProducts.length > 0) noCharge = true;

  // const skippedNames = skippedProducts !== null ? skippedProducts.map(pro => pro.name) : false;
  // const removedNames = removedProducts !== null ? removedProducts.map(pro => pro.name): false;
  // const badProducts = skippedNames && removedNames ? [...skippedNames, ...removedNames]:false;
  const badProducts =
    skippedProducts !== null && removedProducts !== null
      ? [...skippedProducts, ...removedProducts]
      : false;

  let totalDiffrence = 0;

  // how are we billing skipped products?

  let orderTotal = parseFloat(
    order.currentTotalPriceSet.presentmentMoney.amount
  );

  console.log("orderTotal:", orderTotal);

  // should filter out removed or skipped prodcuts, and add all others together
  order.lineItems = order.lineItems.map((lineItem, i) => {
    lineItem = lineItem.map((product) => {
      // remove cost of removed and skipped products
      if (
        badProducts &&
        badProducts.filter((curPro) => curPro.name === product.name).length > 0
      ) {
        console.log("discountedTotalSet:", discountedTotalSet);
        console.log(
          "discountedTotalSet.presentmentMoney.amount:",
          discountedTotalSet.presentmentMoney.amount
        );
        totalDiffrence -= parseFloat(
          product.discountedTotalSet.shopMoney.amount
        );
        return;
      }

      let priceByUnit = parseFloat(
        product.discountedUnitPriceSet.shopMoney.amount
      );

      // OLDDDDD

      // // DEBUG BELOW, then figure out why skipped products didn't get added to the skipped obj in mongo
      // // let diffrence = priceByUnit * ((parseFloat(fulfilledWeights[i])-(product.variant.weight*parseFloat(product.quantity)))/product.variant.weight);
      // let diffrence =
      //   priceByUnit *
      //   ((parseFloat(fulfilledWeights[product.name]) -
      //     product.variant.weight * parseFloat(product.quantity)) /
      //     product.variant.weight);

      // // let fulfilledPrice = priceByUnit * (priceByWeight/product.variant.weight);
      // console.log("diffrence:", diffrence);

      // totalDiffrence += diffrence;

      // END OLD

      // NEW
      // DEBUG BELOW, then figure out why skipped products didn't get added to the skipped obj in mongo
      // let diffrence = priceByUnit * ((parseFloat(fulfilledWeights[i])-(product.variant.weight*parseFloat(product.quantity)))/product.variant.weight);

      // let fulfilledPrice = priceByUnit * (priceByWeight/product.variant.weight);
      let diffrence;

      if (fulfilledWeights[product.variant.id]) {
        console.log("name:", product.name);
        let pricePerGram =
          parseFloat(product.discountedUnitPriceSet.shopMoney.amount) /
          parseFloat(
            product.name.match(/([0-9]+g)/)[0].replace(/\(|\)|g/g, "")
          );
        let actualPrice =
          pricePerGram *
          parseFloat(fulfilledWeights[product.variant.id] * 1000);
        diffrence =
          parseFloat(product.discountedTotalSet.shopMoney.amount) - actualPrice;

        totalDiffrence += diffrence;
      }
      // END NEW

      return product;
    });
    if (lineItem.length > 0) return lineItem;
    return;
  });

  let runningTotal = orderTotal - totalDiffrence;

  console.log("runningTotal:", runningTotal);

  // for(let j=0;j<order.lineItems[i].length;j++){

  //   const product = order.lineItems[i];

  //   if(skippedNames.includes(product.name)) continue;

  //   // product.quantity
  //   // priceByUnit
  //   // product.variant.weight
  //   // product.variant.weightUnit

  //   let priceByWeight = fulfilledWeight/product.variant.weight;
  //   let fulfilledPrice = priceByUnit * priceByWeight;

  //   runningTotal += fulfilledPrice;
  // }

  // for(let i=0;i<order.lineItems.length;i++){
  //   for(let j=0;j<order.lineItems[i].length;j++){

  //     const product = order.lineItems[i];

  //     if(skippedNames.includes(product.name)) continue;

  //     // product.quantity
  //     // priceByUnit
  //     // product.variant.weight
  //     // product.variant.weightUnit

  //     let priceByWeight = fulfilledWeight/product.variant.weight;
  //     let fulfilledPrice = priceByUnit * priceByWeight;

  //     runningTotal += fulfilledPrice;
  //   }
  // }

  await FulfillAndChargeOrder(order, runningTotal, noCharge);

  return;
};

// export const new_list = async (names) => {
//   console.log('Names:', names);
//   Date.prototype.addDays = function (days) {
//     var date = new Date(this.valueOf());
//     date.setDate(date.getDate() + days);
//     return date;
//   };

//   const aDate = new Date();

//   let dayAfter = aDate.addDays(1);

//   let tomorrow = dayAfter.toLocaleString(undefined, {
//     timeZone: "Australia/Sydney",
//   });
//  tomorrow = tomorrow.match(/(.*?)(?=,)/)[0].replace(/\//g, "-")

//   let dates = [];

//   tomorrow = tomorrow.replace(/([0-9]*)/g, (theDate) => {
//       if(theDate.length === 1 && theDate !== "") theDate = "0"+theDate;
//       if(theDate!== "")dates.push(theDate);
//       return theDate;
//   })

//   tomorrow = `${dates[1]}-${dates[0]}-${dates[2]}`;
//   // "09/04/2021, 12:00 PM Pacific Standard Time" into -> "04-09-2021"

//   tomorrow = "29-07-2021"; //Hard Code To Test Data

//   console.log('names1:', names)
//   const gotThemOrders = await LoadOrders(tomorrow, names)
//     .then(data => data)
//     .catch(err => console.log('Error!:', err));

//   let sortLater = [];

//   let parsedOrders = gotThemOrders.reduce(function (ordersArray,currentOrder,index) {

//     // if no __parentId then it's parent, otherwise a child
//     if (currentOrder.__parentId === undefined)
//     {
//       // if parent, push to array
//       ordersArray.push(currentOrder);
//       return ordersArray;
//     }
//     else if (ordersArray.length === 0)
//     {
//       currentOrder.id = mongoose.Types.ObjectId();
//       sortLater.push(currentOrder);
//       return ordersArray;
//     }
//     else
//     {
//       currentOrder.id = mongoose.Types.ObjectId();

//       for (let i = ordersArray.length - 1; ; ) {
//         try {
//           if (i === ordersArray.length) i = 0;
//           if (ordersArray[i].id === currentOrder.__parentId) {
//             // if it's the parent
//             // if parent.lineItems === undefined, set it to []
//             if (ordersArray[i].lineItems === undefined)
//               ordersArray[i].lineItems = [];
//             // parent.lineItems.push(child)
//             ordersArray[i].lineItems.push(currentOrder);
//             break;
//           }
//           i++;
//           if (i === ordersArray.length - 1 || ordersArray.length === 1) break;
//         } catch (err) {
//           console.log("error in loop:", err);
//           break;
//         }
//       }
//       // console.log('going?');
//       return ordersArray;
//     }
//   },
//   []);

//   if (sortLater.length > 0){
//     sortLater.forEach((order) => {
//       for (let i = parsedOrders.length - 1; ; ) {
//         try {
//           if (i === parsedOrders.length) i = 0;
//           if (parsedOrders[i].id === order.__parentId)
//           {
//             // if it's the parent
//             // if parent.lineItems === undefined, set it to []
//             if (parsedOrders[i].lineItems === undefined)
//               ordersArray[i].lineItems = [];
//             // parent.lineItems.push(child)
//             // console.log('order in sortlater:', order);
//             parsedOrders[i].lineItems.push(order);
//             break;
//           }
//           i++;
//           if (i === parsedOrders.length - 1 || parsedOrders.length === 1) break;
//         } catch (err) {
//           console.log("error in sort later loop:", err);
//           break;
//         }
//       }
//     });
//   }

// for (let i = 0; i < parsedOrders.length; i++) {
//   for (let j = 0; j < parsedOrders[i].lineItems.length; j++) {
//     for (let k = 0; k < ProductNames.length; k++) {
//       if(parsedOrders[i].lineItems[j].variant === null) continue;
//       if (parsedOrders[i].lineItems[j].variant.id === ProductNames[k]) {
//         parsedOrders[i].lineItems[j].sku = ProductSkus[k];
//         break;
//       }
//     }
//   }
// }

//   // define array for 0sku orders
//   const boxesArray = {Large: [], Medium: [], Small:[], Other:[]};
//   const twoSkuArray = [];
//   const oneSkuArray = [];
//   let totalZero = 0;
//   // for each finalOrders
//   for (let i = 0; i < parsedOrders.length; i++) {
//     let twoSkus = 0;
//     let oneSkus = 0;
//     let hasZeroSku = false;
//     let order = parsedOrders[i];
//     //  check if order has 0sku item, if so, remove whole order and add to 0sku array
//     for (let j = 0; j < order.lineItems.length; j++) {
//       let product = order.lineItems[j];
//       if (product.sku === "0") {
//         hasZeroSku = true;
//         totalZero += 1;
//         let theZeroOrder = parsedOrders.splice(i, 1)[0];
//         i --;
//         for(let k=0; k<theZeroOrder.lineItems.length; k++){
//           let theBox = theZeroOrder.lineItems[k];
//           let boxSize = theBox.name.match(/Large|Medium|Tiny/);
//           boxSize !== null ? boxSize = boxSize[0] : '';
//           if(boxesArray[boxSize]!==undefined){
//             boxesArray[boxSize].push(theZeroOrder);
//             break;
//           }
//           else if(k===theZeroOrder.lineItems.length-1){
//             boxesArray.Other.push(theZeroOrder);
//           }
//         }
//         break;
//       }
//       if (product.sku === "2") twoSkus += 1;
//       if (product.sku === "1") oneSkus += 1;
//     }
//     if(hasZeroSku) continue;
//     let preCheckedOrder = JSON.parse(JSON.stringify(order));
//     if(twoSkus >= 5){
//       let theTwoOrder = JSON.parse(JSON.stringify(order))
//       theTwoOrder.lineItems = theTwoOrder.lineItems.filter(item => item.sku === "2");
//       // let noTwosOrder = JSON.parse(JSON.stringify(order))
//       preCheckedOrder.lineItems = preCheckedOrder.lineItems.map(otherItem => {
//         if(otherItem.sku==="2") otherItem.preCheck = true;
//         return otherItem;
//       });
//       // parsedOrders[i] = noTwosOrder;
//       twoSkuArray.push(theTwoOrder);
//     }
//     if(oneSkus >= 5){
//       let theOneOrder = JSON.parse(JSON.stringify(order))
//       theOneOrder.lineItems = theOneOrder.lineItems.filter(item => item.sku === "1");
//       preCheckedOrder.lineItems = preCheckedOrder.lineItems.map(otherItem => {
//         if(otherItem.sku==="1") otherItem.preCheck = true;
//         return otherItem;
//       });
//       oneSkuArray.push(theOneOrder);
//     }
//     if(oneSkus >= 5 || twoSkus >= 5) parsedOrders[i] = preCheckedOrder;
//   }

//   const zeroSkuArray = [...boxesArray.Large,...boxesArray.Medium,...boxesArray.Small,...boxesArray.Other];
//   //      else, sort order items into shelves and push to the final order array for the worker

//   // adding one by one into each current workers order list
//   let finalOrders = [];
//   names.forEach((name) => finalOrders.push({ worker: name, orders: [] }));

//   // save boolean for if it's first loop
//   let firstLoop = true;
//   // get remainder of dividing by workers and save it
//   let extraOrders = parsedOrders.length % finalOrders.length;
//   // define array where I can store number of orders for each worker
//   const orderNumbers = [];
//   // for number of workers
//   const getOrderNumbers = () => {
//     for (let i = 0; i < finalOrders.length; i++) {
//       //  if this is the first call of the loop, get the result of dividing by workers
//       if (firstLoop === true) {
//         // add number to array
//         orderNumbers.push(Math.floor(parsedOrders.length / finalOrders.length));
//       }
//       // add one to the current array item and -1 from remainder
//       if (extraOrders > 0) orderNumbers[i] = orderNumbers[i] + 1;
//       // remove one from remainder
//       extraOrders--;
//       //  while remainder > 0, reapeat loop
//     }
//     // not first
//     firstLoop = false;
//     if (extraOrders > 0) getOrderNumbers();
//   };
//   getOrderNumbers();

//   for (let i = 0; i < finalOrders.length; i++) {
//     //  push chunk of orders to workers list
//     finalOrders[i].orders.push(...parsedOrders.splice(0, orderNumbers[i]));
//   }
//   // turn 0sku array into obj like workers and add to end of finalOrders array
//   finalOrders.push({ worker: "Sku 2", orders: twoSkuArray });
//   finalOrders.push({ worker: "Sku 1", orders: oneSkuArray });
//   finalOrders.push({ worker: "Sku 0", orders: zeroSkuArray });
//   // parse the prodcuts for each order into shelves
//   for (let i = 0; i < finalOrders.length; i++) {
//     let newOrders = [];
//     let workerList = finalOrders[i];
//     for (let j = 0; j < workerList.orders.length; j++) {
//       let anotherOrder = workerList.orders[j];
//       let shelves = [];
//       let boxes = [];
//       let noSkus = [];
//       for (let k = 0; k < anotherOrder.lineItems.length; k++) {
//         let product = anotherOrder.lineItems[k];
//         if (product === undefined) continue;
//         if (product.sku === "" ||product.sku === null || product.sku === undefined)
//         {
//           product.sku = null;
//           noSkus.push(product);
//           continue;
//         } else if (product.sku === "99")
//         {
//           anotherOrder.packingNote = "Do Not Seal Box!";
//         } else if (product.sku === "0")
//         {
//           boxes.push(product);
//         }
//         for (let l = 0; l < parseInt(product.sku); l++) {
//           if (shelves[l] === undefined) shelves[l] = [];
//         }
//         if (shelves[parseInt(product.sku) - 1] === undefined) continue;
//         shelves[parseInt(product.sku) - 1].push(product);
//       }
//       shelves = shelves.filter((shelf) => shelf.length > 0);
//       if (boxes.length > 0) shelves.unshift(boxes);
//       if (noSkus.length > 0) shelves.push(noSkus);
//       anotherOrder.lineItems = shelves;
//       newOrders.push(anotherOrder);
//       // console.log("another order:", anotherOrder);
//     }
//     finalOrders[i].orders = newOrders;
//   }

//   await mongoConnection.removeSkipped()
//     .then((res) => console.log("res:", res))
//     .catch((err) => console.log("error:", err));

//   // adding the whole orders object to mongo
//   const finalRes = await mongoConnection
//     .NewOrderLists(finalOrders)
//     .then((res) => console.log("res:", res))
//     .catch((err) => console.log("error:", err));

//   return finalRes;

// };

export const new_list = async (names, tags, dates) => {
  // GET TOMORROWS DATE, IN FORMAT
  // const formatToday = () => {
  //   Date.prototype.addDays = function (days) {
  //     var date = new Date(this.valueOf());
  //     date.setDate(date.getDate() + days);
  //     return date;
  //   };
  //   const aDate = new Date();
  //   // let dayAfter = aDate.addDays(1);
  //   // let tomorrow = dayAfter.toLocaleString(undefined, {
  //   //   timeZone: "Australia/Sydney",
  //   // });
  //   let today = aDate.toLocaleString(undefined, {
  //     timeZone: "Australia/Sydney",
  //   });
  //   today = today.match(/(.*?)(?=,)/)[0].replace(/\//g, "-");
  //   let dates = [];
  //   today = today.replace(/([0-9]*)/g, (theDate) => {
  //     if (theDate.length === 1 && theDate !== "") theDate = "0" + theDate;
  //     if (theDate !== "") dates.push(theDate);
  //     return theDate;
  //   });
  //   today = `${dates[1]}-${dates[0]}-${dates[2]}`;
  //   // today = "29-07-2021"; //Hard Code To Test Data
  //   return today;
  // };

  // const today = formatToday();
  // const tomorrow = "08-10-2021";

  const gotThemOrders = await LoadOrders(names, dates, tags)
    .then((data) => data)
    .catch((err) => console.log("Error!:", err));

  // array to catch any jsonl data that comes before it's parent data
  // let sortLater = [];
  if (!gotThemOrders) return false;
  // Function to put data to it's parent data and create new array of parsed orders
  let parsedOrders = gotThemOrders.reduce((sortedArray, currentData) => {
    // if it's a parent, push to new sorted array
    if (currentData.__parentId === undefined) {
      sortedArray.push(currentData);
      return sortedArray;
    }
    // if it's child data and there's no other data (parent data) in the sorted array, add to sort later
    // else if (sortedArray === undefined || sortedArray.length === 0) {
    //   currentData.id = mongoose.Types.ObjectId();
    //   sortLater.push(currentData);
    //   return sortedArray;
    // }
    // if it's child data, match it and add it to it's parent
    else {
      let lineItem = false;
      if (currentData.id === undefined) {
        currentData.id = mongoose.Types.ObjectId(); // give it a unique ID
        lineItem = true;
      }

      sortedArray = sortedArray.map((possibleParent) => {
        if (possibleParent.id === currentData.__parentId) {
          if (possibleParent.lineItems === undefined)
            possibleParent.lineItems = [];
          if (possibleParent.fulfillments === undefined)
            possibleParent.fulfillments = [];
          lineItem
            ? possibleParent.lineItems.push(currentData)
            : possibleParent.fulfillments.push(currentData);
          return possibleParent;
        }
        return possibleParent;
      });

      // - - - - - - -
      // currentData.id = mongoose.Types.ObjectId(); // give it a unique ID
      // for (let i = sortedArray.length - 1; ; ) {
      //   try {
      //     if (i === sortedArray.length) i = 0;
      //     if (sortedArray[i].id === currentData.__parentId) {
      //       // if it's the parent
      //       // if parent.lineItems === undefined, set it to []
      //       if (sortedArray[i].lineItems === undefined)
      //         sortedArray[i].lineItems = [];
      //       // parent.lineItems.push(child)
      //       sortedArray[i].lineItems.push(currentData);
      //       break;
      //     }
      //     i++;
      //     if (i === sortedArray.length - 1 || sortedArray.length === 1) break;
      //   } catch (err) {
      //     console.log("error in loop:", err);
      //     break;
      //   }
      // }
      // // console.log('going?');
      return sortedArray;
    }
  }, []);

  // same thing, but for sort later
  // sortLater = sortLater.reduce((sortedArray,currentData) => {

  //     // if it's a parent, push to new sorted array
  //     if (currentData.__parentId === undefined) {
  //       sortedArray.push(currentData);
  //       return sortedArray;
  //     }
  //     // if it's child data and there's no other data (parent data) in the sorted array, add to sort later
  //     else if (sortedArray === undefined || sortedArray.length === 0) {
  //       currentData.id = mongoose.Types.ObjectId();
  //       sortLater.push(currentData);
  //       return sortedArray;
  //     }
  //     // if it's child data, match it and add it to it's parent
  //     else {

  //       currentData.id = mongoose.Types.ObjectId(); // give it a unique ID

  //       sortedArray = sortedArray.map((possibleParent) => {
  //           if (possibleParent.id === currentData.__parentId){
  //               if (possibleParent.lineItems === undefined) possibleParent.lineItems = [];
  //               possibleParent.lineItems.push(currentData);
  //               return possibleParent;
  //           }
  //           return possibleParent;
  //       })

  //       // - - - - - - -
  //       // currentData.id = mongoose.Types.ObjectId(); // give it a unique ID
  //       // for (let i = sortedArray.length - 1; ; ) {
  //       //   try {
  //       //     if (i === sortedArray.length) i = 0;
  //       //     if (sortedArray[i].id === currentData.__parentId) {
  //       //       // if it's the parent
  //       //       // if parent.lineItems === undefined, set it to []
  //       //       if (sortedArray[i].lineItems === undefined)
  //       //         sortedArray[i].lineItems = [];
  //       //       // parent.lineItems.push(child)
  //       //       sortedArray[i].lineItems.push(currentData);
  //       //       break;
  //       //     }
  //       //     i++;
  //       //     if (i === sortedArray.length - 1 || sortedArray.length === 1) break;
  //       //   } catch (err) {
  //       //     console.log("error in loop:", err);
  //       //     break;
  //       //   }
  //       // }
  //       // // console.log('going?');
  //       return sortedArray;
  //     }
  //   },
  //   []);

  // sortLater = sortLater.map((currentData) => {
  //     if (possibleParent.id === currentData.__parentId){
  //         if (possibleParent.lineItems === undefined) possibleParent.lineItems = [];
  //         sortLater[i].lineItems.push(currentData);
  //         return possibleParent;
  //     }
  //     return possibleParent;
  // })

  // ------------
  // if (sortLater.length > 0){
  //   sortLater.forEach((order) => {
  //     for (let i = parsedOrders.length - 1; ; ) {
  //       try {
  //         if (i === parsedOrders.length) i = 0;
  //         if (parsedOrders[i].id === order.__parentId)
  //         {
  //           // if it's the parent
  //           // if parent.lineItems === undefined, set it to []
  //           if (parsedOrders[i].lineItems === undefined)
  //             sortedArray[i].lineItems = [];
  //           // parent.lineItems.push(child)
  //           // console.log('order in sortlater:', order);
  //           parsedOrders[i].lineItems.push(order);
  //           break;
  //         }
  //         i++;
  //         if (i === parsedOrders.length - 1 || parsedOrders.length === 1) break;
  //       } catch (err) {
  //         console.log("error in sort later loop:", err);
  //         break;
  //       }
  //     }
  //   });
  // }

  // hard coding SKUS to products
  for (let i = 0; i < parsedOrders.length; i++) {
    for (let j = 0; j < parsedOrders[i].lineItems.length; j++) {
      for (let k = 0; k < ProductNames.length; k++) {
        if (parsedOrders[i].lineItems[j].variant === null) continue;
        // console.log(parsedOrders[0])
        if (parsedOrders[i].lineItems[j].variant.id === ProductNames[k]) {
          parsedOrders[i].lineItems[j].sku = ProductSkus[k];
          break;
        }
      }
    }
  }
  // hard coding SKUS to products, but for the sort later array
  // if(sortLater.length>0){
  //     for (let i = 0; i < parsedOrders.length; i++) {
  //         for (let j = 0; j < parsedOrders[i].lineItems.length; j++) {
  //             for (let k = 0; k < ProductNames.length; k++) {
  //             if(parsedOrders[i].lineItems[j].variant === null) continue;
  //             if (parsedOrders[i].lineItems[j].variant.id === ProductNames[k]) {
  //                 parsedOrders[i].lineItems[j].sku = ProductSkus[k];
  //                 break;
  //             }
  //             }
  //         }
  //     }
  // }

  // define array for 0sku orders
  const boxesArray = { Large: [], Medium: [], Small: [], Other: [] };
  const twoSkuArray = [];
  const oneSkuArray = [];
  // for each finalOrders
  for (let i = 0; i < parsedOrders.length; i++) {
    let twoSkus = 0;
    let oneSkus = 0;
    let hasZeroSku = false;
    let order = parsedOrders[i];
    //  check if order has 0sku item, if so, remove whole order and add to 0sku array
    for (let j = 0; j < order.lineItems.length; j++) {
      let product = order.lineItems[j];
      if (product.sku === "0") {
        hasZeroSku = true;
        let theZeroOrder = parsedOrders.splice(i, 1)[0];
        i--;
        for (let k = 0; k < theZeroOrder.lineItems.length; k++) {
          let theBox = theZeroOrder.lineItems[k];
          let boxSize = theBox.name.match(/Large|Medium|Tiny/);
          boxSize !== null ? (boxSize = boxSize[0]) : "";
          if (boxesArray[boxSize] !== undefined) {
            boxesArray[boxSize].push(theZeroOrder);
            break;
          } else if (k === theZeroOrder.lineItems.length - 1) {
            boxesArray.Other.push(theZeroOrder);
          }
        }
        break;
      }
      if (product.sku === "2") twoSkus += 1;
      if (product.sku === "1") oneSkus += 1;
    }
    if (hasZeroSku) continue;
    let preCheckedOrder = JSON.parse(JSON.stringify(order));
    if (twoSkus >= 5) {
      let theTwoOrder = JSON.parse(JSON.stringify(order));
      theTwoOrder.lineItems = theTwoOrder.lineItems.filter(
        (item) => item.sku === "2"
      );
      preCheckedOrder.lineItems = preCheckedOrder.lineItems.map((otherItem) => {
        if (otherItem.sku === "2") otherItem.preCheck = true;
        return otherItem;
      });
      twoSkuArray.push(theTwoOrder);
    }
    if (oneSkus >= 5) {
      let theOneOrder = JSON.parse(JSON.stringify(order));
      theOneOrder.lineItems = theOneOrder.lineItems.filter(
        (item) => item.sku === "1"
      );
      preCheckedOrder.lineItems = preCheckedOrder.lineItems.map((otherItem) => {
        if (otherItem.sku === "1") otherItem.preCheck = true;
        return otherItem;
      });
      oneSkuArray.push(theOneOrder);
    }
    if (oneSkus >= 5 || twoSkus >= 5) parsedOrders[i] = preCheckedOrder;
  }

  const zeroSkuArray = [
    ...boxesArray.Large,
    ...boxesArray.Medium,
    ...boxesArray.Small,
    ...boxesArray.Other,
  ];
  //      else, sort order items into shelves and push to the final order array for the worker

  // adding one by one into each current workers order list
  let finalOrders = [];
  names.forEach((name) => finalOrders.push({ worker: name, orders: [] }));

  // save boolean for if it's first loop
  let firstLoop = true;
  // get remainder of dividing by workers and save it
  let extraOrders = parsedOrders.length % finalOrders.length;
  // define array where I can store number of orders for each worker
  const orderNumbers = [];
  // for number of workers
  const getOrderNumbers = () => {
    for (let i = 0; i < finalOrders.length; i++) {
      //  if this is the first call of the loop, get the result of dividing by workers
      if (firstLoop === true) {
        // add number to array
        orderNumbers.push(Math.floor(parsedOrders.length / finalOrders.length));
      }
      // add one to the current array item and -1 from remainder
      if (extraOrders > 0) orderNumbers[i] = orderNumbers[i] + 1;
      // remove one from remainder
      extraOrders--;
      //  while remainder > 0, reapeat loop
    }
    // not first
    firstLoop = false;
    if (extraOrders > 0) getOrderNumbers();
  };
  getOrderNumbers();

  for (let i = 0; i < finalOrders.length; i++) {
    //  push chunk of orders to workers list
    finalOrders[i].orders.push(...parsedOrders.splice(0, orderNumbers[i]));
  }
  // turn 0sku array into obj like workers and add to end of finalOrders array
  finalOrders.push({ worker: "Sku 2", orders: twoSkuArray });
  finalOrders.push({ worker: "Sku 1", orders: oneSkuArray });
  finalOrders.push({ worker: "Sku 0", orders: zeroSkuArray });
  // parse the prodcuts for each order into shelves
  for (let i = 0; i < finalOrders.length; i++) {
    let newOrders = [];
    let workerList = finalOrders[i];
    for (let j = 0; j < workerList.orders.length; j++) {
      let anotherOrder = workerList.orders[j];
      let shelves = [];
      let boxes = [];
      let noSkus = [];
      for (let k = 0; k < anotherOrder.lineItems.length; k++) {
        let product = anotherOrder.lineItems[k];
        if (product === undefined) continue;
        if (
          product.sku === "" ||
          product.sku === null ||
          product.sku === undefined
        ) {
          product.sku = null;
          noSkus.push(product);
          continue;
        } else if (product.sku === "99") {
          anotherOrder.packingNote = "Do Not Seal Box!";
        } else if (product.sku === "0") {
          boxes.push(product);
        }
        for (let l = 0; l < parseInt(product.sku); l++) {
          if (shelves[l] === undefined) shelves[l] = [];
        }
        if (shelves[parseInt(product.sku) - 1] === undefined) continue;
        shelves[parseInt(product.sku) - 1].push(product);
      }
      shelves = shelves.filter((shelf) => shelf.length > 0);
      if (boxes.length > 0) shelves.unshift(boxes);
      if (noSkus.length > 0) shelves.push(noSkus);
      anotherOrder.lineItems = shelves;
      newOrders.push(anotherOrder);
      // console.log("another order:", anotherOrder);
    }
    finalOrders[i].orders = newOrders;
  }

  await mongoConnection
    .removeSkipped()
    .then((res) => console.log("res:", res))
    .catch((err) => console.log("error:", err));

  // adding the whole orders object to mongo
  const finalRes = await mongoConnection
    .NewOrderLists(finalOrders)
    .then((res) => console.log("res:", res))
    .catch((err) => console.log("error:", err));

  return finalRes;
};
