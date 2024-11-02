import { useHistoryState } from "wouter-preact/use-browser-location";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SuccessPage = () => {
  const { details } = useHistoryState();
  console.log(details);
  const BLINK_API_BASE_URL = import.meta.env.VITE_BLINK_API_BASE_URL;
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary">
          Blink generated successfully
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="my-2 space-y-2">
          <div>
            You will receive the payments at{" "}
            <strong>{`${details?.merchantWalletAddress}`}</strong>
          </div>
          <div>
            You will receive the placed orders at{" "}
            <strong>{`${details?.merchantEmail}`}</strong>
          </div>
        </div>
        <div>Here's the blink link:</div>
        <div className="text-blue-500">
          <a
            href={`${BLINK_API_BASE_URL}/newOrder/${details.merchantUserName}/${details.productUUID}/stageEmail`}
          >{`${BLINK_API_BASE_URL}/newOrder/${details.merchantUserName}/${details.productUUID}/stageEmail`}</a>
        </div>
        <div>
          You can preview the blink by unfurling here. {" "}
          <a href="https://dial.to/">https://dial.to/</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessPage;
