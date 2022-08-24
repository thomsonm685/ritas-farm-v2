const downloadLocateCsvFunc = async ({ orderData }) => {
  let rows = [];
  // Data In Columns
  orderData.forEach((workerObj) => {
    workerObj.orders.forEach((order) => {
      // rows.push([
      //     "ORDER NO.",
      //     // "Box Number"	            Dont need? UNADDED!!!
      //     "CUSTOMER NAME",
      //     "PHONE NUMBER",
      //     "EMAIL",
      //     "DELIVERY INSTRUCTIONS",
      //     "POSTAL ADDRESS" ,
      //     "ADDRESS 2",
      //     "SUBURB",
      //     "STATE",
      //     "POSTCODE",
      //     // Time_window_start        UNADDED!!!
      //     // Time_window_end          UNADDED!!!
      //     // Type	                    UNADDED!!!
      //     // BOXES	                orders.???? UNADDED!!!
      //     "PACKER"
      // ])
      const formattedAddy =
        `${
          order.shippingAddress ? order.shippingAddress.address1 : ""
        }`.replace(/,/g, "") +
        `${
          order.shippingAddress ? order.shippingAddress.address2 : ""
        }`.replace(/,/g, "") +
        "," +
        `${order.shippingAddress ? order.shippingAddress.city : ""}`.replace(
          /,/g,
          ""
        ) +
        "," +
        `${
          order.shippingAddress ? order.shippingAddress.province : ""
        }`.replace(/,/g, "") +
        "," +
        `${order.shippingAddress ? order.shippingAddress.zip : ""}`.replace(
          /,/g,
          ""
        ) +
        "END_ADDY";

      console.log("formattedAddy:", formattedAddy);

      rows.push([
        formattedAddy,
        5,
        `${
          order.tags.filter(
            (t) => t.match(/^([0-9]+)-([0-9]+)-([0-9]+)$/g) !== null
          )[0]
        }`
          .replace(/,/g, "")
          .replace(/-/g, "/"),
        `${order.shippingAddress ? order.shippingAddress.name : ""}`.replace(
          /,/g,
          ""
        ),
        `${order.customer.phone}`.replace(/,/g, ""),
        `${order.customer.email}`.replace(/,/g, ""),
        " ",
        " ",
        " ",
        `${order.note}`.replace(/,/g, ""),
        " ",
        " ",
        " ",
        " ",
        " ",

        // `RFP-HD-${order.name.slice(1)}`.replace(/,/g, ""),
        // `RFP-HD-${order.name.slice(1)}-1`.replace(/,/g, ""),
        // `${order.shippingAddress ? order.shippingAddress.name:''}`.replace(/,/g, ""),
        // `${order.customer.phone}`.replace(/,/g, ""),
        // `${order.customer.email}`.replace(/,/g, ""),
        // `${order.note}`.replace(/,/g, ""),
        // `${order.shippingAddress ? order.shippingAddress.address1:''}`.replace(/,/g, ""),
        // `${order.shippingAddress ? order.shippingAddress.address2:''}`.replace(/,/g, ""),
        // `${order.shippingAddress ? order.shippingAddress.city:''}`.replace(/,/g, ""),
        // `${order.shippingAddress ? order.shippingAddress.province:''}`.replace(/,/g, ""),
        // `${order.shippingAddress ? order.shippingAddress.zip:''}`.replace(/,/g, ""),
        // // Time_window_start       UNADDED!!!
        // // Time_window_end         UNADDED!!!
        // // Type	                   UNADDED!!!
        // // BOXES	               orders.???? UNADDED!!!
        // `${workerObj.worker}`.replace(/,/g, ""),
      ]);
    });
  });

  // Column Titles
  rows.unshift([
    "Address(Required)",
    "Stop Duration (in minutes)",
    "TripDate(Optional)",
    "ContactName (Optional)",
    "ContactPhone (Optional)",
    "ContactEmail (Optional)",
    "AppointmentTime (Optional)  (24-hour time format)",
    "TimeWindowStart (Optional) (24-hour time format)",
    "TimeWindowEnd (Optional)  (24-hour time format)",
    "Notes (Optional)",
    "Team Member Name (Optional)",
    "StopSequenceNumber (Optional)",
    "StopName (Optional)",
    "Team Region (Optional)",
    "Customer Name (Optional)",
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((row) => row.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);

  console.log(encodedUri);
  encodedUri = encodedUri.replace(
    /Customer%20Name%20\(Optional\)%0A/g,
    'Customer%20Name%20(Optiona)%0A"'
  );
  encodedUri = encodedUri.replace(/END_ADDY/g, '"');

  console.log(encodedUri);

  //https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
  function join(t, a, s) {
    function format(m) {
      let f = new Intl.DateTimeFormat("en", m);
      return f.format(t);
    }
    return a.map(format).join(s);
  }

  let a = [{ day: "numeric" }, { month: "short" }, { year: "numeric" }];
  let theDate = join(new Date(), a, "/");

  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Orders-${theDate}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();

  return csvContent;
};

export default downloadLocateCsvFunc;

// const rows = [
//     ["name1", "city1", "some other info"],
//     ["name2", "city2", "more info"]
// ];

// let csvContent = "data:text/csv;charset=utf-8,";

// rows.forEach(function(rowArray) {
//     let row = rowArray.join(",");
//     csvContent += row + "\r\n";
// });

// workerObjects.forEach => workerObj

// DATA WE NEED:
// ORDER NO.                workerObj.orders.order.name
// Box Number	            Dont need? UNADDED!!!
// CUSTOMER NAME	        workerObj.orders.order.customer.displayName
// PHONE NUMBER	            workerObj.orders.order.customer.phone
// EMAIL	                workerObj.orders.order.customer.email
// DELIVERY INSTRUCTIONS    UNADDED!!!
// POSTAL ADDRESS           workerObj.orders.orders.customers.addresses.address1
// ADDRESS 2	            workerObj.orders.orders.customers.addresses.address2
// SUBURB	                workerObj.orders.orders.customers.addresses.city
// STATE	                workerObj.orders.orders.customers.addresses.province
// POSTCODE	                workerObj.orders.orders.customers.addresses.zip
// Time_window_start        UNADDED!!!
// Time_window_end          UNADDED!!!
// Type	                    UNADDED!!!
// BOXES	                orders.???? UNADDED!!!
// PACKER                   workerObj.worker
