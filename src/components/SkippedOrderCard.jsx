import { Card, Button } from "@shopify/polaris";
import VisibilitySensorComp from "./VisibilitySensorComp";
import { useState } from "react";
import QuantityInput from "./QuantityInput";

// i with each orderCard

// on check
// check if all inputClass with i are checked
// if all checked, set button to visible

// on button click
// use passed function to set object to have all needed info
// use other passes function to show modal

const OrderCard = ({
  order,
  openModal,
  setOrderInfo,
  t,
  setOrderNum,
  setNinteyNine,
  setManyTwos,
  listName,
}) => {
  if (order === undefined) return "";

  const [shelfFinished, setShelfFinished] = useState(false);
  const [currentShelf, setCurrentShelf] = useState(
    order.skippedProducts[0].sku
  );
  const [shelfIndex, setShelfIndex] = useState(0);

  let hasManyTwos = false;

  //   const checkForNotes = () => {
  //     let hasNine = false;
  //     let hasTwos = false;
  //     order.lineItems.forEach((shelf) => {
  //       shelf.forEach((product) => {
  //         if (product.sku === "99") hasNine = true;
  //         if(product.preCheck === true) hasTwos = true;
  //       });
  //     });
  //     hasNine ? setNinteyNine(true) : setNinteyNine(false);
  //     hasTwos ? setManyTwos(true) : setManyTwos(false);
  //   }

  //   order.lineItems.forEach((shelf) => {
  //     shelf.forEach((product) => {
  //       if(product.preCheck === true) hasManyTwos = true;
  //     });
  //   });

  const finishOrder = () => {
    setOrderNum(t);
    setOrderInfo([
      order.parentOrder,
      [],
      getRemovedProducts(),
      getProductWeights(),
    ]);
    checkForNotes();
    openModal();
  };

  //   const getSkippedProducts = (e) => {
  //     let allInputs = [...document.querySelectorAll(".currentShelfInput"+t)];

  //     let skippedProducts = []

  //     for (let i = 0; i < allInputs.length; i++) {
  //       let theInput = allInputs[i];
  //       if (theInput.classList.contains('skippedProduct')) {
  //         skippedProducts.push({
  //           number: order.name,
  //           name: order.shippingAddress.name,
  //           product: theInput.getAttribute('data-item'),
  //           quantity: theInput.getAttribute('data-qty')
  //         })
  //       }
  //     }

  //     console.log('skipped products:', skippedProducts);

  //     if(skippedProducts.length < 1) return null
  //     return skippedProducts
  //   };

  const getRemovedProducts = (e) => {
    let allInputs = [...document.querySelectorAll(".currentShelfInput" + t)];

    let removedProducts = [];

    for (let i = 0; i < allInputs.length; i++) {
      let theInput = allInputs[i];
      if (theInput.classList.contains("removedProduct")) {
        removedProducts.push({
          number: order.parentOrder.name,
          name: order.parentOrder.shippingAddress.name,
          product: theInput.getAttribute("data-item"),
          quantity: theInput.getAttribute("data-qty"),
        });
      }
    }

    if (removedProducts.length < 1) return null;
    return removedProducts;
  };

  const getProductWeights = (e) => {
    let weightInputs = [
      ...document.querySelectorAll(".currentShelfInput" + t + " .weightInput"),
    ];

    let weights = {};

    for (let i = 0; i < weightInputs.length; i++) {
      //   weights.push(weightInputs[i].value);
      weights[weightInputs[i].getAttribute("data-name")] =
        weightInputs[i].value;
    }

    if (Object.keys(weights).length < 1) return null;
    return weights;
  };

  const checkIfChecked = (e) => {
    let allInputs = [...document.querySelectorAll(".currentShelfInput" + t)];
    let allOtherInputs = [...document.querySelectorAll(".otherShelfInput" + t)];

    // console.log(allInputs);

    let allChecked = true;
    // let checkedIds = [];

    for (let i = 0; i < allInputs.length; i++) {
      let theInput = allInputs[i];
      // console.log(theInput);
      if (!theInput.classList.contains("checkedProduct")) {
        allChecked = false;
        setShelfFinished(false);
        // setShelfFinished(false);
        // return false;
      }
      // else{
      //   // checkedIds.push(theInput.getAttribute("productId"));
      // }
    }
    // localStorage.setItem('blue', 'asdasd')
    // localStorage.setItem(`${listName}Checked`, JSON.stringify(checkedIds));
    // use it on the effect function
    // clear it after shelf too
    // var storedNames = JSON.parse(localStorage.getItem("names"));
    // checkShelf();
    // if(allChecked) setShelfFinished(true);
    if (allChecked) {
      if (allInputs.length === allOtherInputs.length) {
        setShelfFinished(true);
      } else {
        setShelfFinished(false);
      }
      if (order.skippedProducts[shelfIndex + 1] === undefined) return;
      if (order.skippedProducts[shelfIndex + 1].sku === null) return;
      setCurrentShelf(order.skippedProducts[shelfIndex + 1].sku);
      setShelfIndex(shelfIndex + 1);
    }
  };

  return (
    <VisibilitySensorComp>
      <div
        className={"rowOrderBorder"}
        id={"order" + t}
        // t === 0
        //   ? "rowOrderBorder currentShelf"
        //   : "rowOrderBorder otherShelf"
      >
        <Card
          title={
            <h2 className="anH2">
              Order: {order.parentOrder.name}, Customer:{" "}
              {order.parentOrder.shippingAddress.name}
            </h2>
          }
        >
          {order.skippedProducts.map((shelf, j) => (
            <div
              className={
                parseInt(shelf[0].sku) > parseInt(currentShelf) &&
                listName !== "Sku 2"
                  ? "otherShelf"
                  : ""
              }
            >
              <div
                className={
                  parseInt(shelf[0].sku) > parseInt(currentShelf) &&
                  listName !== "Sku 2"
                    ? "blur"
                    : ""
                }
              >
                <div className="headerBorder">
                  <div className="tableHeader">
                    {shelf[0].sku === "0" ? (
                      <h1 className="anH1 shelfName">
                        <strong>BOXES:</strong>
                      </h1>
                    ) : shelf[0].sku === null ? (
                      <h1 className="anH1 shelfName">
                        <strong>EXTRA ITEMS:</strong>
                      </h1>
                    ) : (
                      <h1 className="anH1 shelfName">
                        <strong>SHELF:{shelf[0].sku}</strong>
                      </h1>
                    )}
                  </div>
                  {hasManyTwos === true && j === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        width: "99%",
                        margin: "auto",
                        paddingBottom: "2.5%",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "2.5rem",
                          textDecoration: "underline",
                          textDecorationColor: "red",
                        }}
                      >
                        Pickup Box From Grocery!
                      </strong>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {shelf.map((product) => (
                  <div
                    className={
                      product.preCheck === true
                        ? "productRow rowBorder preCheck"
                        : "productRow rowBorder"
                    }
                  >
                    <div style={{ display: "block" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        {/* <Heading>Customer: {product.customerName}</Heading>
              <Heading>Order Number: {product.orderId}</Heading> */}
                      </div>
                    </div>

                    <div
                      className="anH1 productName"
                      style={{
                        marginBottom: "3%",
                        textAlign: "center",
                      }}
                    >
                      <span>{product.name}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: "row",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "40vw",
                          width: "max-content",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div className="cornerQtyContainer">
                          <span className="cornerQty">{product.quantity}</span>
                        </div>
                        <img
                          src={
                            product.image === null
                              ? "No Image"
                              : product.image.src
                          }
                          key={
                            product.image === null
                              ? "No Image"
                              : product.image.src
                          }
                          className="productImg"
                        ></img>
                      </div>
                      {/* <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <span
                        className="anH1"
                        style={{ marginBottom: "45%" }}
                      >
                        QTY
                      </span>
                      <span
                        className="numContainer"
                        style={{
                          boxShadow: "#e1e1e1 5px 5px 5px",
                          border: "5px solid #71d663",
                        }}
                      >
                        <strong>{product.quantity}</strong>
                      </span>
                    </div> */}
                      <QuantityInput
                        noWeight={product.sku === "98" ? false : true}
                        name={product.name}
                        noSkip={true}
                        qty={product.quantity}
                        weightUnit="KG"
                        item={product.name}
                        preCheck={product.preCheck}
                        classes={
                          // t === 0 &&
                          (parseInt(shelf[0].sku) <= parseInt(currentShelf) &&
                            shelf[0].sku !== null) ||
                          (shelf[0].sku === null &&
                            shelfIndex + 2 >= order.lineItems.length)
                            ? `currentShelfInput${t} otherShelfInput${t}`
                            : t === 0
                            ? `otherShelfInput${t}`
                            : ""
                        }
                        checkIfChecked={checkIfChecked}
                      />
                      {/* <div
                      style={{
                        alignSelf: "center",
                        marginLeft: "2%",
                      }}
                    >
                      <input
                        className={
                          // t === 0 &&
                          ((parseInt(shelf[0].sku) <=
                            parseInt(currentShelf) &&
                            shelf[0].sku !== null) ||
                            (shelf[0].sku === null &&
                              shelfIndex + 2 >=
                                order.lineItems.length))
                            ? `currentShelfInput${t} otherShelfInput${t}`
                            : t=== 0
                            ? `otherShelfInput${t}`
                            : ""
                        }
                        type="checkbox"
                        style={{
                          width: "50px",
                          height: "50px",
                          boxShadow: "#e1e1e1 5px 5px 5px",
                        }}
                        onClick={checkIfChecked}
                        // orderid={product.__parentId}
                        // productid={product.id}
                      ></input>
                    </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div
            style={{
              padding: "3%",
              margin: "auto",
              width: "max-content",
            }}
          >
            <Button
              onClick={finishOrder}
              size="large"
              primary
              disabled={shelfFinished ? false : true}
            >
              Finished Order!
            </Button>
          </div>
        </Card>
      </div>
    </VisibilitySensorComp>
  );
};

export default OrderCard;
