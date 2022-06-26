import {
  Page,
  Card,
  DataTable,
  SkeletonPage,
  SkeletonBodyText,
  Layout,
  Button,
  Popover,
  ActionList,
  Modal,
  Heading,
  TextContainer,
  Spinner,
} from "@shopify/polaris";
import React, {
  useEffect,
  useState,
  useCallback,
  componentDidUpdate,
} from "react";
//   import fetch from "node-fetch";
import OrderCard from "../components/OrderCard";
import SkippedOrderCard from "../components/SkippedOrderCard";

import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { gql, useMutation } from "@apollo/client";

import { userLoggedInFetch } from "../App";
import { Fullscreen } from "@shopify/app-bridge/actions";

// import  gql  from 'apollo-client';
// import { gql } from 'apollo-boost'

// get skeleton
// send req
// on res, update and use below

// export async function getServerSideProps() {
//   let data;
//   let token = await mongoConnection.GetAdmin();
//   token = token.accessToken;

//   var myHeaders = new Headers();
//   myHeaders.append("X-Shopify-Access-Token", token);
//   myHeaders.append("Content-Type", "application/json");

//   var graphql = JSON.stringify({
//     query: `
//     query GetOrders {
//       orders(first: 3) {
//         edges {
//           node {
//             createdAt
//             tags
//             totalWeight
//             customer {
//               displayName
//               ordersCount
//               addresses {
//                 zip
//               }
//             }
//             lineItems(first: 10) {
//               edges {
//                 node {
//                   image {
//                     src
//                   }
//                   name
//                   quantity
//                 }
//               }
//             }
//             id
//           }
//         }
//       }
//     }
//     `,
//     variables: {}
//   })
//   var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: graphql,
//     redirect: 'follow'
//   };

//   await fetch(`https://${process.env.SHOP}/admin/api/2021-07/graphql.json`, requestOptions)
//     .then(response => response.text())
//     .then(result => {
//       console.log('result:', result);
//       data = result;
//     })
//     .catch(error => console.log('error', error));

//     // data = JSON.stringify(data);
//     return {props: {orders:data}}

// }

