import {
  Page,
  ResourceList,
  Modal,
  Tag,
  Avatar,
  DatePicker,
  Stack,
  Card,
  TextContainer,
  SkeletonPage,
  SkeletonBodyText,
  Layout,
  Button,
  Icon,
  Frame,
  Heading,
  OptionList,
  TextField,
  List,
  Toast,
  Spinner,
} from "@shopify/polaris";
import React, { useEffect, useState, useCallback } from "react";
import { AddMajor } from "@shopify/polaris-icons";
import mongoConnection from "../assets/mongoConnection";
import CollapsibleTab from "../components/CollapsibleTab";
import GetCsv from "../components/GetCsv";
import GetLocateCsv from "../components/GetLocateCsv";
import GetSkippedCsv from "../components/GetSkippedCsv";
import GetSku1Csv from "../components/GetSku1Csv";
import GetSku2Csv from "../components/GetSku2Csv";
import { userLoggedInFetch } from "../App";
import { Fullscreen } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";

// get skeleton
// send req
// on res, update and use below

// export async function getServerSideProps() {
//     console.log('HI')
//     let ordersArray = await mongoConnection.GetOrders();
//     console.log('ORDERS:', ordersArray)
//     let admin = await mongoConnection.GetAdmin();
//     admin = JSON.stringify(admin);
//     let ordersLeft = ordersArray.length;

//     // return{props:{admin, ordersLeft}}
//     return {props: {admin:admin, ordersLeft:ordersLeft}}
//   }

