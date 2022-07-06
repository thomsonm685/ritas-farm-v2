import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  accessToken: String,
  allWorkers: Array,
  currentWorkers: Array,
  lastUpdated: String,
  ordersLeft: String,
  // orderLists: [
  //     {
  //         worker: String,
  //         orders:[
  //             {
  //                 number: String,
  //                 name: String,
  //                 date: String,
  //                 products: [
  //                     {
  //                         img: String,
  //                         title: String,
  //                         qty: String
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  // ]
});
const orderSchema = new mongoose.Schema({
  worker: String,
  orders: [Object],
});
const skippedProductsSchema = new mongoose.Schema({
  orders: [Object],
});
// THE mongoose MODEL (function so we don't get the  'can't overwrite model' error from mongoose)

function getAdminModel() {
  try {
    mongoose.model(
      process.env.NODE_ENV !== "development" ? "Admin" : "Admin_local"
    ); // it throws an error if the model is still not defined
    return mongoose.model(
      process.env.NODE_ENV !== "development" ? "Admin" : "Admin_local"
    );
  } catch (e) {
    return mongoose.model(
      process.env.NODE_ENV !== "development" ? "Admin" : "Admin_local",
      adminSchema
    );
  }
}
const adminObj = getAdminModel();

function getOrderModel() {
  try {
    mongoose.model(
      process.env.NODE_ENV !== "development" ? "Order" : "Order_local"
    ); // it throws an error if the model is still not defined
    return mongoose.model(
      process.env.NODE_ENV !== "development" ? "Order" : "Order_local"
    );
  } catch (e) {
    return mongoose.model(
      process.env.NODE_ENV !== "development" ? "Order" : "Order_local",
      orderSchema
    );
  }
}
const orderObj = getOrderModel();

function getSkippedProductModel() {
  try {
    mongoose.model(
      process.env.NODE_ENV !== "development"
        ? "Skipped_Product"
        : "Skipped_Product_Local"
    ); // it throws an error if the model is still not defined
    return mongoose.model(
      process.env.NODE_ENV !== "development"
        ? "Skipped_Product"
        : "Skipped_Product_Local"
    );
  } catch (e) {
    return mongoose.model(
      process.env.NODE_ENV !== "development"
        ? "Skipped_Product"
        : "Skipped_Product_Local",
      skippedProductsSchema
    );
  }
}
const skippedProductObj = getSkippedProductModel();

//   const orderSchema = new mongoose.Schema({});
//    // THE mongoose MODEL (function so we don't get the  'can't overwrite model' error from mongoose)
//   function getOrderModel() {
//       try {
//           mongoose.model('Order')  // it throws an error if the model is still not defined
//           return mongoose.model('Order')
//       }
//       catch (e) {
//           return mongoose.model('Order', orderSchema)
//       }
//     }
//   const ordersArray = getOrderModel();

// The Object we're actually exporting and attaching methods to
let mongoConnection = {};

// Method to access token to DB
mongoConnection.AddToken = async (token) => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. (.AddToken)");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error (.AddToken):", err);
    });

  // Checking if store obj already exists (unless this is their first edit, it should)
  // console.log("process.env.NEXT_PUBLIC_SHOP (from addToDB)", process.env.NEXT_PUBLIC_SHOP);
  console.log("adminObj", adminObj);
  console.log("adminObj.find:", await adminObj.findOne({}));
  // let storeEdits = await adminObj.findOne({})
  //     .then(res => {
  //         return res
  //     })
  //     .catch(err => {
  //         return err
  //     })

  // update access token
  console.log("Found Store Data, Updating Token");
  adminObj
    .updateOne(
      { accessToken: { $exists: true } },
      {
        $set: {
          accessToken: token,
        },
      }
    )
    .then(async (res) => {
      console.log("Added To Mongo! Res:", res);
    })
    .catch((err) => {
      console.log("Error Adding To Mongo:", err);
    });
};

