"use client";

import { useCallback } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import type { Result } from "@zxing/library";
import { BarcodeStringFormat } from "react-qr-barcode-scanner";

export default function BarcodeScanner() {
  const scanBarcodeHandler = useCallback(
    (err: unknown, result?: Result) => {
      if (result) {
        const code = result.getText();
        console.log("SCANNED:", code);
        alert(code);
      }
    },
    []
  );

  return (
    <div className="w-full  bg-black">
      <BarcodeScannerComponent
        width="100%"
        height="100%"
        facingMode="environment"
        formats={[BarcodeStringFormat.QR_CODE]}
        onUpdate={scanBarcodeHandler}
      />
    </div>
  );
}
