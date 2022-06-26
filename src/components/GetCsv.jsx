import { Button } from "@shopify/polaris";
import downloadCsvFunc from "../assets/downloadCsvFunc";

const GetCsv = (orderData) => {
  const downloadCsv = downloadCsvFunc;

  return (
    <div style={{ padding: "20px 16px" }}>
      <Button primary onClick={() => downloadCsv(orderData)}>
        Orders CSV
      </Button>
    </div>
  );
};

export default GetCsv;