mongoConnection.GetAdmin = async () => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. ");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error :", err);
    });

  // Checking if store obj already exists (unless this is their first edit, it should)
  // console.log("process.env.NEXT_PUBLIC_SHOP (from addToDB)", process.env.NEXT_PUBLIC_SHOP);
  console.log("adminObj", adminObj);
  console.log("adminObj.find:", await adminObj.findOne({}));
  // let storeEdits = await adminObj.findOne({})
  //     .then(res => {
  //         return res
  //     })
  //     .catch(err => {
  //         return err
  //     })

  // update access token
  let theAdmin = await adminObj
    .findOne({}, function (err, obj) {
      return obj;
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("Error  in mongoConnection:", err);
      return err;
    });
  return theAdmin;
};

mongoConnection.GetOrders = async () => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. ");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error :", err);
    });

  // Checking if store obj already exists (unless this is their first edit, it should)
  // console.log("process.env.NEXT_PUBLIC_SHOP (from addToDB)", process.env.NEXT_PUBLIC_SHOP);
  console.log("adminObj", adminObj);
  console.log("adminObj.find:", await orderObj.find({}));
  // let storeEdits = await adminObj.findOne({})
  //     .then(res => {
  //         return res
  //     })
  //     .catch(err => {
  //         return err
  //     })

  // update access token
  let theOrders = await orderObj
    .find({}, function (err, obj) {
      return obj;
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("Error  in mongoConnection:", err);
      return err;
    });
  return theOrders;
};

mongoConnection.GetSkipped = async () => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. ");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error :", err);
    });
  // update access token
  let skippedProducts = await skippedProductObj
    .find({}, function (err, obj) {
      return obj;
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("Error  in mongoConnection:", err);
      return err;
    });
  return skippedProducts;
};
// mongoConnection.GetOrders = async () => {

//     // CONNECT TO MONGO
//     mongoose.connect('mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
//     .then( () => {
//         console.log("mongoose -> MongoDB Connection Is Open. ")
//     })
//     .catch((err) => {
//         console.log("mongoose -> MongoDB Connection Error :", err)
//     })

//     // Checking if store obj already exists (unless this is their first edit, it should)
//     // console.log("process.env.NEXT_PUBLIC_SHOP (from addToDB)", process.env.NEXT_PUBLIC_SHOP);
//     console.log("ordersArray", ordersArray);
//     console.log("ordersArray.find:", await ordersArray.find({}))
//     // let storeEdits = await adminObj.findOne({})
//     //     .then(res => {
//     //         return res
//     //     })
//     //     .catch(err => {
//     //         return err
//     //     })

//     // update access token
//     let theOrders = await ordersArray.find({})
//     .then(res => {
//         return res
//     })
//     .catch(err => {
//         console.log("Error  in mongoConnection:", err)
//         return err
//     })

//     if(theOrders.length===undefined) theOrders=[theOrders];

//     return theOrders
// }
mongoConnection.AddWorker = async (name) => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. ");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error :", err);
    });

  adminObj
    .updateOne(
      { accessToken: { $exists: true } },
      { $push: { allWorkers: name } }
    )
    .then(async (res) => {
      console.log("Added To Mongo! Res:", res);
    })
    .catch((err) => {
      console.log("Error Adding To Mongo:", err);
    });
};

mongoConnection.RemoveWorkers = async (names) => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. ");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error :", err);
    });

  adminObj
    .updateOne(
      { accessToken: { $exists: true } },
      { $pullAll: { allWorkers: names } }
    )
    .then(async (res) => {
      console.log("Added To Mongo! Res:", res);
    })
    .catch((err) => {
      console.log("Error Adding To Mongo:", err);
    });
};

mongoConnection.NewList = async (names) => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. ");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error :", err);
    });

  // add date
  let now = new Date();
  // let formatedDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM");'
  let formatedDate = now.toLocaleString(undefined, {
    timeZone: "Australia/Sydney",
  });

  adminObj
    .updateOne(
      { accessToken: { $exists: true } },
      { $set: { lastUpdated: formatedDate } }
    )
    .then(async (res) => {
      console.log("Added Date To Mongo!!! Res:", res);
    })
    .catch((err) => {
      console.log("Error Date Adding To Mongo:", err);
    });

  //update current workers
  adminObj
    .updateOne(
      { accessToken: { $exists: true } },
      { $set: { currentWorkers: names } }
    )
    .then(async (res) => {
      console.log("Added Current Workers To Mongo!!! Res:", res);
    })
    .catch((err) => {
      console.log("Error Adding Current Workers To Mongo:", err);
    });
};