const HomePage = ({ orders }) => {
  const app = useAppBridge();
  const fullscreen = Fullscreen.create(app);

  const [isFullscreen, setFullscreen] = useState(true);

  const switchFullscreen = () => {
    isFullscreen
      ? fullscreen.dispatch(Fullscreen.Action.ENTER)
      : fullscreen.dispatch(Fullscreen.Action.EXIT);
    isFullscreen ? setFullscreen(false) : setFullscreen(true);
  };

  const fetch = userLoggedInFetch(app);

  async function fetchData() {
    // isMounted = true;
    await fetch("/server_side?data=orders")
      .then(async (data) => {
        const parsedData = await data.json();
        // setAdmin_data(parsedData);
        console.log(parsedData);

        let workersArray = [];
        parsedData.forEach((list) =>
          workersArray.push({
            content: list.worker,
            onAction: () => switchWorker(list.worker, parsedData),
          })
        );
        setAllWorkersInputs(workersArray);

        listName === "" ? setListName(parsedData[0].worker) : "";
        let tempName = listName === "" ? parsedData[0].worker : listName;

        let noOrders =
          parsedData.filter((orderList) => orderList.worker === tempName)[0]
            .orders[0] !== undefined
            ? false
            : true;
        // console.log('listName:',listName);
        // setCurrentOrders(parsedData.orderLists.filter(orderList => orderList.worker === listName)[0]);
        setCurrentOrders(
          parsedData.filter((orderList) => orderList.worker === tempName)[0]
        );

        // console.log(
        //   "currentShelf:",
        //   parsedData.filter((orderList) => orderList.worker === tempName)[0]
        //     .orders[0].lineItems[0][0].sku
        // );

        // let theChecked = await JSON.parse(localStorage.getItem(`${tempName}Checked`));

        // setNinteyNine(false);
        // !noOrders ? parsedData
        //   .filter((orderList) => orderList.worker === tempName)[0]
        //   .orders[0].lineItems.forEach((shelf) => {
        //     shelf.forEach((product) => {
        //       if (product.sku === "99" || product.sku === "98")
        //         setNinteyNine(true);
        //     });
        //   }) : '';

        let allInputs = [...document.querySelectorAll(".currentShelfInput")];
        allInputs.forEach((theInput) => (theInput.checked = false));
        return data;
      })
      .catch((err) => console.log("error /server_side", err));
    console.log("listName:", listName);
    console.log("currentOrders:", currentOrders);
    // isMounted = false;
    // setNinteyNine(false);
    setLoading(false);
  }

  // const [loading, setLoading] = useState(true);

  // let client;
  // const tokenFromDb = mongoConnection.GetAdmin()
  //   .then(data => {
  //     client = createClient(process.env.SHOP, data.accessToken);
  //   })
  //   .catch(err => {
  //     console.log('error:', console.log(err));
  //   })

  // const client = createClient(process.env.SHOP, process.env.SHOPIFY_ACCESS_TOKEN);

  // console.log('client:', client)
  // const GET_ORDER_DATA = gql`
  //   query GetOrders {
  //     orders {
  //       name
  //       edges {
  //         node {
  //           id
  //         }
  //       }
  //     }
  //   }
  // `;
  // let data;
  // // const { loading, error, data } = useQuery(GET_ORDER_DATA);
  // client.query({
  //   query: gql`
  //     query GetOrders {
  //       orders {
  //         name
  //         edges {
  //           node {
  //             id
  //           }
  //         }
  //       }
  //     }
  //   `
  // })
  //   .then(res => {
  //     console.log('res:', res);
  //     data = res;
  //     setLoading(false);
  //   })
  //   .catch(err => console.log('error:', err));

  // if (error) return `Error! ${error.message}`;

  const [listName, setListName] = useState("");
  const [theOrder, setTheOrder] = useState("");
  const [theProduct, setTheProduct] = useState("");
  const [admin_data, setAdmin_data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allWorkersInputs, setAllWorkersInputs] = useState(null);
  const [currentOrders, setCurrentOrders] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [ninetyNine, setNinteyNine] = useState(false);
  const [manyTwos, setManyTwos] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderNum, setOrderNum] = useState(null);
  const [skippedOrders, setSkippedOrders] = useState(null);

  // const getChecked = async () => await JSON.parse(localStorage.getItem(`${listName}Checked`));

  let rows = [];

  // Start Current List Logic
  const [activeList, setActiveList] = useState(false);
  const toggleActiveList = useCallback(() => {
    setActiveList((active) => !active);
  }, []);

  // onClick Functions For Modal
  const handleOpen = useCallback(() => setModalActive(true), []);
  const handleClose = useCallback(() => {
    setModalActive(false);
    setModalError(false);
    setModalLoading(false);
    // document.querySelector('#selectedProduct').checked = false;
    // document.querySelector('#selectedProduct').id = '';
  }, []);

  const switchWorker = async (name, data = null) => {
    // let noOrders = data.filter((orderList) => orderList.worker === name)[0]
    // .orders[0] !== undefined ? false : true;
    setListName(name);
    console.log("name:", name);
    if (name === "Skipped Orders") {
      setCurrentOrders(skippedOrders);
    } else {
      setCurrentOrders(data.filter((list) => name === list.worker)[0]);
    }
    console.log(
      "current orders: ",
      data.filter((list) => name === list.worker)[0]
    );
    // console.log(
    //   "new order shelf:",
    //   data.filter((list) => name === list.worker)[0].orders[0].lineItems[0][0]
    //     .sku
    // );
    // setCurrentOrders(data.orderLists.filter(orderList => orderList.worker === name)[0]);

    let allInputs = [...document.querySelectorAll(".currentShelfInput")];
    allInputs.forEach((theInput) => (theInput.checked = false));
    // let theChecked = await JSON.parse(localStorage.getItem(`${name}Checked`))
    // console.log('theChecked',theChecked)

    // let allInputs = [...(document.querySelectorAll('.currentShelfInput'))];
    // console.log(allInputs);
    // for(let i=0; i < allInputs.length; i++)
    // {
    //   let theInput = allInputs[i];
    //   if (theChecked!==null && theChecked.includes(theInput.getAttribute('productId'))){
    //     theInput.checked = true;
    //   }
    //   else {
    //     theInput.checked = false;
    //   }
    // }
  };
  // const selectProduct = (e) => {
  //   handleOpen();
  //   let orderId = e.target.getAttribute('orderid');
  //   let productId = e.target.getAttribute('productId');
  //   let aOrder = currentOrders.orders.filter((order) => order.id === orderId)[0];
  //   let aProduct = aOrder.lineItems.filter((product) => product.id === productId)[0];
  //   setTheOrder(aOrder);
  //   setTheProduct(aProduct);
  //   e.target.id = "selectedProduct";
  //   setCurrentProduct(aProduct);
  // }

  // const checkShelf = (e) => {
  //   handleOpen();
  // }

  // const removeOrders = async () => {
  //   setModalLoading(true);
  //   const removed = await fetch('/server_side', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: JSON.stringify({worker: currentOrders.worker, orderId: theOrder.id, productId: theProduct.id, type:'remove product'}) // body data type must match "Content-Type" header
  //   })
  //     .then(async (data) => {
  //       // data = await data.text();
  //       return data;
  //     })
  //     .catch(err => console.log('err1:', err));
  //   setModalLoading(false);
  //   if(removed){
  //     slideOffProduct(theProduct.id);
  //     handleClose();
  //   }
  //   else{
  //     setModalError(true);
  //   }
  // }
  const removeOrders = async () => {
    setModalLoading(true);
    let databaseOnly = ["Sku 1", "Sku 2"].includes(listName) ? true : false;
    let noCharge =
      listName === ["Sku 1", "Sku 2"].includes(listName) ? true : false;
    if (orderInfo[0].app.name !== "Online Store") noCharge = true;

    // if subscription, noCharge=true

    console.log("skipped stuff:", orderInfo[1]);
    const removed = await fetch("/server_side", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        // orderId: orderInfo[0].id,
        order: orderInfo[0],
        worker: listName,
        skippedProducts: orderInfo[1],
        removedProducts: orderInfo[2],
        fulfilledWeights: orderInfo[3],
        type: "remove products",
        databaseOnly,
        noCharge,
      }),
    })
      .then(async (data) => {
        // data = await data.text();
        console.log("data from removing products:", data);
        let allInputs = [...document.querySelectorAll(".currentShelfInput")];
        allInputs.forEach((theInput) => (theInput.checked = false));
        return data;
      })
      .catch((err) => console.log("err1:", err));
    if (removed) {
      // localStorage.setItem(`${listName}Checked`, JSON.stringify([]));
      // slideOffProduct(parseInt(currentShelf));
      // await fetchData();
      console.log("orderNum", orderNum);
      document.querySelector(`#order${orderNum}`).remove();
      setModalLoading(false);
      handleClose();
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
      let allInputs = [...document.querySelectorAll(".currentShelfInput")];
      allInputs.forEach((theInput) => (theInput.checked = false));
    } else {
      setModalLoading(false);
      setModalError(true);
    }
  };

  // const slideOffProduct = (currentShelf) => {
  //   // let elm = document.querySelector(`[productId="${productId}"]`);
  //   // console.log("elm", elm);
  //   // while (!elm.classList.contains('productRow')) {
  //   //   elm = elm.parentElement;
  //   // }
  //   // elm.style.display = 'none';
  // }
  // const handleImportedAction = useCallback(
  //   () => console.log('Imported action'),
  //   [],
  // );
  // const handleExportedAction = useCallback(
  //   () => console.log('Exported action'),
  //   [],
  // );
  const activator = (
    <Button onClick={toggleActiveList} disclosure>
      Switch Lists
    </Button>
  );
  // End Current List Logic

  // useEffect(() => {
  //   fetch('/get_orders')
  //     .then(async res => {
  //       console.log('data brfore', res)
  //       let data = await res.json();
  //       console.log('data', data)
  //       data.forEach(order => {
  //         rows.push(Object.values(order));
  //       });
  //     })
  //     .catch(err => console.log('error getting order data:', err))

  //   // put order images into array, hard coded rn
  //   let pictures = ["<img href='https://images.theconversation.com/files/401955/original/file-20210520-23-83r6ds.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop'></img>"]

  //   // add images to rows
  //   document.querySelectorAll(".Polaris-DataTable__TableRow").forEach((row, i) => {
  //     row.firstChild.innerHTML = pictures[i];
  //     row.firstChild.firstChild.style = "width:100px;height:100px;"
  //   })

  //   // add any info to the rows that I need to remove products from db

  //   // append checkboxes
  //   document.querySelectorAll(".Polaris-DataTable__TableRow").forEach((row, i) => {
  //     // <div>
  //     //   <input type="checkbox" class="product_checkbox" name="product_checkbox" id="product_checkbox"></input>
  //     //   <label for="product_checkbox"></label>
  //     // </div>
  //     row.lastChild.innerHTML = `
  //     <div>
  //       <input type="checkbox" class="product_checkbox"></input>
  //     </div>
  //     `;
  //   })

  //   // cycle through check boxes and add event listener

  //   setLoading(false);
  //   // getting orders

  //   console.log('rows:', rows);
  // })

  useEffect(() => {
    fetchData();
  }, []);

  // loading skeleton page
  if (currentOrders === null)
    return (
      <SkeletonPage title="Orders" primaryAction secondaryActions={2}>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText lines={3} />
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );

  if (currentOrders.orders.length < 1)
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ margin: "10px 0 0 20px" }}>
            <Button href="/order_admin" onClick={() => switchPage("admin")}>
              Admin
            </Button>
          </div>
          <div style={{ margin: "10px 20px 0 0" }}>
            <Button primary href="/order_admin" onClick={switchFullscreen}>
              {isFullscreen ? "Fullscreen" : "Exit Fullscreen"}
            </Button>
          </div>
        </div>

        <div>
          <Page>
            <div style={{ display: "flex" }}>
              <h1
                className="anH1"
                style={{ display: "inline-block", paddingLeft: "10px" }}
              >{`${listName}'s List`}</h1>
              <div style={{ display: "inline-block", margin: "0 0 10px 15px" }}>
                <Popover
                  active={activeList}
                  activator={activator}
                  onClose={toggleActiveList}
                >
                  <ActionList
                    items={[
                      ...allWorkersInputs,
                      {
                        content: "Skipped Orders",
                        onAction: () => switchWorker("Skipped Orders"),
                      },
                    ]}
                  />
                </Popover>
              </div>
            </div>
            <div>
              <Card>
                <div className="productRow rowBorder">
                  <h1 className="anH1">
                    <strong style={{ textDecoration: "underline" }}>
                      No Orders Left!
                    </strong>
                  </h1>
                </div>
              </Card>
            </div>
          </Page>
        </div>
      </>
    );
  // page loaded after orders are loaded
  return (
    <div className="wrapper">
      {orderInfo !== null ? (
        <Modal
          // activator={activator}
          open={modalActive}
          onClose={handleClose}
          // title={<span>Packed {currentProduct.quantity} of <strong>{currentProduct.name}</strong>?</span>}
          // title={`Done With Shelf ${currentShelf}?`}
          title=" "
          // primaryAction={{
          //   content: "Yes!",
          //   onAction: removeOrders,
          // }}
          // secondaryActions={[
          //   {
          //     content: "Not Yet",
          //     onAction: handleClose,
          //   },
          // ]}
        >
          <Modal.Section>
            {modalLoading ? (
              <div style={{ width: "max-content", margin: "auto" }}>
                <Spinner />
              </div>
            ) : modalError ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <h1 className="anH1">
                  <strong
                    style={{ textDecoration: "underline", fontSize: "4rem" }}
                  >
                    Error, try again!
                  </strong>
                </h1>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <h2
                      style={{
                        fontSize: "3rem",
                        fontWeight: "400",
                        lineHeight: "4rem",
                      }}
                    >
                      Finished Order <strong>{orderInfo[0].name}</strong>,
                      <br></br>
                      For Customer:{" "}
                      <strong>{orderInfo[0].shippingAddress.name}</strong>?
                      <div>-</div>
                      {ninetyNine ? (
                        <>
                          (<strong style={{ color: "red" }}>Do Not Seal</strong>{" "}
                          Box!)
                        </>
                      ) : (
                        <>
                          (Place <strong>Receipt</strong> In Box And{" "}
                          <strong>Seal</strong> Box!)
                        </>
                      )}
                      {orderInfo[0].customer.note !== null ? (
                        <>
                          <div>-</div>
                          Customer Note:
                          <p>orderInfo[0].customer.note</p>
                        </>
                      ) : (
                        ""
                      )}
                    </h2>
                    {/* <img width="60%" src={currentProduct.image.src}></img> */}
                    {/* <h1 className="anH1"><strong style={{textDecoration:'underline', fontSize:'4rem'}}>x {currentProduct.quantity}</strong></h1> */}
                    {/* <h1 className="anH1"><strong style={{fontSize:'4rem'}}>Finished Order {currentOrders.orders[0].name}?</strong></h1> */}
                  </div>
                </div>
                <div
                  style={{
                    padding: "20px 10% 20px 20px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ marginRight: "3%" }}>
                    <Button size="large" primary onClick={removeOrders}>
                      Yes!
                    </Button>
                  </span>
                  <Button size="large" onClick={handleClose}>
                    Not Yet
                  </Button>
                </div>
              </>
            )}
          </Modal.Section>
        </Modal>
      ) : (
        ""
      )}

      <div style={{ margin: "10px 0 0 20px" }}>
        <Link href="/order_admin">Admin</Link>
      </div>
      <div>
        <Page>
          <div style={{ display: "flex" }}>
            <h1
              className="anH1"
              style={{ display: "inline-block", paddingLeft: "10px" }}
            >{`${listName}'s List`}</h1>
            <div style={{ display: "inline-block", margin: "0 0 10px 15px" }}>
              <Popover
                active={activeList}
                activator={activator}
                onClose={toggleActiveList}
              >
                <ActionList
                  items={[
                    ...allWorkersInputs,
                    {
                      content: "Skipped Orders",
                      onAction: () => switchWorker("Skipped Orders"),
                    },
                  ]}
                />
              </Popover>
            </div>
          </div>
          {/* <div className="rowOrderBorder">
                <Card> */}
          {listName === "Skipped Orders" ? (
            currentOrders.orders.map((order, i) => (
              <SkippedOrderCard
                order={order}
                openModal={handleOpen}
                setOrderInfo={setOrderInfo}
                t={i}
                setOrderNum={setOrderNum}
                setNinteyNine={setNinteyNine}
                setManyTwos={setManyTwos}
                listName={currentOrders.worker}
              />
            ))
          ) : currentOrders !== undefined &&
            currentOrders !== null &&
            currentOrders.orders[0].lineItems[0].image !== null ? (
            currentOrders.orders.map((order, i) => (
              <OrderCard
                order={order}
                openModal={handleOpen}
                setOrderInfo={setOrderInfo}
                t={i}
                setOrderNum={setOrderNum}
                setNinteyNine={setNinteyNine}
                setManyTwos={setManyTwos}
                listName={currentOrders.worker}
              />
            ))
          ) : (
            <div>
              <Card>
                <div className="productRow rowBorder">
                  <h1 className="anH1">
                    <strong style={{ textDecoration: "underline" }}>
                      No Orders Left!
                    </strong>
                  </h1>
                </div>
              </Card>
            </div>
          )}
          {/* <DataTable
                    columnContentTypes={[
                      'text',
                      'text',
                      'text',
                      'numeric',
                      'numeric',
                    ]}
                    headings={[
                      'Order Number (dynamic)',
                      'Name (dynamic)',
                      '',
                      '',
                      'Date (dynamic)',
                    ]}
                    rows={rows}
                    // totals={['', '', '', 255, '$155,830.00']}
                  /> */}
          {/* </Card>
              </div> */}
        </Page>
      </div>
    </div>
  );
};

export default HomePage;
