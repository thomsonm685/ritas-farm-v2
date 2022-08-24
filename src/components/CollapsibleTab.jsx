import {
  ResourceList,
  ResourceItem,
  TextStyle,
  Collapsible,
  Avatar,
  DataTable,
} from "@shopify/polaris";
import { useState } from "react";

const CollapsibleTab = ({ worker, orders }) => {
  const [expanded, setExpanded] = useState(false);

  const openOrders = () => {
    // let contentContainer = e.target;
    // console.log(contentContainer)
    // Polaris-Collapsible--isFullyClosed
    setExpanded(!expanded);
  };
  const media = <Avatar order size="medium" name={worker} />;

  const rows = [];

  orders.forEach((order) => {
    rows.push([
      order.name,
      order.shippingAddress ? order.shippingAddress.name : "No Name",
    ]);
  });

  console.log(orders);

  // return(
  // <ResourceList
  //   resourceName={{singular: 'order', plural: 'orders'}}
  //   items={order_data}
  //   renderItem={(item,i) => {
  //     const {worker, orders} = item;
  //     const media = <Avatar order size="medium" name={worker} />;

  return (
    <ResourceItem
      onClick={openOrders}
      // id={orders[0].id}
      // url={url}
      media={media}
    >
      <h3>
        <TextStyle variation="strong">{worker}</TextStyle>
      </h3>
      {/* <div>{location}</div> */}
      <Collapsible
        open={expanded}
        id="basic-collapsible"
        transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        expandOnPrint
      >
        <DataTable
          columnContentTypes={["text", "text"]}
          headings={["Order Number", "Customer"]}
          rows={rows}
        />
      </Collapsible>
    </ResourceItem>
  );
  //   }}
  // />
  // )
};

export default CollapsibleTab;