mongoConnection.NewOrderLists = async (orderLists) => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. (new order lists)");
    })
    .catch((err) => {
      console.log(
        "mongoose -> MongoDB Connection Error (new order lists):",
        err
      );
    });

  let mongoRes;

  orderObj
    .deleteMany({})
    .then(async (res) => {
      mongoRes = res;
      console.log("Removed Orders from Mongo! Res:", res);
    })
    .catch((err) => {
      console.log("Error Adding Orders To Mongo:", err);
    });

  orderObj
    .insertMany(orderLists)
    .then(async (res) => {
      mongoRes = res;
      console.log("Added Orders to Mongo! Res:", res);
    })
    .catch((err) => {
      console.log("Error Adding Orders To Mongo:", err);
    });

  let ordersLeft = 0;
  orderLists.forEach((list) => {
    ordersLeft = ordersLeft + list.orders.length;
  });
  adminObj
    .updateOne(
      { accessToken: { $exists: true } },
      { $set: { ordersLeft: ordersLeft } }
    )
    .then(async (res) => {
      console.log("Added orders left To Mongo!!! Res:", res);
    })
    .catch((err) => {
      console.log("Error orders left Adding To Mongo:", err);
    });
  return mongoRes;
  //   adminObj.updateOne(
  //     { accessToken: {$exists: true}},
  //     { $set:{ orderLists: orderLists}})
  //     .then( async res => {
  //       mongoRes = res
  //       console.log("Added Orders to Mongo! Res:", res)
  //     })
  //     .catch( err => {
  //       console.log("Error Adding Orders To Mongo:", err)
  //     })
  //     return mongoRes
};

