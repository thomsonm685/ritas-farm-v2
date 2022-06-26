import { Button } from "@shopify/polaris";
import downloadSkippedCsvFunc from "../assets/downloadSkippedCsvFunc";

const GetSkippedCsv = (products) => {
  const downloadCsv = downloadSkippedCsvFunc;

  return (
    <div style={{ padding: "20px 16px" }}>
      <Button primary onClick={() => downloadCsv(products)}>
        Skipped Products CSV
      </Button>
    </div>
  );
};

export default GetSkippedCsv;
