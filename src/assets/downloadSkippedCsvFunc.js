const downloadSkippedCsvFunc = async ({ products }) => {
  products = products[0].products;
  let rows = [];
  // Data In Columns
  products.forEach((product) => {
    console.log("product", product);
    rows.push([
      `${product.number}`.replace(/(,|#)/g, ""),
      `${product.name}`.replace(/,/g, ""),
      `${product.quantity}`.replace(/,/g, ""),
      `${product.product}`.replace(/,/g, ""),
    ]);
  });

  // Column Titles
  rows.unshift(["ORDER NO.", "CUSTOMER NAME", "QUANTITY", "PRODUCT"]);

  console.log("rows", rows);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((row) => row.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);

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
  link.setAttribute("download", `SkippedProducts-${theDate}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();

  return csvContent;
};

export default downloadSkippedCsvFunc;

// const rows = [
//     ["name1", "city1", "some other info"],
//     ["name2", "city2", "more info"]
// ];

// let csvContent = "data:text/csv;charset=utf-8,";

// rows.forEach(function(rowArray) {
//     let row = rowArray.join(",");
//     csvContent += row + "\r\n";
// });

// productects.forEach => product

// DATA WE NEED:
// ORDER NO.                product.orders.order.name
// Box Number	            Dont need? UNADDED!!!
// CUSTOMER NAME	        product.orders.order.customer.displayName
// PHONE NUMBER	            product.orders.order.customer.phone
// EMAIL	                product.orders.order.customer.email
// DELIVERY INSTRUCTIONS    UNADDED!!!
// POSTAL ADDRESS           product.orders.orders.customers.addresses.address1
// ADDRESS 2	            product.orders.orders.customers.addresses.address2
// SUBURB	                product.orders.orders.customers.addresses.city
// STATE	                product.orders.orders.customers.addresses.province
// POSTCODE	                product.orders.orders.customers.addresses.zip
// Time_window_start        UNADDED!!!
// Time_window_end          UNADDED!!!
// Type	                    UNADDED!!!
// BOXES	                orders.???? UNADDED!!!
// PACKER                   product.worker