mongoConnection.RemoveProducts = async (
  order,
  worker,
  skippedProducts,
  removedProducts,
  fulfilledWeights
) => {
  // CONNECT TO MONGO
  mongoose
    .connect(
      "mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("mongoose -> MongoDB Connection Is Open. ");
    })
    .catch((err) => {
      console.log("mongoose -> MongoDB Connection Error :", err);
    });

  // pull in order
  // remove product from order
  // if order.lineItems.length < 1, delete order
  // it's greated than 0, add the order back

  // console.log("adminObj.find:", await adminObj.findOne({}))
  // console.log("orderObj.find:", await orderObj.findOne({worker:worker}))

  let workerOrders = await orderObj
    .findOne({ worker: worker })
    .catch((err) => console.log("error getting orders:", err));
  // let orderList = await orderObj.findOne({worker:worker})
  //     .catch(err => console.log('error getting orders:', err));

  // console.log(orderList);
  // orderList.orders.splice(shelfNumber-1, 1);
  // let orders = orderList.orders;

  // let newOrders = workerOrders.orders.reduce((orders, shelfArray) => {
  //     shelfArray.reduce((orderArray, shelfOrder) => {
  //         if(shelfOrder.id !== orderId) orderArray.push(shelfOrder)
  //         return orderArray;
  //     }, [])
  //     if(shelfArray.length > 0) orders.push(shelfArray);
  //     return orders;
  // }, [])

  let newOrders = workerOrders.orders.filter((anOrder) => {
    // console.log("order.id", order.id, "orderId", orderId);
    if (order.id !== anOrder.id) return anOrder;
  });

  // let orders = orderList.orders.reduce((ordersArray, order) => {
  //     if(order.id === orderId){
  //         order.lineItems = order.lineItems.reduce((productArray, product) => {
  //             let id = JSON.stringify(product.id);
  //             if(id === JSON.stringify(productId)) console.log('A match');
  //             if(id !== JSON.stringify(productId)){
  //                 console.log('not a match');
  //                 productArray.push(product);
  //             }
  //             console.log(`type of ${typeof JSON.stringify(productId)} ${JSON.stringify(productId)} = ${typeof id} ${id} is ${JSON.stringify(productId) === id}`)
  //             return productArray;
  //         }, [])
  //     }
  //     if(order.lineItems.length > 0){
  //         ordersArray.push(order);
  //         return ordersArray;
  //     }
  // if(order.worker===worker){
  //     order.orders = order.orders.map((order)=>{
  //         order.products = order.products.map((product) => {
  //             if(product.id!==productId) return product
  //         })
  //         if(order.products.length > 0) return order
  //     })

  //     return order
  // }
  // else return order
  // }, [])

  let res = await orderObj
    .updateOne({ worker: worker }, { $set: { orders: newOrders } })
    .then((data) => {
      console.log("succesfully deleted products!", data);
      return true;
    })
    .catch((err) => {
      console.log("error deleteing products:", err);
      return false;
    });

  console.log("skipped from mongo connection:", skippedProducts);
  // this is what you got from above:
  // skipped from mongo connection: [
  //   NaN: [
  //     {
  //       number: '#15850',
  //       name: 'Christina Kelman',
  //       product: 'Medium Fruit & Veg',
  //       quantity: '1'
  //     }
  //   ]
  // ]
  // FIX THAT

  // THIS IS WHERE WE ADD INFO FOR SKIPPED PRODUCTS
  if (skippedProducts !== null) {
    await skippedProductObj
      // .updateOne({}, { $push: { orders: { $each: [...skippedProducts] } } })
      .updateOne(
        {},
        {
          $push: {
            orders: {
              parentOrderId: order.id,
              parentOrder: order,
              skippedProducts: [...skippedProducts],
              removedProducts: removedProducts,
              fulfilledWeights: fulfilledWeights,
            },
          },
        }
      )
      .then((data) => {
        console.log("succesfully added skipped products!", data);
        return true;
      })
      .catch((err) => {
        console.log("error adding skipped products:", err);
        return false;
      });
  }

  return res;
  // let orderLists = await orderObj.findOne({worker:worker}).orderLists;
  // orderLists = orderLists.map((workerList) => {
  //     if(workerList.worker===worker){
  //         workerList.orders = workerList.orders.map((order)=>{
  //             order.products = order.products.map((product) => {
  //                 if(product.id!==productId) return product
  //             })
  //             if(order.products.length > 0) return order
  //         })

  //         return workerList
  //     }
  //     else return workerList
  // })

  // were right here adding the functionality to delete a product then the order if there's no more products
  // and debugging all the shit you wrote
  // let orderLists = await adminObj.findOne({}).orderLists;
  // orderLists = orderLists.map((workerList) => {
  //     if(workerList.worker===worker){
  //         workerList.orders = workerList.orders.map((order)=>{
  //             order.products = order.products.map((product) => {
  //                 if(product.id!==productId) return product
  //             })
  //             if(order.products.length > 0) return order
  //         })

  //         return workerList
  //     }
  //     else return workerList
  // })

  // console.log('orderlists filtered:', orderLists);

  // let theList = orderLists.filter((list) => list.worker === worker);
  // let theList.orders.filter((order)=>order.__parentId===orderId);

  // await adminObj.updateOne(
  // { accessToken: {$exists: true}},
  // { $set: { orderLists: orderLists }})

  // await orderObj.updateOne(
  //     { worker: worker},
  //     { $set: { orderLists: orderLists }})

  // { $pullAll: { allWorkers: names } }        )
  //     .then( async res => {
  //         console.log("Added To Mongo! Res:", res)
  //     })
  //     .catch( err => {
  //         console.log("Error Adding To Mongo:", err)
  //     } )
};

mongoConnection.removeSkipped = async () => {
  await skippedProductObj
    .updateOne(
      {},
      {
        $set: {
          orders: [],
        },
      }
    )
    .then(async (res) => {
      console.log("cleared skipped! Res:", res);
    })
    .catch((err) => {
      console.log("Error Clearing Skipped In Mongo:", err);
    });
};

// mongoConnection.RemoveProduct = async (worker, orderId, productId) => {