const AdminPage = ({ user, switchPage }) => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const [activeToast, setActiveToast] = useState(false);
  const [activeErrorToast, setActiveErrorToast] = useState(false);

  const toggleActiveToast = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );
  const toggleActiveErrorToast = useCallback(
    () => setActiveErrorToast((activeErrorToast) => !activeErrorToast),
    []
  );

  const toastMarkup = activeToast ? (
    <Toast
      content={<Spinner />}
      onDismiss={toggleActiveToast}
      duration={2000000}
    />
  ) : null;

  const errorToastMarkup = activeErrorToast ? (
    <Toast
      content={<Heading>Error, Try Again!</Heading>}
      onDismiss={toggleActiveErrorToast}
      duration={1000000}
    />
  ) : null;

  const [loading, setLoading] = useState(true);
  // const [loadingLists, setLoadingLists] = useState(false);
  const [listName, setListName] = useState("Michael");
  const [admin_data, setAdmin_data] = useState(null);
  const [order_data, setOrder_Data] = useState(null);
  const [skipped_data, setSkipped_Data] = useState(null);
  const [allWorkersInputs, setAllWorkersInputs] = useState(null);
  const [modalActive, setModalActive] = useState(true);
  const [passwordInput, setPasswordInput] = useState("Ritasfarm");
  const password = "Ritasfarm";
  // const [expanded, setExpanded] = useState(false);

  // const openOrders = (e) => {
  //   let contentContainer = e.target;
  //   console.log(contentContainer)
  //   // Polaris-Collapsible--isFullyClosed
  //   // setExpanded(!expanded);
  // }

  // Start Current List Logic
  const [activeList, setActiveList] = useState(false);
  const toggleActiveList = useCallback(
    () => setActiveList((active) => !active),
    []
  );
  const [addingWorkers, setAddingWorkers] = useState([]);
  const [deletingWorkers, setDeletingWorkers] = useState([]);

  const [addWorkerInput, setAddWorkerInput] = useState("Name");
  const handleAddWorker = useCallback((value) => setAddWorkerInput(value), []);

  const handleOpen = useCallback(() => setModalActive(true), []);
  const handleClose = useCallback(() => {
    setModalActive(false);
    setModalError(false);
    setModalLoading(false);
    // document.querySelector('#selectedProduct').checked = false;
    // document.querySelector('#selectedProduct').id = '';
  }, []);

  const handleChange = useCallback(
    (newValue) => setPasswordInput(newValue),
    []
  );

  // CALENDER LOGIC
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  let now = new Date();
  let ausNow = new Date(
    now.toLocaleString(undefined, { timeZone: "Australia/Sydney" })
  );

  const [{ month, year }, setDate] = useState({
    month: ausNow.getMonth(),
    year: ausNow.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(ausNow),
    end: new Date(""),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  const formatDate = (theDate) => {
    theDate = new Date(theDate).toLocaleString();
    theDate = theDate.match(/(.*?)(?=,)/)[0].replace(/\//g, "-");
    let dates = [];
    theDate = theDate.replace(/([0-9]*)/g, (theDate) => {
      if (theDate.length === 1 && theDate !== "") theDate = "0" + theDate;
      if (theDate !== "") dates.push(theDate);
      return theDate;
    });
    theDate = `${dates[1]}-${dates[0]}-${dates[2]}`;
    return theDate;
  };

  const getDateTags = () => {
    const dates = [];

    if (
      !(selectedDates.start instanceof Date && !isNaN(selectedDates.end)) ||
      selectedDates.start === selectedDates.end
    ) {
      console.log("date:", formatDate(new Date(selectedDates.start)));
      dates.push(formatDate(new Date(selectedDates.start)));
      return dates;
    }
    let thisDate = new Date(selectedDates.start);
    let endDate = new Date(selectedDates.end);
    while (thisDate <= endDate) {
      console.log(thisDate);
      dates.push(formatDate(thisDate));
      thisDate = thisDate.addDays(1);
    }
    console.log("dates:", dates);
    return dates;
  };

  // END CALENDER LOGIC

  // TAG INPUT LOGIC
  const [textFieldValue, setTextFieldValue] = useState("");
  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    []
  );

  const addTag = () => {
    console.log("this:", selectedDates);
    getDateTags();
    if (textFieldValue === "" || textFieldValue.match(/ /g)) return;
    setSelectedTags([...selectedTags, textFieldValue]);
    setTextFieldValue("");
  };

  const [selectedTags, setSelectedTags] = useState([]);

  const removeTag = useCallback(
    (tag) => () => {
      setSelectedTags((previousTags) =>
        previousTags.filter((previousTag) => previousTag !== tag)
      );
    },
    []
  );

  const tagMarkup = selectedTags.map((option) => (
    <span style={{ margin: "0 5px" }}>
      <Tag key={option} onRemove={removeTag(option)}>
        {option}
      </Tag>
    </span>
  ));
  // END TAG INPUT LOGIC

  async function fetchAdminData() {
    await fetch("/server_side?data=admin")
      .then(async (data) => {
        const parsedData = await data.json();
        let workersArray = [];
        console.log("parsedDataStuff:", parsedData[2]);
        parsedData[0].allWorkers.forEach((worker) =>
          workersArray.push({ value: worker, label: worker })
        );
        setAllWorkersInputs(workersArray);
        setAdmin_data(parsedData[0]);
        setOrder_Data(parsedData[1]);
        setSkipped_Data(parsedData[2]);
        return data;
      })
      .catch((err) => console.log("error /server_side", err));
    setLoading(false);
  }

  //   async function fetchOrderData() {
  //     // isMounted = true;
  //     await fetch('/server_side?data=orders')
  //         .then(async data => {
  //             const parsedData = await data.json();
  //             setOrder_Data(parsedData);
  //             console.log('order_data:', parsedData);
  //             return parsedData;
  //         })
  //         .catch(err => console.log('error /server_side', err));
  // }

  const newList = async (names) => {
    toggleActiveToast();
    console.log("right before:", getDateTags());
    await fetch("/server_side", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        names,
        type: "new list",
        tags: selectedTags,
        dates: getDateTags(),
      }), // body data type must match "Content-Type" header
    })
      .then(async (res) => {
        // res = await data.text();
        console.log("status:", res.status);
        console.log("that was dataTEXT");
        return res.status;
      })
      .catch((err) => {
        console.log("err1:", err);
        toggleErrorToast();
        return res;
      });
    // await fetchOrderData();
    await fetchAdminData();
    setAddingWorkers([]);
    setDeletingWorkers([]);
    toggleActiveToast();
  };
  const deleteWorkers = async (names) => {
    await fetch("/server_side", {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ names, type: "remove" }), // body data type must match "Content-Type" header
    });
    fetchAdminData();
    setDeletingWorkers([]);
  };
  const addWorkers = async (names) => {
    await fetch("/server_side", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ names, type: "add" }), // body data type must match "Content-Type" header
    });
    fetchAdminData();
    setAddingWorkers([]);
    setAddWorkerInput("");
  };

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

  //   let admin_data;
  // getting all data (orders, admin data)
  useEffect(() => {
    // fetchOrderData();
    console.log("MONTH:", ausNow.getMonth());
    console.log("YEAR:", ausNow.getFullYear());
    fetchAdminData();
  }, []);

  // loading skeleton page
  //   if(loading) return(
  //   <SkeletonPage primaryAction secondaryActions={2}>
  //     <Layout>
  //       <Layout.Section>
  //         <Card title="Current Packers" sectioned>
  //           <SkeletonBodyText lines={3}/>
  //         </Card>
  //         <Card title="Create New Lists" sectioned>
  //           <SkeletonBodyText lines={3}/>
  //         </Card>
  //         <Card title="Add/Remove Packers" sectioned>
  //           <SkeletonBodyText lines={3}/>
  //         </Card>
  //       </Layout.Section>
  //     </Layout>
  //     </SkeletonPage>
  //     )
  if (passwordInput !== password)
    return (
      <Page>
        <Modal
          // activator={activator}
          open={modalActive}
          onClose={handleClose}
          // title={<span>Packed {currentProduct.quantity} of <strong>{currentProduct.name}</strong>?</span>}
          // title={`Done With Shelf ${currentShelf}?`}
          title="Password:"
        >
          <Modal.Section>
            <TextField label="" value={passwordInput} onChange={handleChange} />
          </Modal.Section>
        </Modal>
      </Page>
    );

  // page loaded after orders are loaded
  return (
    <>
      {admin_data === null ? (
        <SkeletonPage primaryAction secondaryActions={2}>
          <Layout>
            <Layout.Section>
              <div
                style={{
                  border: "#4fc0e8 2px solid",
                  marginTop: "20px",
                  borderRadius: "12px",
                }}
              >
                <Card title="Current Packers" sectioned>
                  <SkeletonBodyText lines={3} />
                </Card>
              </div>
              <div
                style={{
                  border: "#4fc0e8 2px solid",
                  marginTop: "20px",
                  borderRadius: "12px",
                }}
              >
                <Card title="Create New Lists" sectioned>
                  <SkeletonBodyText lines={3} />
                </Card>
              </div>
              <div
                style={{
                  border: "#4fc0e8 2px solid",
                  marginTop: "20px",
                  borderRadius: "12px",
                }}
              >
                <Card title="Add/Remove Packers" sectioned>
                  <SkeletonBodyText lines={3} />
                </Card>
              </div>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      ) : (
        <div>
          <div style={{ margin: "10px 0 0 20px" }}>
            <Button onClick={() => switchPage("home")}>Lists</Button>
          </div>
          <div>
            <Frame>
              <Page>
                <div>{toastMarkup}</div>
                <div>{errorToastMarkup}</div>
                <div
                  style={{
                    border: "#4fc0e8 2px solid",
                    marginTop: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <Card title="Current Packers">
                    <div style={{ padding: "25px 0" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          marginRight: "15%",
                        }}
                      >
                        <List type="number">
                          {admin_data.currentWorkers.map((worker) => (
                            <List.Item>{worker}</List.Item>
                          ))}
                        </List>
                        <div>
                          <TextContainer>
                            <Heading>
                              Orders Left: {admin_data.ordersLeft}
                            </Heading>
                            <Heading>
                              Last Updated: {admin_data.lastUpdated}
                            </Heading>
                          </TextContainer>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                <div
                  style={{
                    border: "#4fc0e8 2px solid",
                    marginTop: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <Card title="Create New Lists">
                    <div style={{ padding: "25px" }}>
                      {/* <div className="rowBorder" style={{display:'flex', paddingLeft:'12px'}}> 
                        <h1 style={{fontSize:"2.6rem", fontWeight:"600", lineHeight:"3rem", display:'inline-block', paddingLeft:"10px", marginBottom: '10px'}}>Working Lists</h1>
                        </div>
                        <div className="rowBorder listNames">
                            <Heading element="h1">Michael's List (dynamic)</Heading>
                        </div>
                        <div className="addListContainer">
                            <input type="text" id="addListInput"></input>
                            <span><Heading element="h1">'s List</Heading></span>
                            <span id="addListIcon">                        
                                <Icon source={AddMajor} color="base" />
                            </span>
                        </div> */}
                      <DatePicker
                        month={month}
                        year={year}
                        onChange={setSelectedDates}
                        onMonthChange={handleMonthChange}
                        selected={selectedDates}
                        allowRange
                      />

                      <TextField
                        label="Add Tag"
                        type="text"
                        value={textFieldValue}
                        onChange={handleTextFieldChange}
                        autoComplete="off"
                        connectedRight={<Button onClick={addTag}>Add</Button>}
                      />

                      <div style={{ margin: "10px" }}>{tagMarkup}</div>

                      <OptionList
                        title="Who's working?"
                        onChange={setAddingWorkers}
                        options={allWorkersInputs}
                        selected={addingWorkers}
                        allowMultiple
                      />
                      <div style={{ padding: "0 0 15px 15px" }}>
                        {addingWorkers.length > 0 ? (
                          <Button
                            primary
                            onClick={() => newList(addingWorkers)}
                          >
                            Create Lists
                          </Button>
                        ) : (
                          <Button disabled>Create Lists</Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
                <div
                  style={{
                    border: "#4fc0e8 2px solid",
                    marginTop: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <Card title="Add/Remove Packers">
                    <OptionList
                      onChange={setDeletingWorkers}
                      options={allWorkersInputs}
                      selected={deletingWorkers}
                      allowMultiple
                    />
                    {deletingWorkers.length > 0 ? (
                      <div
                        style={{ padding: "0 0 20px 20px", color: "#bf0711" }}
                      >
                        <Button
                          monochrome
                          outline
                          onClick={() => deleteWorkers(deletingWorkers)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{ padding: "0 0 20px 20px", color: "#8ca0b4" }}
                      >
                        <Button monochrome outline disabled>
                          Remove
                        </Button>
                      </div>
                    )}
                    <div style={{ padding: "0 20px 20px 20px" }}>
                      <TextField
                        label="New Packer"
                        value={addWorkerInput}
                        onChange={handleAddWorker}
                        labelAction={{
                          content: "Add",
                          onAction: () => addWorkers(addWorkerInput),
                        }}
                      />
                    </div>
                  </Card>
                </div>
                <div
                  style={{
                    border: "#4fc0e8 2px solid",
                    marginTop: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <Card title="Orders By Packers">
                    {order_data !== null ? (
                      <>
                        <ResourceList
                          resourceName={{ singular: "order", plural: "orders" }}
                          items={order_data}
                          renderItem={(item, i) => {
                            const { worker, orders } = item;
                            {
                              console.log(worker);
                            }
                            // const media = <Avatar order size="medium" name={worker} />;

                            return (
                              <CollapsibleTab
                                worker={worker}
                                orders={orders}
                              ></CollapsibleTab>
                              // <ResourceItem
                              //     onClick={openOrders}
                              //     // id={orders[0].id}
                              //     // url={url}
                              //     media={media}
                              //   >
                              //     <h3>
                              //       <TextStyle variation="strong">{order_data.worker}</TextStyle>
                              //     </h3>
                              //     {/* <div>{location}</div> */}
                              //   <Collapsible
                              //     open={expanded}
                              //     id="basic-collapsible"
                              //     transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                              //     expandOnPrint
                              //   >
                              //     <TextContainer>
                              //       <p>
                              //         Your mailing list lets you contact customers or visitors who
                              //         have shown an interest in your store. Reach out to them with
                              //         exclusive offers or updates about your products.
                              //       </p>
                              //     </TextContainer>
                              //   </Collapsible>
                              // </ResourceItem>
                            );
                          }}
                        />
                        <div style={{ display: "flex" }}>
                          <GetCsv orderData={order_data} />
                          <GetSku1Csv orderData={order_data} />
                          <GetSku2Csv orderData={order_data} />
                          <GetSkippedCsv products={skipped_data} />
                          <GetLocateCsv orderData={order_data} />
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </Card>
                </div>
              </Page>
            </Frame>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;
