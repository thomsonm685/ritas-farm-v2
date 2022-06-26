import { Button } from "@shopify/polaris";
import downloadSkuOneCsv from "../assets/downloadSkuOneCsv";

const GetSku1Csv = (orderData) => {
  const downloadCsv = downloadSkuOneCsv;

  return (
    <div style={{ padding: "20px 16px" }}>
      <Button primary onClick={() => downloadCsv(orderData)}>
        SKU 1 Orders CSV
      </Button>
    </div>
  );
};

export default GetSku1Csv;
