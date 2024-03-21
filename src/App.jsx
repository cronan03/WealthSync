import "./App.css";
import { ReclaimClient } from "@reclaimprotocol/js-sdk";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "./components/Navbar";

function App() {
  // State variables
  const [url, setUrl] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);

  // Function to handle verification request
  const getVerificationReq = async () => {
    try {
      // Constants for app ID and secret
      const APP_ID = "0x67D6CCaFA3d34084f1759d16387610968a55723b";
      const APP_SECRET =
        "0x50edf0ef3f4750f299614cd7562f70cd621fe1c3407a64d3eaf2f8de1a275d37";

      // Initialize ReclaimClient
      const reclaimClient = new ReclaimClient(APP_ID);

      // Array of providers
      const providers = [
        "f6346b1b-be01-407c-b710-3d25ba8be92d", // Stock Provider (Crypto)
      ];

      // Build HTTP provider and requested proofs
      const providerV2 = await reclaimClient.buildHttpProviderV2ByID(providers);
      const requestProofs = reclaimClient.buildRequestedProofs(
        providerV2,
        reclaimClient.getAppCallbackUrl()
      );

      // Set signature and create verification request
      reclaimClient.setSignature(
        await reclaimClient.getSignature(requestProofs, APP_SECRET)
      );

      const reclaimReq = await reclaimClient.createVerificationRequest(
        providers
      );

      // Log template and start the request
      console.log("req", reclaimReq.template);
      const generatedUrl = await reclaimReq.start();
      console.log(generatedUrl);

      // Update state variables
      setUrl(generatedUrl);
      setShowQRCode(true);

      // Event handlers for success and error
      reclaimReq.on("success", (data) => {
        if (data) {
          const proofs = data;
          console.log(proofs);
        }
      });

      reclaimReq.on("error", (data) => {
        if (data) {
          const proofs = data;
          // TODO: update business logic based on proof generation failure
          console.log(proofs);
          const totalProfitLossValues = proofs.map((proof) => {
            const claimData = proof.claimData;
            const extractedParams = claimData.extractedParameterValues;
            const totalStocks = JSON.parse(extractedParams.Total_stocks);
            // Calculate total profit/loss for each cryptocurrency
            const totalPL = totalStocks.reduce(
              (acc, stock) => acc + stock.plValue,
              0
            );
            return totalPL;
          });
          const overallTotalProfitLoss = totalProfitLossValues.reduce(
            (acc, value) => acc + value,
            0
          );
          setTotalProfitLoss(overallTotalProfitLoss);
          console.log(totalProfitLoss);
        }
      });
    } catch (error) {
      console.error("Error during verification request:", error);
    }
  };

  // useEffect to call getVerificationReq once when the component mounts
  useEffect(() => {
    getVerificationReq();
  }, []); // Empty dependency array ensures it runs only once on mount

  useEffect(() => {
    console.log("Total Profit/Loss:", totalProfitLoss);
  }, [totalProfitLoss]); // Run the effect whenever totalProfitLoss changes
  
  return (
    <>
      <Navbar />
      <div className="Display-Card">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {totalProfitLoss}
            </h6>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the cards content.
            </p>
            <a href="#" className="card-link">
              Card link
            </a>
            <a href="#" className="card-link">
              Another link
            </a>
          </div>
        </div>
      </div>
      {showQRCode && (
        <div className="qr">
          <QRCode value={url} />
        </div>
      )}
    </>
  );
}

export default App;