//     // CONNECT TO MONGO
//     mongoose.connect('mongodb+srv://order_manager:tzGqrqT0NOySMA8e@cluster0.xpee6.mongodb.net/order_manager?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
//     .then( () => {
//         console.log("mongoose -> MongoDB Connection Is Open. ")
//     })
//     .catch((err) => {
//         console.log("mongoose -> MongoDB Connection Error :", err)
//     })

//     // pull in order
//     // remove product from order
//     // if order.lineItems.length < 1, delete order
//     // it's greated than 0, add the order back

//     // console.log("adminObj.find:", await adminObj.findOne({}))
//     // console.log("orderObj.find:", await orderObj.findOne({worker:worker}))

//     let orderList = await orderObj.findOne({worker:worker})
//         .catch(err => console.log('error getting orders:', err));
//     console.log(orderList);
//     let orders = orderList.orders.reduce((ordersArray, order) => {
//         if(order.id === orderId){
//             order.lineItems = order.lineItems.reduce((productArray, product) => {
//                 let id = JSON.stringify(product.id);
//                 if(id === JSON.stringify(productId)) console.log('A match');
//                 if(id !== JSON.stringify(productId)){
//                     console.log('not a match');
//                     productArray.push(product);
//                 }
//                 console.log(`type of ${typeof JSON.stringify(productId)} ${JSON.stringify(productId)} = ${typeof id} ${id} is ${JSON.stringify(productId) === id}`)
//                 return productArray;
//             }, [])
//         }
//         if(order.lineItems.length > 0){
//             ordersArray.push(order);
//             return ordersArray;
//         }
//         // if(order.worker===worker){
//         //     order.orders = order.orders.map((order)=>{
//         //         order.products = order.products.map((product) => {
//         //             if(product.id!==productId) return product
//         //         })
//         //         if(order.products.length > 0) return order
//         //     })

//         //     return order
//         // }
//         // else return order
//     }, [])

//     let res = await orderObj.updateOne(
//         { worker: worker},
//         { $set: { orders: orders }}
//     )
//         .then(data => {
//             console.log('succesfully deleted product!', data);
//             return true;
//         })
//         .catch(err => {
//             console.log('error deleteing product:', err);
//             return false;
//         });

//     return res
//     // let orderLists = await orderObj.findOne({worker:worker}).orderLists;
//     // orderLists = orderLists.map((workerList) => {
//     //     if(workerList.worker===worker){
//     //         workerList.orders = workerList.orders.map((order)=>{
//     //             order.products = order.products.map((product) => {
//     //                 if(product.id!==productId) return product
//     //             })
//     //             if(order.products.length > 0) return order
//     //         })

//     //         return workerList
//     //     }
//     //     else return workerList
//     // })

//     // were right here adding the functionality to delete a product then the order if there's no more products
//     // and debugging all the shit you wrote
//     // let orderLists = await adminObj.findOne({}).orderLists;
//     // orderLists = orderLists.map((workerList) => {
//     //     if(workerList.worker===worker){
//     //         workerList.orders = workerList.orders.map((order)=>{
//     //             order.products = order.products.map((product) => {
//     //                 if(product.id!==productId) return product
//     //             })
//     //             if(order.products.length > 0) return order
//     //         })

//     //         return workerList
//     //     }
//     //     else return workerList
//     // })

//     // console.log('orderlists filtered:', orderLists);

//     // let theList = orderLists.filter((list) => list.worker === worker);
//     // let theList.orders.filter((order)=>order.__parentId===orderId);

//     // await adminObj.updateOne(
//     // { accessToken: {$exists: true}},
//     // { $set: { orderLists: orderLists }})

//     // await orderObj.updateOne(
//     //     { worker: worker},
//     //     { $set: { orderLists: orderLists }})

//     // { $pullAll: { allWorkers: names } }        )
//     //     .then( async res => {
//     //         console.log("Added To Mongo! Res:", res)
//     //     })
//     //     .catch( err => {
//     //         console.log("Error Adding To Mongo:", err)
//     //     } )
// }

export default mongoConnection;
