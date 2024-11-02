import { Route } from "wouter-preact";
import AddProduct from "./components/AddProduct";
import SuccessPage from "./components/SuccessPage";
import { Toaster } from "./components/ui/toaster";
import WalletContextProvider from "./components/WalletContextProvider";

export default function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <Route path="/addProductSuccess">
            <SuccessPage />
          </Route>
          <Route path="/">
            <AddProduct />
          </Route>
          <Toaster />
        </div>
      </div>
    </WalletContextProvider>
  );
}
