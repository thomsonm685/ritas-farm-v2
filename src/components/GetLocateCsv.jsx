import { Button } from "@shopify/polaris";
import downloadLocateCsvFunc from "../assets/downloadLocateCsvFunc";

const GetLocateCsv = (orderData) => {
  const downloadCsv = downloadLocateCsvFunc;

  return (
    <div style={{ padding: "20px 16px" }}>
      <Button primary onClick={() => downloadCsv(orderData)}>
        Locate2You Orders CSV
      </Button>
    </div>
  );
};

export default GetLocateCsv;
