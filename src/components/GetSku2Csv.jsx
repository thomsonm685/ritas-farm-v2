import { Button } from "@shopify/polaris";
import downloadSkuTwoCsv from "../assets/downloadSkuTwoCsv";

const GetSku2Csv = (orderData) => {
  const downloadCsv = downloadSkuTwoCsv;

  return (
    <div style={{ padding: "20px 16px" }}>
      <Button primary onClick={() => downloadCsv(orderData)}>
        SKU 2 Orders CSV
      </Button>
    </div>
  );
};

export default GetSku2Csv;
