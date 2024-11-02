import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "preact/hooks";
import AddProductForm from "../AddProductForm";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AddProduct = () => {
  const { connection } = useConnection();
  const { publicKey, disconnecting } = useWallet();

  useEffect(() => {
    console.log(publicKey?.toBase58());
  }, [publicKey]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Add New Product
          <WalletMultiButton />{" "}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-md font-medium pb-4">
          Before proceeding, please connect to your wallet at which you would
          like to receive payments.
        </div>
        <AddProductForm merchantWalletAddress={publicKey?.toBase58()} />
      </CardContent>
    </Card>
  );
};

export default AddProduct;
